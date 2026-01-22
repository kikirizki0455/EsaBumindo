// docs/QUICK_START.md

# Quick Start Guide - Sistem Artikel Esabumindo

## 🚀 Setup 5 Menit

### Step 1: Copy Environment Variables

```bash
cd esabumindo-frontend
cp .env.example .env.local
```

Edit `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development
```

### Step 2: Install Dependencies

```bash
npm install
# atau
yarn install
```

### Step 3: Create Data Folder

```bash
mkdir -p data
```

### Step 4: Run Development Server

```bash
npm run dev
```

Server akan jalan di `http://localhost:3000`

---

## 📝 Test Flow

### 1. Test Halaman Artikel List

```
Buka: http://localhost:3000/article
Harusnya melihat:
✅ Loading skeleton
✅ Featured article
✅ Article grid
✅ Search functionality
```

### 2. Test Detail Artikel

```
Klik salah satu artikel
Harusnya melihat:
✅ Article header dengan meta info
✅ Content blocks (paragraf, heading, images)
✅ Related articles
✅ Share button
```

### 3. Test Cache System

```bash
# Manual sync cache
curl -X POST http://localhost:3000/api/articles/sync-cache

# Check articles.json
cat data/articles.json

# Check articles-detail.json
cat data/articles-detail.json
```

### 4. Test Performance

```bash
# Open DevTools (F12)
# Lihat Console tab untuk performance metrics
# Network tab untuk image loading
# Lighthouse audit (Ctrl+Shift+I > Lighthouse)
```

---

## 🔌 Backend Setup (NestJS)

### Step 1: Setup Cache Handler di Backend

File: `src/articles/articles.controller.ts`

```typescript
import { Controller, Post, Body, Get, Param } from "@nestjs/common";
import { ArticlesService } from "./articles.service";
import * as fs from "fs";
import * as path from "path";

@Controller("articles")
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @Get("published")
  async getPublished() {
    return this.articlesService.findPublished();
  }

  @Get("slug/:slug")
  async getBySlug(@Param("slug") slug: string) {
    return this.articlesService.findBySlug(slug);
  }

  @Post()
  async create(@Body() dto: any) {
    const article = await this.articlesService.create(dto);
    await this.syncCache(); // ✅ Auto sync
    return article;
  }

  @Post(":id")
  async update(@Param("id") id: string, @Body() dto: any) {
    const article = await this.articlesService.update(id, dto);
    await this.syncCache(); // ✅ Auto sync
    return article;
  }

  @Post(":id/delete")
  async delete(@Param("id") id: string) {
    await this.articlesService.delete(id);
    await this.syncCache(); // ✅ Auto sync
    return { success: true };
  }

  private async syncCache() {
    try {
      const articles = await this.articlesService.findPublished();
      const cacheDir = path.join(process.cwd(), "../esabumindo-frontend/data");

      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // Write articles.json
      const list = {
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
        path.join(cacheDir, "articles.json"),
        JSON.stringify(list, null, 2)
      );

      // Write articles-detail.json
      const detail = { articles: {}, lastUpdated: new Date().toISOString() };
      articles.forEach((a) => {
        detail.articles[a.slug] = {
          ...a,
          contentBlocks: a.contentBlocks || [],
        };
      });

      fs.writeFileSync(
        path.join(cacheDir, "articles-detail.json"),
        JSON.stringify(detail, null, 2)
      );

      console.log("✅ Cache synced");
    } catch (error) {
      console.error("❌ Cache sync error:", error);
    }
  }
}
```

### Step 2: Run Backend

```bash
cd esabumindo-backend
npm install
npm run start:dev
```

---

## ✅ Implementation Checklist

### Frontend Components

- ✅ `components/article/lazy-image.jsx` - Lazy loading images
- ✅ `components/article/article-skeleton.jsx` - Skeleton loaders
- ✅ `components/article/block-renderer.jsx` - Content blocks
- ✅ `pages/article/index.js` - Article list page
- ✅ `pages/article/[slug].js` - Article detail page
- ✅ `pages/api/articles/sync-cache.js` - Cache sync endpoint

### Utilities & Cache

- ✅ `lib/cache/article-cache.js` - Cache management
- ✅ `lib/utils/performance-monitor.js` - Performance tracking

### Documentation

- ✅ `docs/ARTICLE_SYSTEM.md` - Complete system doc
- ✅ `docs/BACKEND_INTEGRATION.md` - Backend guide
- ✅ `docs/QUICK_START.md` - This file

### Environment

- ✅ `.env.example` - Environment template

