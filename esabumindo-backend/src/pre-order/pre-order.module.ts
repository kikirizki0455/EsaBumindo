import { Module } from '@nestjs/common';
import { PreOrderController } from './pre-order.controller';
import { PreOrderService } from './pre-order.service';
import { WhatsAppService } from './whatsapp.service';

@Module({
  controllers: [PreOrderController],
  providers: [PreOrderService, WhatsAppService],
  exports: [PreOrderService, WhatsAppService],
})
export class PreOrderModule {}
