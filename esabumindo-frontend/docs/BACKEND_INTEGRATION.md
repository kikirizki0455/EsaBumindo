// Backend Integration Guide
// File: docs/BACKEND_INTEGRATION.md

# Backend Integration Guide - Sistem Cache Artikel

## 📌 Ringkas

Backend perlu mengupdate cache artikel setiap kali ada perubahan:

1. **Create Article** → Update articles.json + articles-detail.json
2. **Update Article** → Update articles.json + articles-detail.json
3. **Delete Article** → Remove dari articles.json + articles-detail.json
4. **Publish Article** → Update cache dengan status published

---

## 🔧 Implementation (NestJS Backend)

### 1. Setup Cache Sync Endpoint

```typescript
// src/articles/articles.controller.ts

import { Controller, Post, Body, Get, Param } from "@nestjs/common";
import { ArticlesService } from "./articles.service";
import * as fs from "fs";
import * as path from "path";

@Controller("articles")
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @Get("published")
  async getPublishedArticles() {
    return this.articlesService.findPublished();
  }

  @Get("slug/:slug")
  async getBySlug(@Param("slug") slug: string) {
    return this.articlesService.findBySlug(slug);
  }

  @Post("create")
  async create(@Body() createArticleDto: CreateArticleDto) {
    const article = await this.articlesService.create(createArticleDto);

    // ✅ Update cache otomatis
    await this.syncCache();

    return article;
  }

  @Post("update/:id")
  async update(
    @Param("id") id: string,
    @Body() updateArticleDto: UpdateArticleDto
  ) {
    const article = await this.articlesService.update(id, updateArticleDto);

    // ✅ Update cache otomatis
    await this.syncCache();

    return article;
  }

  @Post("delete/:id")
  async delete(@Param("id") id: string) {
    await this.articlesService.delete(id);

    // ✅ Update cache otomatis
    await this.syncCache();

    return { success: true };
  }

  // Helper: Sync cache ke frontend
  private async syncCache() {
    try {
      const articles = await this.articlesService.findPublished();
      const cacheDir = path.join(process.cwd(), "data");

      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // Update articles.json
      const articlesList = {
        articles: articles.map((a) => ({
          id: a.id,
          slug: a.slug,
          title: a.title,
          excerpt: a.excerpt,
          author: a.author,
          coverImage: a.coverImage,
          publishedAt: a.publishedAt,
          createdAt: a.createdAt,
          status: a.status,
        })),
        lastUpdated: new Date().toISOString(),
      };

      fs.writeFileSync(
        path.join(cacheDir, "articles.json"),
        JSON.stringify(articlesList, null, 2)
      );

      // Update articles-detail.json
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
          createdAt: a.createdAt,
          contentBlocks: a.contentBlocks,
          status: a.status,
        };
      });

      fs.writeFileSync(
        path.join(cacheDir, "articles-detail.json"),
        JSON.stringify(articlesDetail, null, 2)
      );

      console.log("✅ Cache updated successfully");
    } catch (error) {
      console.error("❌ Error syncing cache:", error);
    }
  }
}
```

### 2. Service Implementation

```typescript
// src/articles/articles.service.ts

import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateArticleDto, UpdateArticleDto } from "./dto";

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async create(createArticleDto: CreateArticleDto) {
    // Generate slug dari title
    const slug = this.generateSlug(createArticleDto.title);

    return this.prisma.article.create({
      data: {
        ...createArticleDto,
        slug,
        status: "draft",
        publishedAt: null,
      },
    });
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    let slug = undefined;

    // Generate slug baru jika title berubah
    if (updateArticleDto.title) {
      slug = this.generateSlug(updateArticleDto.title);
    }

    return this.prisma.article.update({
      where: { id },
      data: {
        ...updateArticleDto,
        ...(slug && { slug }),
      },
    });
  }

  async delete(id: string) {
    return this.prisma.article.delete({
      where: { id },
    });
  }

  async findPublished() {
    return this.prisma.article.findMany({
      where: {
        status: "published",
        publishedAt: { lte: new Date() },
      },
      orderBy: {
        publishedAt: "desc",
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.article.findUnique({
      where: { slug },
    });
  }

  // Helper: Generate slug dari title
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
}
```