---

## 📊 Performance Targets

| Metric                          | Target  | Status |
| ------------------------------- | ------- | ------ |
| Article List - Initial Render   | < 500ms | ⏳     |
| Article Detail - Initial Render | < 200ms | ⏳     |
| First Contentful Paint (FCP)    | < 1.5s  | ⏳     |
| Largest Contentful Paint (LCP)  | < 2.5s  | ⏳     |
| Cumulative Layout Shift (CLS)   | < 0.1   | ⏳     |
| Time to Interactive (TTI)       | < 3s    | ⏳     |

Jalankan Lighthouse audit untuk verify:

1. Open DevTools (F12)
2. Klik tab "Lighthouse"
3. Pilih "Mobile" atau "Desktop"
4. Klik "Analyze page load"

Target score: **90+** untuk setiap kategori

---

## 🎯 Features Overview

### Article List Page (`/article`)

```
┌─────────────────────────────────────┐
│         Hero Section H1              │
├─────────────────────────────────────┤
│    Search Bar (Client-side filter)   │
├─────────────────────────────────────┤
│     Featured Article Card            │
│  (2 column grid: image + content)    │
├─────────────────────────────────────┤
│    Article Grid (3 columns)          │
│  ┌──────────┐ ┌──────────┐          │
│  │ Card 1   │ │ Card 2   │          │
│  │ img+info │ │ img+info │          │
│  └──────────┘ └──────────┘          │
│  ┌──────────┐ ┌──────────┐          │
│  │ Card 3   │ │ Card 4   │          │
│  └──────────┘ └──────────┘          │
└─────────────────────────────────────┘
```

### Article Detail Page (`/article/[slug]`)

```
┌─────────────────────────────────────┐
│   Sticky Nav (Back | Share)          │
├─────────────────────────────────────┤
│         Article Header               │
│  - H1 Title                          │
│  - Excerpt                           │
│  - Meta (Author, Date, Read Time)    │
├─────────────────────────────────────┤
│        Cover Image (Lazy)            │
├─────────────────────────────────────┤
│    Content Blocks                    │
│  - Paragraphs                        │
│  - Headings (H2, H3)                │
│  - Images (Single/Double/Grid)       │
├─────────────────────────────────────┤
│        Share Section                 │
├─────────────────────────────────────┤
│    Related Articles (3 cards)        │
└─────────────────────────────────────┘
```

---

## 🔧 Troubleshooting

### Article tidak muncul

```bash
# 1. Check backend running
curl http://localhost:3001/api/articles/published

# 2. Manual sync cache
curl -X POST http://localhost:3000/api/articles/sync-cache

# 3. Check data folder
ls -la data/articles.json
```

### Gambar tidak loading

```bash
# 1. Check image path di database
# 2. Check files exist di backend
ls -la esabumindo-backend/public/uploads/articles/

# 3. Check API URL di .env.local
# 4. Check Network tab di DevTools (F12)
```

### Render lambat

```bash
# 1. Check Lighthouse score
# 2. Check Console untuk errors
# 3. Check Network tab untuk image sizes
# 4. Reduce article count per page
```

---

## 📞 Common Commands

```bash
# Frontend development
cd esabumindo-frontend
npm run dev                    # Start dev server
npm run build                  # Build untuk production
npm run start                  # Start production server
npm run lint                   # Run ESLint

# Backend development
cd esabumindo-backend
npm run start:dev              # Start dev server
npm run build                  # Build production
npm run typeorm:migration:run  # Run migrations

# Cache operations
curl -X POST http://localhost:3000/api/articles/sync-cache
```

---

## 🎓 Learning Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **React Performance**: https://react.dev/reference/react/useMemo
- **Image Optimization**: https://nextjs.org/docs/pages/api-reference/components/image
- **SEO Best Practices**: https://developers.google.com/search
- **Web Vitals**: https://web.dev/vitals/

---

## 📋 Notes

- Semua images gunakan `LazyImage` component untuk optimization
- Selalu gunakan `useMemo` untuk prevent unnecessary re-renders
- Cache di-update otomatis oleh backend saat ada perubahan article
- Manual sync bisa dilakukan dengan API endpoint `/api/articles/sync-cache`
- Performance target < 5ms untuk article list render

---

## 🚀 Next Steps

1. ✅ Setup environment variables
2. ✅ Install dependencies
3. ✅ Start development servers
4. ✅ Test article pages
5. ✅ Setup backend cache sync
6. ✅ Run performance audit
7. ✅ Deploy to production

Ready? Mari mulai! 🎉
