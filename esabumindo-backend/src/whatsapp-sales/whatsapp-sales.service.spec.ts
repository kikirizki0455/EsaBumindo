import {
  BadRequestException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Prisma,
  SalesAgent,
  WaClick,
  WaRotationStrategy,
  WaSetting,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  WhatsAppSalesService,
  buildWaUrl,
  isLikelyBot,
  isValidWaPhone,
  normalizePhone,
} from './whatsapp-sales.service';

const T0 = new Date('2026-03-01T00:00:00Z').getTime();
const MINUTE = 60_000;
const DAY = 86_400_000;

function agent(partial: Partial<SalesAgent> & { id: string }): SalesAgent {
  return {
    name: partial.id,
    phone: `62800000000${partial.id.charCodeAt(0)}`,
    isActive: true,
    weight: 1,
    sortOrder: 0,
    totalClicks: 0,
    lastAssignedAt: null,
    createdAt: new Date(T0 - DAY),
    updatedAt: new Date(T0 - DAY),
    ...partial,
  };
}

interface ClickWhere {
  visitorId?: string;
  sticky?: boolean;
  createdAt?: { gte: Date };
  salesId?: { in: string[] };
}

/** Prisma tiruan di memori: cukup untuk method yang dipakai service. */
class FakeDb {
  agents: SalesAgent[] = [];
  clicks: WaClick[] = [];
  conflictsToThrow = 0;
  transactions = 0;
  setting: WaSetting = {
    id: 'default',
    strategy: WaRotationStrategy.ROUND_ROBIN,
    stickyDays: 7,
    greeting: 'Halo',
    fallbackPhone: null,
    rotationEpoch: new Date(T0 - 365 * DAY),
    updatedAt: new Date(T0),
  };

  private matches(click: WaClick, where: ClickWhere): boolean {
    if (where.visitorId !== undefined && click.visitorId !== where.visitorId)
      return false;
    if (where.sticky !== undefined && click.sticky !== where.sticky)
      return false;
    if (where.createdAt && click.createdAt < where.createdAt.gte) return false;
    if (where.salesId && !where.salesId.in.includes(click.salesId))
      return false;
    return true;
  }

  readonly client = {
    waSetting: {
      findUnique: () => Promise.resolve(this.setting),
    },
    salesAgent: {
      findMany: (args: { where?: { isActive?: boolean } }) =>
        Promise.resolve(
          this.agents
            .filter(
              (a) =>
                args.where?.isActive === undefined ||
                a.isActive === args.where.isActive,
            )
            .sort((a, b) => a.sortOrder - b.sortOrder),
        ),
      update: (args: {
        where: { id: string };
        data: { totalClicks?: { increment: number }; lastAssignedAt?: Date };
      }) => {
        const found = this.agents.find((a) => a.id === args.where.id)!;
        found.totalClicks += args.data.totalClicks?.increment ?? 0;
        if (args.data.lastAssignedAt)
          found.lastAssignedAt = args.data.lastAssignedAt;
        return Promise.resolve(found);
      },
    },
    waClick: {
      findFirst: (args: { where: ClickWhere }) =>
        Promise.resolve(
          this.clicks
            .filter((c) => this.matches(c, args.where))
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0] ??
            null,
        ),
      create: (args: { data: Omit<WaClick, 'id' | 'createdAt'> }) => {
        const row: WaClick = {
          ...args.data,
          id: `click-${this.clicks.length + 1}`,
          createdAt: new Date(),
        };
        this.clicks.push(row);
        return Promise.resolve(row);
      },
      groupBy: (args: { where: ClickWhere }) => {
        const counts = new Map<string, number>();
        for (const c of this.clicks) {
          if (!this.matches(c, args.where)) continue;
          counts.set(c.salesId, (counts.get(c.salesId) ?? 0) + 1);
        }
        return Promise.resolve(
          [...counts].map(([salesId, n]) => ({
            salesId,
            _count: { _all: n },
          })),
        );
      },
    },
    $transaction: <T>(fn: (tx: unknown) => Promise<T>): Promise<T> => {
      this.transactions++;
      if (this.conflictsToThrow > 0) {
        this.conflictsToThrow--;
        return Promise.reject(
          new Prisma.PrismaClientKnownRequestError('write conflict', {
            code: 'P2034',
            clientVersion: 'test',
          }),
        );
      }
      return fn(this.client);
    },
  };

  addClick(salesId: string, at: number, sticky = false, visitorId = 'x') {
    this.clicks.push({
      id: `seed-${this.clicks.length + 1}`,
      salesId,
      visitorId,
      page: null,
      userAgent: null,
      ipHash: null,
      sticky,
      createdAt: new Date(at),
    });
  }
}

