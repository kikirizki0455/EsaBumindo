import { IsUUID, IsNumber, IsString } from 'class-validator';

export class WarehouseConfirmMaterialDto {
  @IsUUID()
  productionOrderDetailId: string;

  @IsString()
  lotNumber: string;

  @IsNumber()
  actualQty: number;

  @IsUUID()
  warehouseId: string;
}
