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
import { PHONE_INPUT_PATTERN, trimString } from './create-sales-agent.dto';

// Ditulis eksplisit (bukan PartialType) karena PartialType memakai
// @IsOptional(), yang meloloskan `null` ke kolom NOT NULL.
export class UpdateSalesAgentDto {
  @IsUndefinable()
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name?: string;

  @IsUndefinable()
  @IsString()
  @IsNotEmpty()
  @Matches(PHONE_INPUT_PATTERN, { message: 'Nomor WhatsApp tidak valid' })
  phone?: string;

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