function makeService(db: FakeDb, secret = 'test-secret') {
  const config = { get: () => secret } as unknown as ConfigService;
  return new WhatsAppSalesService(
    db.client as unknown as PrismaService,
    config,
  );
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

describe('isValidWaPhone', () => {
  it('accepts normalized Indonesian numbers', () => {
    expect(isValidWaPhone('6281234567890')).toBe(true);
    expect(isValidWaPhone('622112345678')).toBe(true);
  });
  it('rejects numbers that are not 62 + 8..13 digits', () => {
    expect(isValidWaPhone('12345678')).toBe(false);
    expect(isValidWaPhone('62812')).toBe(false);
    expect(isValidWaPhone('6591234567')).toBe(false);
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

describe('isLikelyBot', () => {
  it('flags crawlers, link previewers, monitors and empty user agents', () => {
    expect(isLikelyBot('Mozilla/5.0 (compatible; Googlebot/2.1)')).toBe(true);
    expect(isLikelyBot('facebookexternalhit/1.1')).toBe(true);
    expect(isLikelyBot('WhatsApp/2.23.20.0 A')).toBe(true);
    expect(isLikelyBot('Mozilla/5.0 (compatible; UptimeRobot/2.0)')).toBe(true);
    expect(isLikelyBot('')).toBe(true);
    expect(isLikelyBot(undefined)).toBe(true);
  });
  it('does not flag real browsers, including phones named like "bot"', () => {
    expect(
      isLikelyBot(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
      ),
    ).toBe(false);
    expect(
      isLikelyBot(
        'Mozilla/5.0 (Linux; Android 11; CUBOT NOTE 20 PRO) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36',
      ),
    ).toBe(false);
  });
});

describe('WhatsAppSalesService', () => {
  let db: FakeDb;
  let service: WhatsAppSalesService;
  let now: number;

  /** Satu klik, lalu waktu maju 1 menit supaya urutan giliran tidak seri. */
  const click = async (visitorId: string | null) => {
    const result = await service.assign({ visitorId });
    now += MINUTE;
    jest.setSystemTime(now);
    return result;
  };
  const names = async (visitors: (string | null)[]) => {
    const out: string[] = [];
    for (const v of visitors) out.push((await click(v)).salesName);
    return out;
  };

  beforeEach(() => {
    // Hanya jam yang dipalsukan; setTimeout tetap asli (dipakai backoff retry).
    jest.useFakeTimers({
      doNotFake: [
        'setTimeout',
        'clearTimeout',
        'setImmediate',
        'clearImmediate',
        'setInterval',
        'clearInterval',
        'nextTick',
        'queueMicrotask',
        'performance',
      ],
    });
    now = T0;
    jest.setSystemTime(now);
    db = new FakeDb();
    db.agents = [
      agent({ id: 'a', sortOrder: 1 }),
      agent({ id: 'b', sortOrder: 2 }),
      agent({ id: 'c', sortOrder: 3 }),
    ];
    service = makeService(db);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('ROUND_ROBIN', () => {
    it('gives each new visitor the next sales in turn', async () => {
      expect(await names(['v1', 'v2', 'v3', 'v4', 'v5', 'v6'])).toEqual([
        'a',
        'b',
        'c',
        'a',
        'b',
        'c',
      ]);
    });

    it('skips deactivated sales and gives a new sales the next turn once', async () => {
      await names(['v1', 'v2', 'v3']);
      db.agents[1].isActive = false;
      db.agents.push(agent({ id: 'd', sortOrder: 4 }));
      expect(await names(['v4', 'v5', 'v6', 'v7'])).toEqual([
        'd',
        'a',
        'c',
        'd',
      ]);
    });
  });

  describe('returning visitor (sticky)', () => {
    it('goes back to the same sales without using up a turn', async () => {
      expect(await names(['v1', 'v2'])).toEqual(['a', 'b']);

      const again = await click('v1');
      expect(again.salesName).toBe('a');
      expect(again.sticky).toBe(true);

      // Giliran berikutnya tetap milik c, lalu a: klik ulang v1 tidak
      // menggeser a ke belakang antrean.
      expect(await names(['v3', 'v4'])).toEqual(['c', 'a']);
      expect(db.clicks.filter((c) => c.sticky)).toHaveLength(1);
      expect(db.agents[0].totalClicks).toBe(2);
    });

    it('is ignored when stickyDays is 0', async () => {
      db.setting.stickyDays = 0;
      expect(await names(['v1', 'v1', 'v1'])).toEqual(['a', 'b', 'c']);
    });

    it('expires after stickyDays', async () => {
      await click('v1');
      now += 8 * DAY;
      jest.setSystemTime(now);
      const later = await click('v1');
      expect(later.sticky).toBe(false);
      expect(later.salesName).toBe('b');
    });

    it('falls back to rotation when the previous sales is no longer active', async () => {
      await click('v1');
      db.agents[0].isActive = false;
      const next = await click('v1');
      expect(next.sticky).toBe(false);
      expect(next.salesName).toBe('b');
    });

    it('treats a blank visitor id as anonymous', async () => {
      expect(await names(['', '  ', null])).toEqual(['a', 'b', 'c']);
      expect(db.clicks.every((c) => c.visitorId === null)).toBe(true);
    });
  });

  describe('LEAST_ASSIGNED', () => {
    beforeEach(() => {
      db.setting.strategy = WaRotationStrategy.LEAST_ASSIGNED;
      db.setting.rotationEpoch = new Date(T0 - DAY);
    });

    it('chooses the sales with the fewest new leads since the epoch', async () => {
      db.addClick('a', T0 - 1000);
      db.addClick('a', T0 - 900);
      db.addClick('c', T0 - 800);
      expect((await click('v1')).salesName).toBe('b');
    });

    it('does not count returning-visitor clicks or clicks before the epoch', async () => {
      db.addClick('b', T0 - 1000, true); // sticky
      db.addClick('b', T0 - 2 * DAY); // sebelum epoch
      db.addClick('a', T0 - 500);
      db.addClick('c', T0 - 400);
      expect((await click('v1')).salesName).toBe('b');
    });

    it('does not flood a sales added after the others already have leads', async () => {
      db.agents = db.agents.slice(0, 2);
      for (let i = 0; i < 20; i++) db.addClick(i % 2 ? 'a' : 'b', T0 - 1000);
      // Sales baru masuk → service menggeser epoch ke "sekarang".
      db.agents.push(agent({ id: 'c', sortOrder: 3 }));
      db.setting.rotationEpoch = new Date(T0);

      const got = await names(['v1', 'v2', 'v3', 'v4', 'v5', 'v6']);
      expect(got.filter((n) => n === 'c')).toHaveLength(2);
      expect(got.filter((n) => n === 'a')).toHaveLength(2);
      expect(got.filter((n) => n === 'b')).toHaveLength(2);
    });
  });

  describe('WEIGHTED_ROUND_ROBIN', () => {
    it('converges to the weight ratio', async () => {
      db.setting.strategy = WaRotationStrategy.WEIGHTED_ROUND_ROBIN;
      db.setting.rotationEpoch = new Date(T0 - DAY);
      db.agents = [
        agent({ id: 'a', sortOrder: 1, weight: 1 }),
        agent({ id: 'b', sortOrder: 2, weight: 2 }),
      ];
      const got = await names(
        Array.from({ length: 12 }, (_, i) => `v${i + 1}`),
      );
      expect(got.filter((n) => n === 'a')).toHaveLength(4);
      expect(got.filter((n) => n === 'b')).toHaveLength(8);
    });
  });

  describe('RANDOM', () => {
    it('only returns listed sales and roughly follows weights', async () => {
      db.setting.strategy = WaRotationStrategy.RANDOM;
      db.setting.stickyDays = 0;
      db.agents = [
        agent({ id: 'a', sortOrder: 1, weight: 1 }),
        agent({ id: 'b', sortOrder: 2, weight: 3 }),
      ];
      const count: Record<string, number> = { a: 0, b: 0 };
      for (let i = 0; i < 2000; i++) {
        count[(await service.assign({ visitorId: null })).salesName]++;
      }
      expect(count.a + count.b).toBe(2000);
      // Ekspektasi 3:1 (b ≈ 1500). Batas longgar agar tidak flaky.
      expect(count.b).toBeGreaterThan(1300);
      expect(count.b).toBeLessThan(1700);
    });
  });

  describe('no active sales', () => {
    beforeEach(() => {
      db.agents.forEach((a) => (a.isActive = false));
    });

    it('uses the fallback number and records nothing', async () => {
      db.setting.fallbackPhone = '6281200000000';
      const result = await service.assign({ visitorId: 'v1' });
      expect(result.salesId).toBeNull();
      expect(result.waUrl).toBe('https://wa.me/6281200000000?text=Halo');
      expect(db.clicks).toHaveLength(0);
    });

    it('throws NotFound when no fallback number is set', async () => {
      await expect(service.assign({ visitorId: 'v1' })).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('concurrent write conflicts (P2034)', () => {
    it('retries and succeeds', async () => {
      db.conflictsToThrow = 2;
      const result = await service.assign({ visitorId: 'v1' });
      expect(result.salesName).toBe('a');
      expect(db.transactions).toBe(3);
    });

    it('gives up with 503 after 5 attempts', async () => {
      db.conflictsToThrow = 99;
      await expect(service.assign({ visitorId: 'v1' })).rejects.toBeInstanceOf(
        ServiceUnavailableException,
      );
      expect(db.transactions).toBe(5);
      expect(db.clicks).toHaveLength(0);
    });
  });

  describe('hashIp', () => {
    it('is deterministic, keyed by the server secret, and never the raw IP', () => {
      const h1 = service.hashIp('203.0.113.7');
      expect(h1).toMatch(/^[0-9a-f]{32}$/);
      expect(service.hashIp('203.0.113.7')).toBe(h1);
      expect(service.hashIp('203.0.113.8')).not.toBe(h1);
      expect(makeService(db, 'other-secret').hashIp('203.0.113.7')).not.toBe(
        h1,
      );
      expect(service.hashIp(undefined)).toBeNull();
    });
  });

  describe('create', () => {
    it('rejects a number that is not a valid Indonesian WhatsApp number', async () => {
      await expect(
        service.create({ name: 'X', phone: '12345678' }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});
