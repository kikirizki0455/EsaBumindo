import { IsOptional, IsString, MaxLength } from 'class-validator';

export class WaClickDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  visitorId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  page?: string;
}
