import { Module } from '@nestjs/common';
import { WhatsAppSalesController } from './whatsapp-sales.controller';
import { WhatsAppSalesService } from './whatsapp-sales.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WhatsAppSalesController],
  providers: [WhatsAppSalesService],
  exports: [WhatsAppSalesService],
})
export class WhatsAppSalesModule {}