### 3. DTOs

```typescript
// src/articles/dto/create-article.dto.ts

import { IsString, IsOptional, IsArray, IsObject } from "class-validator";

export class CreateArticleDto {
  @IsString()
  title: string;

  @IsString()
  excerpt: string;

  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsArray()
  contentBlocks?: any[];
}

// src/articles/dto/update-article.dto.ts
export class UpdateArticleDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsArray()
  contentBlocks?: any[];

  @IsOptional()
  @IsString()
  status?: "draft" | "published" | "scheduled";

  @IsOptional()
  publishedAt?: Date;
}
```

---

## 🔄 Cache Sync Flow Diagram

```
Admin Panel (Create/Update/Delete)
         ↓
    Backend API
         ↓
   Database Update
         ↓
   syncCache() Called
         ↓
Query published articles
         ↓
Generate articles.json
Generate articles-detail.json
         ↓
Files written to data/ folder
         ↓
Frontend auto-refresh (next reload)
         ↓
Display updated articles
```

---

## 📝 Database Schema (Prisma)

```prisma
// prisma/schema.prisma

model Article {
  id        String   @id @default(cuid())
  slug      String   @unique
  title     String
  excerpt   String   @db.Text
  author    String
  coverImage String?
  contentBlocks Json?  // Store array of blocks
  status    String   @default("draft") // draft, published, scheduled
  publishedAt DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("articles")
}
```

---

## ✅ Testing Cache Updates

### 1. Manual Test Create Article

```bash
curl -X POST http://localhost:3001/api/articles/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Article",
    "excerpt": "Test excerpt",
    "author": "Test Author",
    "coverImage": "/uploads/test.jpg"
  }'
```

### 2. Verify Cache Files

```bash
# Check articles.json
cat data/articles.json

# Check articles-detail.json
cat data/articles-detail.json
```

### 3. Test Frontend Sync

```bash
curl -X POST http://localhost:3000/api/articles/sync-cache
```

---

## 🚨 Error Handling

### Jika Cache Sync Gagal

Backend harus:

1. ✅ Tetap menyimpan data ke database
2. ⚠️ Log error untuk debugging
3. 🔄 Retry sync setelah beberapa saat
4. 📧 Alert admin jika persistent error

```typescript
async syncCache() {
  try {
    // ... sync logic
  } catch (error) {
    console.error('Cache sync error:', error);

    // Retry logic
    setTimeout(() => this.syncCache(), 5000);

    // Alert admin
    await this.notificationService.sendAlert(
      'Cache sync failed',
      error.message
    );
  }
}
```

---

## 🔐 Security Considerations

1. **Admin Only**: Protect create/update/delete endpoints dengan authentication
2. **Validation**: Validate semua input data
3. **File Permissions**: Ensure data/ folder hanya readable oleh app
4. **Rate Limiting**: Limit cache sync requests

```typescript
@Post('create')
@UseGuards(JwtAuthGuard)
@UseGuards(AdminGuard)
async create(@Body() createArticleDto: CreateArticleDto) {
  // Only admin can create articles
  // ...
}
```

---

## 📊 Monitoring

Monitor cache sync operations:

```typescript
private async syncCache() {
  const startTime = performance.now();

  try {
    // ... sync logic
    const duration = performance.now() - startTime;
    console.log(`Cache sync completed in ${duration.toFixed(2)}ms`);
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(`Cache sync failed after ${duration.toFixed(2)}ms:`, error);
  }
}
```

---

## 📞 Troubleshooting

### Cache files not updating

- Check file permissions on `data/` folder
- Verify backend can write to filesystem
- Check server logs untuk errors
- Manual trigger: `POST /api/articles/sync-cache`

### Frontend showing old articles

- Clear browser cache
- Clear localStorage: `localStorage.clear()`
- Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R)
- Check browser Network tab

### Performance issues

- Cache sync blocking other requests
- Use async/background job untuk sync
- Implement queue system (Bull, RabbitMQ)
