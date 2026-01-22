// src/articles/article.service.ts

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import * as fs from 'fs';
import * as path from 'path';

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
  private validateContentBlocks(blocks: any[]): boolean {
    if (!Array.isArray(blocks) || blocks.length === 0) {
      return false;
    }

    for (const block of blocks) {
      if (!block.id || !block.type) {
        return false;
      }

      // Validate based on block type
      if (block.type === 'paragraph' || block.type === 'heading') {
        if (!block.content || typeof block.content !== 'string') {
          return false;
        }
      }

      if (block.type === 'image') {
        if (!block.images || !Array.isArray(block.images)) {
          return false;
        }

        for (const img of block.images) {
          if (!img.url || !img.alt) {
            return false;
          }
        }
      }
    }

    return true;
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
    // Validate content blocks
    if (!this.validateContentBlocks(createArticleDto.contentBlocks)) {
      throw new Error('Invalid content blocks structure');
    }

    // Generate slug
    const slug = createArticleDto.slug
      ? await this.generateUniqueSlug(createArticleDto.slug)
      : await this.generateUniqueSlug(createArticleDto.title);

    // Set publishedAt if status is published
    const publishedAt =
      createArticleDto.status === 'published' ? new Date() : null;

    const article = await this.prisma.article.create({
      data: {
        title: createArticleDto.title,
        slug,
        contentBlocks: createArticleDto.contentBlocks as any, // Prisma handles JSON
        excerpt: createArticleDto.excerpt || null,
        coverImage: createArticleDto.coverImage || null,
        author: createArticleDto.author || 'Admin',
        status: createArticleDto.status || 'draft',
        publishedAt,
      },
    });

    // Auto sync cache setelah create
    await this.syncCache();

    return article;
  }

  // Update article
  async update(id: string, updateArticleDto: UpdateArticleDto) {
    const existingArticle = await this.findOne(id);

    // Validate content blocks if provided
    if (
      updateArticleDto.contentBlocks &&
      !this.validateContentBlocks(updateArticleDto.contentBlocks)
    ) {
      throw new Error('Invalid content blocks structure');
    }

    let slug: string | undefined;
    let publishedAt: Date | null | undefined;

    // Generate new slug if title changed (only for drafts)
    if (
      updateArticleDto.title &&
      updateArticleDto.title !== existingArticle.title &&
      existingArticle.status === 'draft'
    ) {
      slug = await this.generateUniqueSlug(updateArticleDto.title, id);
    }

    // Update publishedAt if status changes to published
    if (
      updateArticleDto.status === 'published' &&
      existingArticle.status !== 'published'
    ) {
      publishedAt = existingArticle.publishedAt || new Date();
    } else if (updateArticleDto.status === 'draft') {
      publishedAt = null;
    }

    const article = await this.prisma.article.update({
      where: { id },
      data: {
        ...(updateArticleDto.title && { title: updateArticleDto.title }),
        ...(slug && { slug }),
        ...(updateArticleDto.contentBlocks && {
          contentBlocks: updateArticleDto.contentBlocks as any,
        }),
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

    // Auto sync cache setelah update
    await this.syncCache();

    return article;
  }

  // Delete article
  async remove(id: string) {
    // Cek apakah artikel ada
    await this.findOne(id);

    await this.prisma.article.delete({
      where: { id },
    });

    // Auto sync cache setelah delete
    await this.syncCache();

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

  // Sync cache ke frontend
  private async syncCache(): Promise<void> {
    try {
      const articles = await this.findPublished();
      const frontendDataDir = path.join(
        process.cwd(),
        '..',
        'esabumindo-frontend',
        'data',
      );

      // Ensure directory exists
      if (!fs.existsSync(frontendDataDir)) {
        fs.mkdirSync(frontendDataDir, { recursive: true });
      }

      // Write articles.json
      const articlesList = {
        articles: articles.map((a) => ({
          id: a.id,
          slug: a.slug,
          title: a.title,
          excerpt: a.excerpt,
          author: a.author,
          coverImage: a.coverImage,
          publishedAt: a.publishedAt,
          status: a.status,
        })),
        lastUpdated: new Date().toISOString(),
      };

      fs.writeFileSync(
        path.join(frontendDataDir, 'articles.json'),
        JSON.stringify(articlesList, null, 2),
      );

      // Write articles-detail.json
      const articlesDetail = {
        articles: {},
        lastUpdated: new Date().toISOString(),
      };
      articles.forEach((a) => {
        articlesDetail.articles[a.slug] = {
          id: a.id,
          slug: a.slug,
          title: a.title,
          excerpt: a.excerpt,
          author: a.author,
          coverImage: a.coverImage,
          publishedAt: a.publishedAt,
          status: a.status,
          contentBlocks: a.contentBlocks,
        };
      });

      fs.writeFileSync(
        path.join(frontendDataDir, 'articles-detail.json'),
        JSON.stringify(articlesDetail, null, 2),
      );

      console.log('✅ Cache synced successfully');
    } catch (error) {
      console.error('❌ Cache sync error:', error);
      // Don't throw - cache sync failure shouldn't break the main operation
    }
  }
}
