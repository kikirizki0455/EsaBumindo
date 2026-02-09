// src/articles/articles.controller.ts - UPDATED & FIXED

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import * as path from 'path';
import { ArticlesService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  // PUBLIC ENDPOINTS
  @Get('published')
  async findPublished() {
    return this.articlesService.findPublished();
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.articlesService.findBySlug(slug);
  }

  // ADMIN ENDPOINTS
  @Get()
  async findAll() {
    return this.articlesService.findAll();
  }

  @Get('stats')
  async getStats() {
    return this.articlesService.getStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.update(id, updateArticleDto);
  }

  @Patch(':id/toggle-publish')
  async togglePublish(@Param('id') id: string) {
    return this.articlesService.togglePublish(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }

  // ✅ UPLOAD IMAGE ENDPOINT - FIXED
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // ✅ Ensure directory exists
          const uploadPath = './public/uploads/articles';
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `article-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // ✅ Return response sesuai format yang diharapkan frontend
    return {
      filename: file.filename,
      path: `/uploads/articles/${file.filename}`, // Path relatif untuk disimpan di database
      url: `${process.env.API_URL || 'http://localhost:3001'}/uploads/articles/${file.filename}`, // Full URL untuk preview
      size: file.size,
      mimetype: file.mimetype,
      originalName: file.originalname,
    };
  }
}
