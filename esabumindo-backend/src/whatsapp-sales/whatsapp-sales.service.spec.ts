import { Prisma, SalesAgent, WaRotationStrategy } from '@prisma/client';
import {
  WhatsAppSalesService,
  normalizePhone,
  buildWaUrl,
} from './whatsapp-sales.service';

// Unit test murni: PrismaService tidak dibutuhkan untuk fungsi yang diuji.
// `pick` bersifat private, dipanggil lewat cast ke any.

function agent(partial: Partial<SalesAgent> & { id: string }): SalesAgent {
  return {
    name: partial.id,
    phone: '628000000000',
    isActive: true,
    weight: 1,
    sortOrder: 0,
    totalClicks: 0,
    lastAssignedAt: null,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ...partial,
  };
}

function txWithLoad(load: Record<string, number>): Prisma.TransactionClient {
  return {
    waClick: {
      groupBy: jest.fn(async () =>
        Object.entries(load).map(([salesId, n]) => ({
          salesId,
          _count: { _all: n },
        })),
      ),
    },
  } as unknown as Prisma.TransactionClient;
}

describe('normalizePhone', () => {
  it.each([
    ['081234567890', '6281234567890'],
    ['0812-3456-7890', '6281234567890'],
    ['+62 812 3456 7890', '6281234567890'],
    ['6281234567890', '6281234567890'],
    ['62081234567890', '6281234567890'],
    ['81234567890', '6281234567890'],
  ])('%s -> %s', (input, expected) => {
    expect(normalizePhone(input)).toBe(expected);
  });
});

describe('buildWaUrl', () => {
  it('encodes greeting as wa.me text param', () => {
    expect(buildWaUrl('628123', 'Halo, saya tanya')).toBe(
      'https://wa.me/628123?text=Halo%2C%20saya%20tanya',
    );
  });
  it('omits text when greeting empty', () => {
    expect(buildWaUrl('628123', '')).toBe('https://wa.me/628123');
  });
});

describe('WhatsAppSalesService.pick', () => {
  const service = new WhatsAppSalesService({} as any);
  const pick = (
    agents: SalesAgent[],
    strategy: WaRotationStrategy,
    load: Record<string, number> = {},
  ) => (service as any).pick(txWithLoad(load), agents, strategy);

  describe('ROUND_ROBIN', () => {
    it('prefers agent never assigned, then oldest lastAssignedAt', async () => {
      const agents = [
        agent({ id: 'a', lastAssignedAt: new Date('2026-01-03'), sortOrder: 1 }),
        agent({ id: 'b', lastAssignedAt: new Date('2026-01-01'), sortOrder: 2 }),
        agent({ id: 'c', lastAssignedAt: null, sortOrder: 3 }),
      ];
      expect((await pick(agents, 'ROUND_ROBIN')).id).toBe('c');
      agents[2].lastAssignedAt = new Date('2026-01-05');
      expect((await pick(agents, 'ROUND_ROBIN')).id).toBe('b');
    });

    it('breaks ties by sortOrder', async () => {
      const t = new Date('2026-01-01');
      const agents = [
        agent({ id: 'x', lastAssignedAt: t, sortOrder: 5 }),
        agent({ id: 'y', lastAssignedAt: t, sortOrder: 2 }),
      ];
      expect((await pick(agents, 'ROUND_ROBIN')).id).toBe('y');
    });

    it('cycles fairly over a full sequence', async () => {
      const agents = [
        agent({ id: 'a', sortOrder: 1 }),
        agent({ id: 'b', sortOrder: 2 }),
        agent({ id: 'c', sortOrder: 3 }),
      ];
      const seq: string[] = [];
      for (let i = 0; i < 6; i++) {
        const chosen = await pick(agents, 'ROUND_ROBIN');
        chosen.lastAssignedAt = new Date(2026, 0, 1, 0, i);
        seq.push(chosen.id);
      }
      expect(seq).toEqual(['a', 'b', 'c', 'a', 'b', 'c']);
    });
  });

  describe('LEAST_ASSIGNED', () => {
    it('chooses agent with fewest clicks in window', async () => {
      const agents = [agent({ id: 'a' }), agent({ id: 'b' }), agent({ id: 'c' })];
      expect((await pick(agents, 'LEAST_ASSIGNED', { a: 5, b: 2, c: 9 })).id).toBe('b');
    });
    it('treats missing agent as zero clicks', async () => {
      const agents = [agent({ id: 'a' }), agent({ id: 'b' })];
      expect((await pick(agents, 'LEAST_ASSIGNED', { a: 1 })).id).toBe('b');
    });
  });

  describe('WEIGHTED_ROUND_ROBIN', () => {
    it('divides load by weight', async () => {
      // a: 4/2 = 2, b: 3/1 = 3 → a
      const agents = [agent({ id: 'a', weight: 2 }), agent({ id: 'b', weight: 1 })];
      expect((await pick(agents, 'WEIGHTED_ROUND_ROBIN', { a: 4, b: 3 })).id).toBe('a');
    });
    it('converges to weight ratio', async () => {
      const agents = [agent({ id: 'a', weight: 1 }), agent({ id: 'b', weight: 2 })];
      const load: Record<string, number> = { a: 0, b: 0 };
      for (let i = 0; i < 12; i++) {
        const chosen = await pick(agents, 'WEIGHTED_ROUND_ROBIN', load);
        load[chosen.id]++;
        chosen.lastAssignedAt = new Date(2026, 0, 1, 0, i);
      }
      expect(load).toEqual({ a: 4, b: 8 });
    });
  });

  describe('RANDOM', () => {
    it('always returns an active agent and respects weights roughly', async () => {
      const agents = [agent({ id: 'a', weight: 1 }), agent({ id: 'b', weight: 3 })];
      const count: Record<string, number> = { a: 0, b: 0 };
      for (let i = 0; i < 2000; i++) count[(await pick(agents, 'RANDOM')).id]++;
      expect(count.a + count.b).toBe(2000);
      expect(count.b).toBeGreaterThan(count.a * 2); // ekspektasi 3:1
    });
  });
});
