// src/articles/dto/create-article.dto.ts

import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsString()
  author?: string; // Akan diisi dari user yang login

  @IsOptional()
  @IsEnum(['draft', 'published'])
  status?: string;
}
