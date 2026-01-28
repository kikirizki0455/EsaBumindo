import { IsDateString, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProductionPlanDto {
  @IsDateString()
  planDate: string; // ISO date string

  @IsString()
  plant: string; // P1, P2, BOTH

  @IsString()
  reactor: string; // A, B, C, D

  @IsString()
  productId: string; // Product ID (bisa format UUID atau string biasa)

  @IsNumber()
  targetQty: number;

  @IsString()
  noLot: string; // Manual input No Lot

  @IsOptional()
  @IsString()
  noBpm?: string; // Auto-generated No BPM

  @IsOptional()
  @IsString()
  notes?: string;
}
