import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Role } from '@prisma/client';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { WhatsAppSalesService, isLikelyBot } from './whatsapp-sales.service';
import { CreateSalesAgentDto } from './dto/create-sales-agent.dto';
import { UpdateSalesAgentDto } from './dto/update-sales-agent.dto';
import { UpdateWaSettingDto } from './dto/update-wa-setting.dto';
import { WaClickDto } from './dto/wa-click.dto';

const CLICK_THROTTLE = {
  short: { ttl: 1000, limit: 5 },
  medium: { ttl: 10000, limit: 30 },
  long: { ttl: 60000, limit: 60 },
};

/** Query string bisa berupa array/objek (?v=a&v=b); hanya string yang dipakai. */
function queryString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function toInt(value: unknown, fallback: number): number {
  const n = parseInt(queryString(value) ?? '', 10);
  return Number.isFinite(n) ? n : fallback;
}

@Controller('wa')
export class WhatsAppSalesController {
  constructor(private readonly service: WhatsAppSalesService) {}

  // ---------------- PUBLIC ----------------

  /** Dipanggil tombol WA di website. Mengembalikan URL wa.me sales terpilih. */
  @Post('click')
  @Throttle(CLICK_THROTTLE)
  async click(@Body() dto: WaClickDto, @Req() req: Request) {
    const result = await this.service.assign({
      visitorId: dto.visitorId,
      page: dto.page,
      userAgent: req.headers['user-agent'],
      // `trust proxy` aktif di main.ts, jadi req.ip sudah alamat klien yang
      // dilaporkan reverse proxy (bukan header X-Forwarded-For mentah yang
      // bisa dipalsukan klien).
      ip: req.ip,
    });
    // Nama sales tidak dikirim ke publik; nomor hanya muncul di URL wa.me.
    return { waUrl: result.waUrl, sticky: result.sticky };
  }

  /**
   * Cadangan jika browser tidak bisa membaca jawaban POST /wa/click
   * (jaringan / CORS): navigasi biasa ke sini → 302 ke wa.me.
   * Crawler dan uptime monitor yang dikenal tidak ikut memutar giliran.
   */
  @Get('redirect')
  @Throttle(CLICK_THROTTLE)
  async redirect(
    @Query('v') visitorId: unknown,
    @Query('page') page: unknown,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');

    const userAgent = req.headers['user-agent'];
    if (isLikelyBot(userAgent)) {
      res.status(204).end();
      return;
    }

    const result = await this.service.assign({
      visitorId: queryString(visitorId),
      page: queryString(page),
      userAgent,
      ip: req.ip,
    });
    res.redirect(302, result.waUrl);
  }

  // ---------------- ADMIN ----------------

  @Get('settings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DIREKTUR, Role.ADMIN)
  getSetting() {
    return this.service.getSetting();
  }

  @Patch('settings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DIREKTUR, Role.ADMIN)
  updateSetting(@Body() dto: UpdateWaSettingDto) {
    return this.service.updateSetting(dto);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DIREKTUR, Role.ADMIN)
  stats(@Query('days') days: unknown) {
    return this.service.stats(Math.min(Math.max(toInt(days, 30), 1), 365));
  }

  @Get('clicks')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DIREKTUR, Role.ADMIN)
  clicks(@Query('limit') limit: unknown) {
    return this.service.recentClicks(toInt(limit, 50));
  }

  @Get('sales')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DIREKTUR, Role.ADMIN)
  findAll() {
    return this.service.findAll();
  }

  @Post('sales')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DIREKTUR, Role.ADMIN)
  create(@Body() dto: CreateSalesAgentDto) {
    return this.service.create(dto);
  }

  @Patch('sales/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DIREKTUR, Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateSalesAgentDto) {
    return this.service.update(id, dto);
  }

  @Delete('sales/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DIREKTUR, Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  /** Mulai ulang giliran dan hitungan beban. Log klik tidak dihapus. */
  @Post('sales/reset-counters')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DIREKTUR)
  reset() {
    return this.service.resetCounters();
  }
}
