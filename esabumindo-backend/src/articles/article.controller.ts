// src/articles/articles.controller.ts (WITH AUTH - OPTIONAL)

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
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ArticlesService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  // PUBLIC ENDPOINTS - Tidak perlu auth
  @Get('published')
  async findPublished() {
    return this.articlesService.findPublished();
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.articlesService.findBySlug(slug);
  }

  // PROTECTED ENDPOINTS - Perlu auth (uncomment guards kalau sudah implement auth)
  @Get()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ADMIN', 'DIREKTUR')
  async findAll() {
    return this.articlesService.findAll();
  }

  @Get('stats')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ADMIN', 'DIREKTUR')
  async getStats() {
    return this.articlesService.getStats();
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ADMIN', 'DIREKTUR')
  async create(
    @Body() createArticleDto: CreateArticleDto,
    // @Request() req, // Uncomment ini untuk dapat user dari token
  ) {
    // Kalau mau ambil author dari token JWT:
    // createArticleDto.author = req.user.name;

    return this.articlesService.create(createArticleDto);
  }

  @Put(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ADMIN', 'DIREKTUR')
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.update(id, updateArticleDto);
  }

  @Patch(':id/toggle-publish')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ADMIN', 'DIREKTUR')
  async togglePublish(@Param('id') id: string) {
    return this.articlesService.togglePublish(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ADMIN', 'DIREKTUR')
  async remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }

  // Upload image endpoint - Protected
  @Post('upload')
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads/articles',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `article-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
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
      throw new Error('No file uploaded');
    }

    return {
      filename: file.filename,
      path: `/uploads/articles/${file.filename}`,
      url: `${process.env.API_URL || 'http://localhost:3001'}/uploads/articles/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
