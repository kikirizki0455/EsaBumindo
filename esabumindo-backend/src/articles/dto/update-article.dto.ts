import { IsOptional, IsString, IsIn, MaxLength } from 'class-validator';

export class UpdateArticleDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string; // ✅ IZINKAN

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsIn(['draft', 'published'])
  status?: 'draft' | 'published';
}
