import { IsUUID, IsString, IsOptional, IsObject } from 'class-validator';

export class CreateProductionLogDto {
  role: string; // PPIC, WAREHOUSE, QC, PRODUCTION
  type: string; // INFO, DELAY, QC_REJECT, ADJUST, MATERIAL_OUT
  message: string;
  metadata?: Record<string, any>;
}
