import { WaRotationStrategy } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { IsUndefinable } from './is-undefinable.decorator';

export class UpdateWaSettingDto {
  @IsUndefinable()
  @IsEnum(WaRotationStrategy)
  strategy?: WaRotationStrategy;

  @IsUndefinable()
  @IsInt()
  @Min(0)
  @Max(365)
  stickyDays?: number;

  // String kosong diperbolehkan: tombol membuka WhatsApp tanpa pesan pembuka.
  @IsUndefinable()
  @IsString()
  @MaxLength(500)
  greeting?: string;

  // String kosong = hapus nomor fallback.
  @IsUndefinable()
  @IsString()
  @Matches(/^$|^[+\d][\d\s-]{7,20}$/, {
    message: 'Nomor fallback tidak valid',
  })
  fallbackPhone?: string;
}
