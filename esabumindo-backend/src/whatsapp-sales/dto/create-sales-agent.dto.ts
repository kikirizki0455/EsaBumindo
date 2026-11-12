import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateSalesAgentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  // Terima 08xx, +62xx, 62xx, boleh ada spasi/strip. Dinormalisasi di service.
  @IsString()
  @IsNotEmpty()
  @Matches(/^[+\d][\d\s\-]{7,20}$/, {
    message: 'Nomor WhatsApp tidak valid',
  })
  phone: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  weight?: number;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
