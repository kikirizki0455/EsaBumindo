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
import { WhatsAppSalesService } from './whatsapp-sales.service';
import { CreateSalesAgentDto } from './dto/create-sales-agent.dto';
import { UpdateSalesAgentDto } from './dto/update-sales-agent.dto';
import { UpdateWaSettingDto } from './dto/update-wa-setting.dto';
import { WaClickDto } from './dto/wa-click.dto';

function clientIp(req: Request): string | undefined {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string') return fwd.split(',')[0].trim();
  return req.ip;
}

@Controller('wa')
export class WhatsAppSalesController {
  constructor(private readonly service: WhatsAppSalesService) {}

  // ---------------- PUBLIC ----------------

  /** Dipanggil tombol WA di website. Mengembalikan URL wa.me sales terpilih. */
  @Post('click')
  @Throttle({ short: { ttl: 1000, limit: 5 }, medium: { ttl: 10000, limit: 30 }, long: { ttl: 60000, limit: 60 } })
  async click(@Body() dto: WaClickDto, @Req() req: Request) {
    const result = await this.service.assign({
      visitorId: dto.visitorId,
      page: dto.page,
      userAgent: req.headers['user-agent'],
      ip: clientIp(req),
    });
    // Jangan bocorkan nomor sales di response selain lewat URL yang memang dibuka
    return {
      waUrl: result.waUrl,
      salesName: result.salesName,
      sticky: result.sticky,
    };
  }

  /** Fallback tanpa JavaScript: <a href="/api/wa/redirect"> → 302 ke wa.me */
  @Get('redirect')
  @Throttle({ short: { ttl: 1000, limit: 5 }, medium: { ttl: 10000, limit: 30 }, long: { ttl: 60000, limit: 60 } })
  async redirect(
    @Query('v') visitorId: string | undefined,
    @Query('page') page: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const result = await this.service.assign({
      visitorId: visitorId?.slice(0, 64),
      page: page?.slice(0, 300),
      userAgent: req.headers['user-agent'],
      ip: clientIp(req),
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
  stats(@Query('days') days?: string) {
    const d = Math.min(Math.max(parseInt(days ?? '30', 10) || 30, 1), 365);
    return this.service.stats(d);
  }

  @Get('clicks')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DIREKTUR, Role.ADMIN)
  clicks(@Query('limit') limit?: string) {
    return this.service.recentClicks(parseInt(limit ?? '50', 10) || 50);
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

  @Post('sales/reset-counters')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DIREKTUR)
  reset() {
    return this.service.resetCounters();
  }
}
