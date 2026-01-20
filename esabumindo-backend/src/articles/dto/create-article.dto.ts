// src/articles/dto/create-article.dto.ts - UPDATED

import {
  IsString,
  IsOptional,
  IsEnum,
  IsNotEmpty,
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

  // For paragraph & heading
  @IsOptional()
  @IsString()
  content?: string;

  // For heading
  @IsOptional()
  level?: number; // 2, 3, 4

  // For image
  @IsOptional()
  @IsEnum(['single', 'double', 'grid'])
  layout?: 'single' | 'double' | 'grid';

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  images?: ImageDto[];
}

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  slug?: string; // Optional karena auto-generate

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
  status?: string;

  // ✅ NEW: Content Blocks (array of blocks)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  contentBlocks: ContentBlockDto[];
}
