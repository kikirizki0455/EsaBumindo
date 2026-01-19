// src/articles/article.service.ts

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  // Generate slug dari title
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // hapus karakter special
      .trim()
      .replace(/\s+/g, '-') // ganti spasi dengan -
      .replace(/-+/g, '-'); // ganti multiple - dengan single -
  }

  // Generate unique slug (kalau ada yang sama, tambahkan angka)
  private async generateUniqueSlug(
    title: string,
    excludeId?: string,
  ): Promise<string> {
    let slug = this.generateSlug(title);
    let counter = 1;
    let isUnique = false;

    while (!isUnique) {
      const existing = await this.prisma.article.findUnique({
        where: { slug },
      });

      if (!existing || existing.id === excludeId) {
        isUnique = true;
      } else {
        slug = `${this.generateSlug(title)}-${counter}`;
        counter++;
      }
    }

    return slug;
  }

  // Get all articles (untuk admin)
  async findAll() {
    return this.prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get published articles only (untuk company profile)
  async findPublished() {
    return this.prisma.article.findMany({
      where: { status: 'published' },
      orderBy: { publishedAt: 'desc' },
    });
  }

  // Get article by ID
  async findOne(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    return article;
  }

  // Get article by slug (untuk SEO-friendly URLs)
  async findBySlug(slug: string) {
    const article = await this.prisma.article.findUnique({
      where: { slug },
    });

    if (!article) {
      throw new NotFoundException(`Article with slug ${slug} not found`);
    }

    return article;
  }

  // Create new article
  async create(createArticleDto: CreateArticleDto) {
    const slug = await this.generateUniqueSlug(createArticleDto.title);

    // Set publishedAt jika status published
    const publishedAt =
      createArticleDto.status === 'published' ? new Date() : null;

    return this.prisma.article.create({
      data: {
        title: createArticleDto.title,
        slug,
        content: createArticleDto.content,
        excerpt: createArticleDto.excerpt || null,
        coverImage: createArticleDto.coverImage || null,
        author: createArticleDto.author || 'Admin', // Fallback jika tidak ada author
        status: createArticleDto.status || 'draft',
        publishedAt,
      },
    });
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    const existingArticle = await this.findOne(id);

    let slug: string | undefined;
    let publishedAt: Date | null | undefined;

    const isDraft = existingArticle.status === 'draft';
    const isPublishing =
      updateArticleDto.status === 'published' &&
      existingArticle.status !== 'published';

    /* =========================
     * SLUG HANDLING
     * ========================= */

    // ✅ DRAFT → boleh ubah slug (manual / auto)
    if (isDraft) {
      if (updateArticleDto.slug) {
        slug = await this.generateUniqueSlug(updateArticleDto.slug, id);
      } else if (
        updateArticleDto.title &&
        updateArticleDto.title !== existingArticle.title
      ) {
        slug = await this.generateUniqueSlug(updateArticleDto.title, id);
      }
    }

    // ❌ PUBLISHED → slug tidak boleh diubah
    if (!isDraft && updateArticleDto.slug) {
      throw new BadRequestException(
        'Slug tidak dapat diubah setelah artikel dipublish',
      );
    }

    /* =========================
     * PUBLISHED AT HANDLING
     * ========================= */

    if (isPublishing) {
      publishedAt = existingArticle.publishedAt ?? new Date();
    }

    if (updateArticleDto.status === 'draft') {
      publishedAt = null;
    }

    /* =========================
     * UPDATE QUERY
     * ========================= */

    return this.prisma.article.update({
      where: { id },
      data: {
        ...(updateArticleDto.title && { title: updateArticleDto.title }),
        ...(slug && { slug }),
        ...(updateArticleDto.content && { content: updateArticleDto.content }),
        ...(updateArticleDto.excerpt !== undefined && {
          excerpt: updateArticleDto.excerpt,
        }),
        ...(updateArticleDto.coverImage !== undefined && {
          coverImage: updateArticleDto.coverImage,
        }),
        ...(updateArticleDto.author && { author: updateArticleDto.author }),
        ...(updateArticleDto.status && { status: updateArticleDto.status }),
        ...(publishedAt !== undefined && { publishedAt }),
      },
    });
  }

  // Delete article
  async remove(id: string) {
    // Cek apakah artikel ada
    await this.findOne(id);

    await this.prisma.article.delete({
      where: { id },
    });

    return { message: 'Article deleted successfully' };
  }

  // Toggle publish status
  async togglePublish(id: string) {
    const article = await this.findOne(id);
    const newStatus = article.status === 'published' ? 'draft' : 'published';
    const publishedAt =
      newStatus === 'published' ? article.publishedAt || new Date() : null;

    return this.prisma.article.update({
      where: { id },
      data: {
        status: newStatus,
        publishedAt,
      },
    });
  }

  // Get articles count by status
  async getStats() {
    const [total, published, draft] = await Promise.all([
      this.prisma.article.count(),
      this.prisma.article.count({ where: { status: 'published' } }),
      this.prisma.article.count({ where: { status: 'draft' } }),
    ]);

    return {
      total,
      published,
      draft,
    };
  }
}
