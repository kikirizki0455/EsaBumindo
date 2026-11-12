import { WaRotationStrategy } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateWaSettingDto {
  @IsOptional()
  @IsEnum(WaRotationStrategy)
  strategy?: WaRotationStrategy;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(365)
  stickyDays?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  greeting?: string;

  @IsOptional()
  @IsString()
  @Matches(/^$|^[+\d][\d\s\-]{7,20}$/, {
    message: 'Nomor fallback tidak valid',
  })
  fallbackPhone?: string;
}
