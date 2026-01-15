// src/articles/dto/update-article.dto.ts

import { IsString, IsOptional, IsIn, IsDate } from 'class-validator';

export class UpdateArticleDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsIn(['draft', 'published'])
  @IsOptional()
  status?: string;

  @IsDate()
  @IsOptional()
  publishedAt?: Date;
}
