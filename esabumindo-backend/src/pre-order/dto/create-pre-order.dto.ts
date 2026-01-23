import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsIn,
} from 'class-validator';

export class CreatePreOrderDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['direct', 'sample'])
  orderType: 'direct' | 'sample';

  @IsString()
  @IsNotEmpty()
  product: string;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsOptional()
  industri?: string;

  @IsNumber()
  @Min(1)
  @Max(100, { message: 'Jumlah sample maksimal 100 kg' })
  quantityKg: number;

  @IsString()
  @IsNotEmpty()
  packaging: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['email', 'whatsapp'])
  contactMethod: 'email' | 'whatsapp';
}
