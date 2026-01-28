import { Module } from '@nestjs/common';
import { ProductionService } from './services/production.service';
import { ProductionController } from './controllers/production.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductionController],
  providers: [ProductionService],
  exports: [ProductionService],
})
export class ProductionModule {}
