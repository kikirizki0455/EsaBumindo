import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Prisma,
  SalesAgent,
  WaRotationStrategy,
  WaSetting,
} from '@prisma/client';
import { createHmac } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSalesAgentDto } from './dto/create-sales-agent.dto';
import { UpdateSalesAgentDto } from './dto/update-sales-agent.dto';
import { UpdateWaSettingDto } from './dto/update-wa-setting.dto';

/** Jendela maksimum hitung beban untuk LEAST_ASSIGNED / WEIGHTED_ROUND_ROBIN. */
export const WINDOW_DAYS = 30;
const DAY_MS = 86_400_000;
const SETTING_ID = 'default';
const MAX_ASSIGN_ATTEMPTS = 5;

export interface WaAssignment {
  salesId: string | null;
  salesName: string;
  phone: string;
  waUrl: string;
  sticky: boolean;
  strategy: WaRotationStrategy;
}

export interface AssignInput {
  visitorId?: string | null;
  page?: string | null;
  userAgent?: string | null;
  ip?: string | null;
}

/** Normalisasi nomor ke format internasional tanpa plus: 62xxxxxxxxxx */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  if (digits.startsWith('620')) return `62${digits.slice(3)}`;
  if (digits.startsWith('8')) return `62${digits}`;
  return digits;
}

/** Nomor Indonesia setelah dinormalisasi: 62 + 8 s.d. 13 digit. */
export function isValidWaPhone(phone: string): boolean {
  return /^62\d{8,13}$/.test(phone);
}

export function buildWaUrl(phone: string, greeting: string): string {
  const text = greeting ? `?text=${encodeURIComponent(greeting)}` : '';
  return `https://wa.me/${phone}${text}`;
}

const BOT_UA =
  /googlebot|bingbot|yandex|baiduspider|duckduckbot|slurp|ahrefs|semrush|mj12bot|dotbot|petalbot|bytespider|gptbot|claudebot|applebot|facebookexternalhit|twitterbot|linkedinbot|telegrambot|slackbot|discordbot|whatsapp\/|crawler|spider|headlesschrome|lighthouse|pingdom|uptimerobot|statuscake/i;

/**
 * Crawler, pembuat pratinjau link, dan uptime monitor yang dikenal.
 * User-agent kosong juga dianggap bukan pengunjung.
 */
export function isLikelyBot(userAgent?: string | null): boolean {
  if (!userAgent || !userAgent.trim()) return true;
  return BOT_UA.test(userAgent);
}

