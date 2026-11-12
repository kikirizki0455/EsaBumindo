import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma, SalesAgent, WaRotationStrategy } from '@prisma/client';
import { createHash } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSalesAgentDto } from './dto/create-sales-agent.dto';
import { UpdateSalesAgentDto } from './dto/update-sales-agent.dto';
import { UpdateWaSettingDto } from './dto/update-wa-setting.dto';

const WINDOW_DAYS = 30; // jendela hitung beban untuk strategi berbasis jumlah klik
const SETTING_ID = 'default';

export interface WaAssignment {
  salesId: string | null;
  salesName: string;
  phone: string;
  waUrl: string;
  sticky: boolean;
  strategy: WaRotationStrategy;
}

/** Normalisasi nomor ke format internasional tanpa plus: 62xxxxxxxxxx */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  if (digits.startsWith('620')) return `62${digits.slice(3)}`;
  if (digits.startsWith('8')) return `62${digits}`;
  return digits;
}

export function buildWaUrl(phone: string, greeting: string): string {
  const text = greeting ? `?text=${encodeURIComponent(greeting)}` : '';
  return `https://wa.me/${phone}${text}`;
}

@Injectable()
export class WhatsAppSalesService {
  constructor(private prisma: PrismaService) {}

  // ---------------------------------------------------------------
  // Settings
  // ---------------------------------------------------------------

  async getSetting() {
    return this.prisma.waSetting.upsert({
      where: { id: SETTING_ID },
      update: {},
      create: { id: SETTING_ID },
    });
  }

  async updateSetting(dto: UpdateWaSettingDto) {
    const data: Prisma.WaSettingUpdateInput = { ...dto };
    if (dto.fallbackPhone !== undefined) {
      data.fallbackPhone = dto.fallbackPhone
        ? normalizePhone(dto.fallbackPhone)
        : null;
    }
    await this.getSetting();
    return this.prisma.waSetting.update({ where: { id: SETTING_ID }, data });
  }

  // ---------------------------------------------------------------
  // Sales agent CRUD
  // ---------------------------------------------------------------

