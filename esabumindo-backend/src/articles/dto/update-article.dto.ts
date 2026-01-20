import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO for Image inside Image Block
class ImageDto {
  @IsString()
  url: string;

  @IsString()
  alt: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsString()
  width?: string; // "full" | "half" | "third"
}

// DTO for Content Block
class ContentBlockDto {
  @IsString()
  id: string;

  @IsEnum(['paragraph', 'heading', 'image'])
  type: 'paragraph' | 'heading' | 'image';

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  level?: number;

  @IsOptional()
  @IsEnum(['single', 'double', 'grid'])
  layout?: 'single' | 'double' | 'grid';

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  images?: ImageDto[];
}

export class UpdateArticleDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsEnum(['draft', 'published'])
  status?: 'draft' | 'published';

  // ✅ SAME STRUCTURE, BUT OPTIONAL
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  contentBlocks?: ContentBlockDto[];
}