function prismaErrorCode(err: unknown): string | undefined {
  return err instanceof Prisma.PrismaClientKnownRequestError
    ? err.code
    : undefined;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Urutan giliran: belum pernah dapat → paling lama tidak dapat → sortOrder. */
function byTurn(a: SalesAgent, b: SalesAgent): number {
  const ta = a.lastAssignedAt?.getTime() ?? -1;
  const tb = b.lastAssignedAt?.getTime() ?? -1;
  if (ta !== tb) return ta - tb;
  if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
  return a.createdAt.getTime() - b.createdAt.getTime();
}

@Injectable()
export class WhatsAppSalesService {
  private readonly ipSecret: string;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.ipSecret = this.config.get<string>('JWT_SECRET') ?? '';
  }

  // ---------------------------------------------------------------
  // Settings
  // ---------------------------------------------------------------

  async getSetting(): Promise<WaSetting> {
    const found = await this.prisma.waSetting.findUnique({
      where: { id: SETTING_ID },
    });
    if (found) return found;
    try {
      return await this.prisma.waSetting.create({ data: { id: SETTING_ID } });
    } catch (err) {
      // Dua request pertama bersamaan: yang kalah cukup membaca ulang.
      if (prismaErrorCode(err) === 'P2002') {
        return this.prisma.waSetting.findUniqueOrThrow({
          where: { id: SETTING_ID },
        });
      }
      throw err;
    }
  }

  async updateSetting(dto: UpdateWaSettingDto): Promise<WaSetting> {
    const current = await this.getSetting();
    const data: Prisma.WaSettingUpdateInput = {};

    if (dto.strategy !== undefined) data.strategy = dto.strategy;
    if (dto.stickyDays !== undefined) data.stickyDays = dto.stickyDays;
    if (dto.greeting !== undefined) data.greeting = dto.greeting.trim();
    if (dto.fallbackPhone !== undefined) {
      data.fallbackPhone = dto.fallbackPhone.trim()
        ? this.toValidPhone(dto.fallbackPhone)
        : null;
    }
    // Ganti metode = hitungan beban dimulai dari nol, supaya angka dari
    // metode lama tidak membuat satu sales dibanjiri klik.
    if (dto.strategy !== undefined && dto.strategy !== current.strategy) {
      data.rotationEpoch = new Date();
    }

    return this.prisma.waSetting.update({ where: { id: SETTING_ID }, data });
  }

  /**
   * Mulai ulang hitungan beban rotasi (log klik tidak dihapus).
   * Dipanggil saat susunan sales berubah: sales baru, diaktifkan kembali,
   * atau bobot diubah. Tanpa ini sales yang baru masuk punya beban 0 dan
   * akan menerima semua klik sampai menyamai yang lain.
   */
  private async restartRotation(): Promise<void> {
    await this.getSetting();
    await this.prisma.waSetting.update({
      where: { id: SETTING_ID },
      data: { rotationEpoch: new Date() },
    });
  }

  private toValidPhone(raw: string): string {
    const phone = normalizePhone(raw);
    if (!isValidWaPhone(phone)) {
      throw new BadRequestException(
        'Nomor WhatsApp harus nomor Indonesia yang valid, contoh 0812xxxxxxxx atau 62812xxxxxxxx',
      );
    }
    return phone;
  }

  // ---------------------------------------------------------------
  // Sales agent CRUD
  // ---------------------------------------------------------------

  async findAll(): Promise<SalesAgent[]> {
    return this.prisma.salesAgent.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findOne(id: string): Promise<SalesAgent> {
    const agent = await this.prisma.salesAgent.findUnique({ where: { id } });
    if (!agent) throw new NotFoundException('Sales tidak ditemukan');
    return agent;
  }

  private async assertPhoneFree(phone: string, exceptId?: string) {
    const clash = await this.prisma.salesAgent.findFirst({
      where: { phone, ...(exceptId ? { NOT: { id: exceptId } } : {}) },
    });
    if (clash) {
      throw new ConflictException(
        `Nomor ${phone} sudah terdaftar atas nama ${clash.name}`,
      );
    }
  }

  async create(dto: CreateSalesAgentDto): Promise<SalesAgent> {
    const phone = this.toValidPhone(dto.phone);
    await this.assertPhoneFree(phone);
    const maxOrder = await this.prisma.salesAgent.aggregate({
      _max: { sortOrder: true },
    });

    let created: SalesAgent;
    try {
      created = await this.prisma.salesAgent.create({
        data: {
          name: dto.name,
          phone,
          isActive: dto.isActive ?? true,
          weight: dto.weight ?? 1,
          sortOrder: dto.sortOrder ?? (maxOrder._max.sortOrder ?? 0) + 1,
        },
      });
    } catch (err) {
      // Dua admin menyimpan nomor yang sama bersamaan → index unik menolak.
      if (prismaErrorCode(err) === 'P2002') {
        throw new ConflictException(`Nomor ${phone} sudah terdaftar`);
      }
      throw err;
    }

    if (created.isActive) await this.restartRotation();
    return created;
  }

  async update(id: string, dto: UpdateSalesAgentDto): Promise<SalesAgent> {
    const existing = await this.findOne(id);
    const data: Prisma.SalesAgentUpdateInput = {};

    if (dto.name !== undefined) data.name = dto.name;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    if (dto.weight !== undefined) data.weight = dto.weight;
    if (dto.sortOrder !== undefined) data.sortOrder = dto.sortOrder;
    if (dto.phone !== undefined) {
      const phone = this.toValidPhone(dto.phone);
      if (phone !== existing.phone) await this.assertPhoneFree(phone, id);
      data.phone = phone;
    }

    let updated: SalesAgent;
    try {
      updated = await this.prisma.salesAgent.update({ where: { id }, data });
    } catch (err) {
      if (prismaErrorCode(err) === 'P2002') {
        throw new ConflictException('Nomor tersebut sudah terdaftar');
      }
      throw err;
    }

    const reactivated = !existing.isActive && updated.isActive;
    const weightChanged = existing.weight !== updated.weight;
    if (reactivated || weightChanged) await this.restartRotation();
    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.salesAgent.delete({ where: { id } });
    return { success: true };
  }

  /** Nolkan counter dan urutan giliran, lalu mulai ulang hitungan beban. */
  async resetCounters() {
    await this.prisma.salesAgent.updateMany({
      data: { totalClicks: 0, lastAssignedAt: null },
    });
    await this.restartRotation();
    return { success: true };
  }

  // ---------------------------------------------------------------
  // Stats
  // ---------------------------------------------------------------

  async stats(days = WINDOW_DAYS) {
    const since = new Date(Date.now() - days * DAY_MS);
    const [setting, agents, grouped] = await Promise.all([
      this.getSetting(),
      this.findAll(),
      this.prisma.waClick.groupBy({
        by: ['salesId', 'sticky'],
        where: { createdAt: { gte: since } },
        _count: { _all: true },
        _max: { createdAt: true },
      }),
    ]);

    const perSales = new Map<
      string,
      { fresh: number; returning: number; last: Date | null }
    >();
    for (const row of grouped) {
      const entry = perSales.get(row.salesId) ?? {
        fresh: 0,
        returning: 0,
        last: null,
      };
      if (row.sticky) entry.returning += row._count._all;
      else entry.fresh += row._count._all;
      const last = row._max.createdAt;
      if (last && (!entry.last || last > entry.last)) entry.last = last;
      perSales.set(row.salesId, entry);
    }

    const active = agents.filter((a) => a.isActive);
    const activeWeight = active.reduce((sum, a) => sum + a.weight, 0);
    const usesWeight =
      setting.strategy === WaRotationStrategy.WEIGHTED_ROUND_ROBIN ||
      setting.strategy === WaRotationStrategy.RANDOM;

    let totalFresh = 0;
    let totalReturning = 0;
    for (const entry of perSales.values()) {
      totalFresh += entry.fresh;
      totalReturning += entry.returning;
    }

    const round1 = (n: number) => Math.round(n * 10) / 10;

    return {
      windowDays: days,
      strategy: setting.strategy,
      rotationEpoch: setting.rotationEpoch,
      totalClicks: totalFresh + totalReturning,
      newClicks: totalFresh,
      stickyClicks: totalReturning,
      activeAgents: active.length,
      totalAgents: agents.length,
      agents: agents.map((a) => {
        const entry = perSales.get(a.id);
        const fresh = entry?.fresh ?? 0;
        const returning = entry?.returning ?? 0;
        // Porsi ideal mengikuti metode aktif: rata untuk giliran / paling
        // sedikit, sebanding bobot untuk metode berbobot / acak.
        let expected = 0;
        if (a.isActive && active.length > 0) {
          expected = usesWeight
            ? (a.weight / activeWeight) * 100
            : 100 / active.length;
        }
        return {
          ...a,
          clicksInWindow: fresh + returning,
          newInWindow: fresh,
          returningInWindow: returning,
          // Porsi dihitung dari klik baru saja; klik pengunjung kembali
          // bukan hasil rotasi.
          sharePct: round1(totalFresh ? (fresh / totalFresh) * 100 : 0),
          expectedSharePct: round1(expected),
          lastClickAt: entry?.last ?? null,
        };
      }),
    };
  }

  async recentClicks(limit = 50) {
    const take = Math.min(Math.max(Math.trunc(limit) || 50, 1), 200);
    return this.prisma.waClick.findMany({
      take,
      orderBy: { createdAt: 'desc' },
      include: { sales: { select: { id: true, name: true, phone: true } } },
    });
  }

  // ---------------------------------------------------------------
  // Rotation core
  // ---------------------------------------------------------------

  /** HMAC ber-kunci rahasia server: hash IP tidak bisa ditebak balik offline. */
  hashIp(ip?: string | null): string | null {
    if (!ip || !this.ipSecret) return null;
    return createHmac('sha256', this.ipSecret)
      .update(ip)
      .digest('hex')
      .slice(0, 32);
  }

  /**
   * Pilih sales untuk pengunjung, catat klik, kembalikan URL wa.me.
   * Dijalankan dalam transaksi Serializable dengan retry supaya dua klik
   * bersamaan tidak jatuh ke sales yang sama.
   */
  async assign(input: AssignInput): Promise<WaAssignment> {
    const setting = await this.getSetting();
    const click = {
      visitorId: input.visitorId?.trim().slice(0, 64) || null,
      page: input.page?.trim().slice(0, 300) || null,
      userAgent: input.userAgent?.slice(0, 300) || null,
      ipHash: this.hashIp(input.ip),
    };

    for (let attempt = 1; attempt <= MAX_ASSIGN_ATTEMPTS; attempt++) {
      try {
        return await this.prisma.$transaction(
          (tx) => this.assignInTx(tx, setting, click),
          { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        );
      } catch (err) {
        // P2034 = konflik serialisasi antar transaksi bersamaan.
        if (prismaErrorCode(err) !== 'P2034') throw err;
        if (attempt === MAX_ASSIGN_ATTEMPTS) break;
        await sleep(15 * attempt + Math.random() * 25);
      }
    }
    throw new ServiceUnavailableException(
      'Sistem sedang sibuk, silakan coba lagi',
    );
  }

  private async assignInTx(
    tx: Prisma.TransactionClient,
    setting: WaSetting,
    click: {
      visitorId: string | null;
      page: string | null;
      userAgent: string | null;
      ipHash: string | null;
    },
  ): Promise<WaAssignment> {
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

    const result = (agent: SalesAgent, sticky: boolean): WaAssignment => ({
      salesId: agent.id,
      salesName: agent.name,
      phone: agent.phone,
      waUrl: buildWaUrl(agent.phone, setting.greeting),
      sticky,
      strategy: setting.strategy,
    });

    // 1) Pengunjung kembali → sales yang sama. Klik ini hanya dicatat;
    //    tidak memakai giliran dan tidak menambah beban rotasi, karena
    //    prospeknya sama (bukan lead baru).
    if (click.visitorId && setting.stickyDays > 0) {
      const since = new Date(Date.now() - setting.stickyDays * DAY_MS);
      const previous = await tx.waClick.findFirst({
        where: { visitorId: click.visitorId, createdAt: { gte: since } },
        orderBy: { createdAt: 'desc' },
        select: { salesId: true },
      });
      const same = previous && agents.find((a) => a.id === previous.salesId);
      if (same) {
        await tx.waClick.create({
          data: { ...click, salesId: same.id, sticky: true },
        });
        return result(same, true);
      }
    }

    // 2) Lead baru → rotasi.
    const chosen = await this.pick(tx, agents, setting);
    await tx.salesAgent.update({
      where: { id: chosen.id },
      data: { totalClicks: { increment: 1 }, lastAssignedAt: new Date() },
    });
    await tx.waClick.create({
      data: { ...click, salesId: chosen.id, sticky: false },
    });
    return result(chosen, false);
  }

  private async pick(
    tx: Prisma.TransactionClient,
    agents: SalesAgent[],
    setting: Pick<WaSetting, 'strategy' | 'rotationEpoch'>,
  ): Promise<SalesAgent> {
    if (setting.strategy === WaRotationStrategy.ROUND_ROBIN) {
      // Least-recently-assigned: setara giliran murni, tetapi tetap benar
      // saat sales ditambah, dihapus, atau dinonaktifkan.
      return [...agents].sort(byTurn)[0];
    }

    if (setting.strategy === WaRotationStrategy.RANDOM) {
      const total = agents.reduce((sum, a) => sum + a.weight, 0);
      let r = Math.random() * total;
      for (const a of agents) {
        r -= a.weight;
        if (r <= 0) return a;
      }
      return agents[agents.length - 1];
    }

    // LEAST_ASSIGNED & WEIGHTED_ROUND_ROBIN: beban = jumlah lead baru sejak
    // hitungan dimulai (rotationEpoch), paling lama WINDOW_DAYS ke belakang.
    const since = new Date(
      Math.max(
        Date.now() - WINDOW_DAYS * DAY_MS,
        setting.rotationEpoch.getTime(),
      ),
    );
    const grouped = await tx.waClick.groupBy({
      by: ['salesId'],
      where: {
        createdAt: { gte: since },
        sticky: false,
        salesId: { in: agents.map((a) => a.id) },
      },
      _count: { _all: true },
    });
    const load = new Map(grouped.map((g) => [g.salesId, g._count._all]));
    const weighted =
      setting.strategy === WaRotationStrategy.WEIGHTED_ROUND_ROBIN;
    const score = (a: SalesAgent) => {
      const clicks = load.get(a.id) ?? 0;
      return weighted ? clicks / Math.max(a.weight, 1) : clicks;
    };

    return [...agents].sort((a, b) => score(a) - score(b) || byTurn(a, b))[0];
  }
}