  async findAll() {
    return this.prisma.salesAgent.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findOne(id: string) {
    const agent = await this.prisma.salesAgent.findUnique({ where: { id } });
    if (!agent) throw new NotFoundException('Sales tidak ditemukan');
    return agent;
  }

  async create(dto: CreateSalesAgentDto) {
    const phone = normalizePhone(dto.phone);
    const exists = await this.prisma.salesAgent.findFirst({ where: { phone } });
    if (exists) {
      throw new ConflictException(
        `Nomor ${phone} sudah terdaftar atas nama ${exists.name}`,
      );
    }
    const maxOrder = await this.prisma.salesAgent.aggregate({
      _max: { sortOrder: true },
    });
    return this.prisma.salesAgent.create({
      data: {
        name: dto.name.trim(),
        phone,
        isActive: dto.isActive ?? true,
        weight: dto.weight ?? 1,
        sortOrder: dto.sortOrder ?? (maxOrder._max.sortOrder ?? 0) + 1,
      },
    });
  }

  async update(id: string, dto: UpdateSalesAgentDto) {
    await this.findOne(id);
    const data: Prisma.SalesAgentUpdateInput = { ...dto };
    if (dto.name) data.name = dto.name.trim();
    if (dto.phone) {
      const phone = normalizePhone(dto.phone);
      const clash = await this.prisma.salesAgent.findFirst({
        where: { phone, NOT: { id } },
      });
      if (clash) {
        throw new ConflictException(
          `Nomor ${phone} sudah terdaftar atas nama ${clash.name}`,
        );
      }
      data.phone = phone;
    }
    return this.prisma.salesAgent.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.salesAgent.delete({ where: { id } });
    return { success: true };
  }

  async resetCounters() {
    await this.prisma.salesAgent.updateMany({
      data: { totalClicks: 0, lastAssignedAt: null },
    });
    return { success: true };
  }

  // ---------------------------------------------------------------
  // Stats
  // ---------------------------------------------------------------

  async stats(days = WINDOW_DAYS) {
    const since = new Date(Date.now() - days * 86400_000);
    const [agents, grouped, total, stickyCount] = await Promise.all([
      this.findAll(),
      this.prisma.waClick.groupBy({
        by: ['salesId'],
        where: { createdAt: { gte: since } },
        _count: { _all: true },
        _max: { createdAt: true },
      }),
      this.prisma.waClick.count({ where: { createdAt: { gte: since } } }),
      this.prisma.waClick.count({
        where: { createdAt: { gte: since }, sticky: true },
      }),
    ]);

    const byId = new Map(grouped.map((g) => [g.salesId, g]));
    const activeWeight = agents
      .filter((a) => a.isActive)
      .reduce((s, a) => s + a.weight, 0);

    const perAgent = agents.map((a) => {
      const g = byId.get(a.id);
      const clicks = g?._count._all ?? 0;
      const share = total ? (clicks / total) * 100 : 0;
      // porsi ideal: weight / total weight aktif (hanya untuk agent aktif)
      const expectedShare =
        a.isActive && activeWeight ? (a.weight / activeWeight) * 100 : 0;
      return {
        ...a,
        clicksInWindow: clicks,
        sharePct: Math.round(share * 10) / 10,
        expectedSharePct: Math.round(expectedShare * 10) / 10,
        lastClickAt: g?._max.createdAt ?? null,
      };
    });

    return {
      windowDays: days,
      totalClicks: total,
      stickyClicks: stickyCount,
      activeAgents: agents.filter((a) => a.isActive).length,
      totalAgents: agents.length,
      agents: perAgent,
    };
  }

  async recentClicks(limit = 50) {
    return this.prisma.waClick.findMany({
      take: Math.min(limit, 200),
      orderBy: { createdAt: 'desc' },
      include: { sales: { select: { id: true, name: true, phone: true } } },
    });
  }

  // ---------------------------------------------------------------
  // Rotation core
  // ---------------------------------------------------------------

  /**
   * Pilih sales untuk pengunjung, catat klik, kembalikan URL wa.me.
   * Dijalankan dalam transaksi Serializable + retry supaya dua klik
   * bersamaan tidak jatuh ke sales yang sama (fair under concurrency).
   */
  async assign(input: {
    visitorId?: string;
    page?: string;
    userAgent?: string;
    ip?: string;
  }): Promise<WaAssignment> {
    const setting = await this.getSetting();
    const ipHash = input.ip
      ? createHash('sha256').update(input.ip).digest('hex').slice(0, 32)
      : null;

    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        return await this.prisma.$transaction(
          async (tx) => {
            const agents = await tx.salesAgent.findMany({
              where: { isActive: true },
              orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
            });

            if (agents.length === 0) {
              if (!setting.fallbackPhone) {
                throw new NotFoundException(
                  'Belum ada sales aktif dan nomor fallback belum diatur',
                );
              }
              return {
                salesId: null,
                salesName: 'ESABOND',
                phone: setting.fallbackPhone,
                waUrl: buildWaUrl(setting.fallbackPhone, setting.greeting),
                sticky: false,
                strategy: setting.strategy,
              };
            }

            // 1) Sticky: pengunjung yang sama kembali ke sales yang sama
            let chosen: SalesAgent | null = null;
            let sticky = false;
            if (input.visitorId && setting.stickyDays > 0) {
              const since = new Date(
                Date.now() - setting.stickyDays * 86400_000,
              );
              const prev = await tx.waClick.findFirst({
                where: { visitorId: input.visitorId, createdAt: { gte: since } },
                orderBy: { createdAt: 'desc' },
                select: { salesId: true },
              });
              if (prev) {
                chosen = agents.find((a) => a.id === prev.salesId) ?? null;
                sticky = chosen !== null;
              }
            }

            // 2) Strategi rotasi
            if (!chosen) {
              chosen = await this.pick(tx, agents, setting.strategy);
            }

            // 3) Catat. Untuk klik sticky, counter tetap naik (beban nyata).
            await tx.salesAgent.update({
              where: { id: chosen.id },
              data: {
                totalClicks: { increment: 1 },
                lastAssignedAt: new Date(),
              },
            });
            await tx.waClick.create({
              data: {
                salesId: chosen.id,
                visitorId: input.visitorId ?? null,
                page: input.page ?? null,
                userAgent: input.userAgent?.slice(0, 300) ?? null,
                ipHash,
                sticky,
              },
            });

            return {
              salesId: chosen.id,
              salesName: chosen.name,
              phone: chosen.phone,
              waUrl: buildWaUrl(chosen.phone, setting.greeting),
              sticky,
              strategy: setting.strategy,
            };
          },
          { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        );
      } catch (err) {
        // P2034 = serialization conflict → coba lagi
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === 'P2034' &&
          attempt < 4
        ) {
          continue;
        }
        throw err;
      }
    }
    throw new BadRequestException('Gagal memilih sales, coba lagi');
  }

  private async pick(
    tx: Prisma.TransactionClient,
    agents: SalesAgent[],
    strategy: WaRotationStrategy,
  ): Promise<SalesAgent> {
    if (strategy === WaRotationStrategy.ROUND_ROBIN) {
      // Least-recently-assigned. Belum pernah dapat = prioritas pertama.
      // Setara round-robin murni tapi tahan terhadap tambah/hapus/nonaktif sales.
      return [...agents].sort((a, b) => {
        const ta = a.lastAssignedAt?.getTime() ?? -1;
        const tb = b.lastAssignedAt?.getTime() ?? -1;
        if (ta !== tb) return ta - tb;
        return a.sortOrder - b.sortOrder;
      })[0];
    }

    if (strategy === WaRotationStrategy.RANDOM) {
      const total = agents.reduce((s, a) => s + a.weight, 0);
      let r = Math.random() * total;
      for (const a of agents) {
        r -= a.weight;
        if (r <= 0) return a;
      }
      return agents[agents.length - 1];
    }

    // LEAST_ASSIGNED & WEIGHTED_ROUND_ROBIN: hitung beban 30 hari terakhir
    const since = new Date(Date.now() - WINDOW_DAYS * 86400_000);
    const grouped = await tx.waClick.groupBy({
      by: ['salesId'],
      where: { createdAt: { gte: since }, salesId: { in: agents.map((a) => a.id) } },
      _count: { _all: true },
    });
    const load = new Map(grouped.map((g) => [g.salesId, g._count._all]));

    const score = (a: SalesAgent) => {
      const clicks = load.get(a.id) ?? 0;
      return strategy === WaRotationStrategy.WEIGHTED_ROUND_ROBIN
        ? clicks / Math.max(a.weight, 1) // porsi relatif terhadap bobot
        : clicks;
    };

    return [...agents].sort((a, b) => {
      const d = score(a) - score(b);
      if (d !== 0) return d;
      const ta = a.lastAssignedAt?.getTime() ?? -1;
      const tb = b.lastAssignedAt?.getTime() ?? -1;
      if (ta !== tb) return ta - tb; // seri → yang paling lama tidak dapat
      return a.sortOrder - b.sortOrder;
    })[0];
  }
}
