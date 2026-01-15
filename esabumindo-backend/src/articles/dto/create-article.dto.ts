// src/articles/dto/create-article.dto.ts

import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsIn(['draft', 'published'])
  @IsOptional()
  status?: string;
}
