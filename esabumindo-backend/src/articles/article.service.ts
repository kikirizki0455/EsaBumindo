import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    return article;
  }

  async create(data: CreateArticleDto) {
    // Check if slug already exists
    const existingArticle = await this.prisma.article.findUnique({
      where: { slug: data.slug },
    });

    if (existingArticle) {
      throw new ConflictException('Slug already exists');
    }

    return this.prisma.article.create({
      data: {
        ...data,
        publishedAt: data.status === 'published' ? new Date() : null,
      },
    });
  }

  async update(id: string, data: UpdateArticleDto) {
    // Check if article exists
    await this.findOne(id);

    // Check if new slug conflicts with other articles
    if (data.slug) {
      const existingArticle = await this.prisma.article.findFirst({
        where: {
          slug: data.slug,
          NOT: { id },
        },
      });

      if (existingArticle) {
        throw new ConflictException('Slug already exists');
      }
    }

    return this.prisma.article.update({
      where: { id },
      data: {
        ...data,
        publishedAt:
          data.status === 'published' && !data.publishedAt
            ? new Date()
            : data.publishedAt,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.article.delete({
      where: { id },
    });
  }
}
