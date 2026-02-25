import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { PreOrderService } from './pre-order.service';
import { CreatePreOrderDto } from './dto/create-pre-order.dto';
import { AntiSpamGuard } from '../common/guards/anti-spam.guard';

@Controller('pre-order')
export class PreOrderController {
  constructor(private readonly preOrderService: PreOrderService) {}

  @Post()
  @UseGuards(AntiSpamGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createPreOrder(@Body() dto: CreatePreOrderDto, @Req() req: Request) {
    try {
      // Log security info from guard
      const securityInfo = (req as any).securityInfo;
      if (securityInfo) {
        console.log(
          `📋 Pre-order from IP: ${securityInfo.clientIP}, Spam Score: ${securityInfo.spamScore}`,
        );
      }

      const result = await this.preOrderService.createPreOrder(dto);
      return result;
    } catch (error) {
      console.error('❌ Pre-order error:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          message: `Gagal memproses pre-order: ${error.message}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
