import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { IsUndefinable } from './is-undefinable.decorator';

export const PHONE_INPUT_PATTERN = /^[+\d][\d\s-]{7,20}$/;

export const trimString = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CreateSalesAgentDto {
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name: string;

  // Terima 08xx, +62xx, 62xx, boleh ada spasi/strip. Dinormalisasi dan
  // divalidasi ulang (harus 62xxxxxxxx) di service.
  @IsString()
  @IsNotEmpty()
  @Matches(PHONE_INPUT_PATTERN, { message: 'Nomor WhatsApp tidak valid' })
  phone: string;

  @IsUndefinable()
  @IsBoolean()
  isActive?: boolean;

  @IsUndefinable()
  @IsInt()
  @Min(1)
  @Max(100)
  weight?: number;

  @IsUndefinable()
  @IsInt()
  @Min(0)
  @Max(100000)
  sortOrder?: number;
}
