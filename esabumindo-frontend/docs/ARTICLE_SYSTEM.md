// ARTIKEL SYSTEM DOCUMENTATION
// =============================
// File: docs/ARTICLE_SYSTEM.md

# Sistem Artikel Esabumindo - Dokumentasi Lengkap

## 📋 Daftar Isi

1. Arsitektur Sistem
2. Cache Management
3. Struktur Data
4. Halaman & Routes
5. Optimasi Performa
6. SEO & Mobile First
7. Admin Integration
8. Troubleshooting

---

## 1. Arsitektur Sistem

### Overview

Sistem artikel terdiri dari:

- **Frontend**: Next.js pages dengan lazy loading & caching
- **Backend**: API REST untuk fetch articles
- **Cache Layer**: Local JSON files (articles.json, articles-detail.json)
- **Components**: Reusable lazy-load image, skeleton, block renderer

### Flow Diagram

```
Admin Panel
    ↓
Backend API (/articles/published)
    ↓
Frontend Fetch (pages/article/*.js)
    ↓
Cache Manager (lib/cache/article-cache.js)
    ↓
Local JSON (data/articles.json, articles-detail.json)
    ↓
Render (LazyImage + BlockRenderer + Skeleton)
```

---

## 2. Cache Management

### File Locations

- `lib/cache/article-cache.js` - Cache utility functions
- `data/articles.json` - List of all articles metadata
- `data/articles-detail.json` - Full article details by slug
- `pages/api/articles/sync-cache.js` - API route untuk sync cache

### Cache Structure

#### articles.json

```json
{
  "articles": [
    {
      "id": "uuid",
      "slug": "article-slug",
      "title": "Article Title",
      "excerpt": "Short excerpt",
      "author": "Author Name",
      "coverImage": "/path/to/image.jpg",
      "publishedAt": "2024-01-22T00:00:00Z",
      "status": "published"
    }
  ],
  "lastUpdated": "2024-01-22T10:30:00Z"
}
```

#### articles-detail.json

```json
{
  "articles": {
    "article-slug": {
      "id": "uuid",
      "slug": "article-slug",
      "title": "Article Title",
      "excerpt": "Excerpt",
      "author": "Author Name",
      "coverImage": "/path/to/image.jpg",
      "publishedAt": "2024-01-22T00:00:00Z",
      "contentBlocks": [
        {
          "id": "block-id",
          "type": "paragraph",
          "content": "Paragraph content..."
        },
        {
          "id": "block-id-2",
          "type": "image",
          "layout": "single",
          "images": [
            {
              "url": "/path/to/image.jpg",
              "alt": "Image alt text",
              "caption": "Image caption"
            }
          ]
        }
      ]
    }
  },
  "lastUpdated": "2024-01-22T10:30:00Z"
}
```

### Cache API Functions

#### getArticlesFromCache()

```javascript
import { getArticlesFromCache } from "@/lib/cache/article-cache";

const cacheData = getArticlesFromCache();
// Returns: { articles: [...], lastUpdated: '...' }
```

#### updateArticlesCache(articles)

```javascript
import { updateArticlesCache } from "@/lib/cache/article-cache";

updateArticlesCache(articlesArray);
// Automatically called when admin adds/updates article
```

#### getArticleDetailFromCache(slug)

```javascript
import { getArticleDetailFromCache } from "@/lib/cache/article-cache";

const article = getArticleDetailFromCache("article-slug");
// Returns full article details atau null
```

#### updateArticleDetailCache(article)

```javascript
import { updateArticleDetailCache } from "@/lib/cache/article-cache";

updateArticleDetailCache(articleObject);
// Stores complete article with contentBlocks
```

---

## 3. Struktur Data

### Article Object

```javascript
{
  id: "uuid",
  slug: "unique-article-slug",
  title: "Article Title",
  excerpt: "Short description",
  author: "Author Name",
  coverImage: "/uploads/articles/cover.jpg",
  publishedAt: "2024-01-22T10:00:00Z",
  createdAt: "2024-01-22T09:00:00Z",
  status: "published" | "draft" | "scheduled",
  contentBlocks: [
    {
      id: "block-1",
      type: "heading",
      level: 2,
      content: "Heading Text"
    },
    {
      id: "block-2",
      type: "paragraph",
      content: "Paragraph text..."
    },
    {
      id: "block-3",
      type: "image",
      layout: "single" | "double" | "grid",
      images: [
        {
          url: "/uploads/articles/image.jpg",
          alt: "Alt text",
          caption: "Image caption"
        }
      ]
    }
  ]
}
```

### ContentBlocks Types

#### Heading Block

```javascript
{
  id: "unique-id",
  type: "heading",
  level: 2 | 3 | 4,
  content: "Heading text"
}
```

#### Paragraph Block

```javascript
{
  id: "unique-id",
  type: "paragraph",
  content: "Paragraph text with full content..."
}
```

#### Image Block (Single)

```javascript
{
  id: "unique-id",
  type: "image",
  layout: "single",
  images: [
    {
      url: "/path/to/image.jpg",
      alt: "Alt text",
      caption: "Optional caption"
    }
  ]
}
```

#### Image Block (Double)

```javascript
{
  id: "unique-id",
  type: "image",
  layout: "double",
  images: [
    { url: "...", alt: "...", caption: "..." },
    { url: "...", alt: "...", caption: "..." }
  ]
}
```

#### Image Block (Grid)

```javascript
{
  id: "unique-id",
  type: "image",
  layout: "grid",
  images: [
    { url: "...", alt: "...", caption: "..." },
    { url: "...", alt: "...", caption: "..." },
    { url: "...", alt: "...", caption: "..." }
  ]
}
```

---

## 4. Halaman & Routes

### pages/article/index.js

**Fungsi**: Menampilkan daftar semua artikel

**Features**:

- Featured article di atas
- Grid artikel lainnya
- Search functionality
- Lazy loading images
- Skeleton loading
- SEO meta tags
- Mobile responsive

**Performance Metrics**:

- Initial render: < 500ms
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s

### pages/article/[slug].js

**Fungsi**: Menampilkan detail lengkap satu artikel

**Features**:

- Dynamic slug routing
- Sticky navigation bar
- Content blocks rendering (heading, paragraph, images)
- Related articles
- Share functionality
- Reading time calculation
- JSON-LD structured data
- Lazy image loading
- SEO optimized

**Performance Metrics**:

- Initial render: < 200ms
- FCP: < 1s
- LCP: < 2s

### pages/api/articles/sync-cache.js

**Fungsi**: Sync cache dari backend

**Method**: POST

**Request Body**: (empty)

**Response**:

```json
{
  "success": true,
  "message": "Cache synced successfully",
  "articlesCount": 15
}
```

---

## 5. Optimasi Performa

### 1. Lazy Loading Images

```javascript
import { LazyImage } from "@/components/article/lazy-image";

<LazyImage
  src="/image.jpg"
  alt="Description"
  fill
  priority={false} // only true untuk images di atas fold
  sizes="(max-width: 768px) 100vw, 50vw"
  className="object-cover"
/>;
```

### 2. Skeleton Loading

```javascript
import {
  ArticleCardSkeleton,
  FeaturedArticleSkeleton,
  ArticleDetailSkeleton,
} from "@/components/article/article-skeleton";

{
  loading ? <ArticleCardSkeleton /> : <ArticleCard />;
}
```

### 3. Memoization & useMemo

```javascript
const filteredArticles = useMemo(() => {
  return articles.filter((article) =>
    article.title.toLowerCase().includes(search.toLowerCase())
  );
}, [articles, search]);
```

### 4. Caching Strategy

- **Browser Cache**: localStorage untuk 5 menit
- **Server Cache**: JSON files di `data/` folder
- **CDN Cache**: Images dioptimasi dengan Next.js Image

### 5. Performance Monitoring

```javascript
import { performanceMetrics } from "@/lib/utils/performance-monitor";

performanceMetrics.start("article-load");
// ... do something
performanceMetrics.end("article-load");
performanceMetrics.report();
```

---

## 6. SEO & Mobile First

### Meta Tags (Article Index)

```html
<title>Artikel & Wawasan | Esabumindo Chemical Adhesive</title>
<meta name="description" content="Temukan informasi terbaru..." />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<link rel="canonical" href="https://esabumindo.com/article" />
```

### Meta Tags (Article Detail)

```html
<title>{article.title} | Esabumindo</title>
<meta name="description" content="{article.excerpt}" />
<meta property="og:image" content="{coverImage}" />

<!-- JSON-LD Structured Data -->
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "{title}",
    "description": "{excerpt}",
    "image": "{coverImage}",
    "datePublished": "{publishedAt}",
    "author": { "@type": "Person", "name": "{author}" }
  }
</script>
```

### Mobile First Responsive

- **Breakpoints**: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- **Typography**: Scalable font sizes
- **Images**: Responsive `sizes` attribute
- **Touch**: Adequate touch targets (min 44x44px)

---

## 7. Admin Integration

### Ketika Admin Membuat Artikel Baru

**Flow**:

1. Admin submit form di admin panel
2. Backend menerima request POST `/articles`
3. Backend menyimpan ke database + file upload
4. Backend trigger cache update
5. Cache diupdate di `articles.json` dan `articles-detail.json`
6. Frontend auto-fetch artikel baru saat reload

### Backend Integration (Node.js/NestJS)

```javascript
// Setelah create/update article
import {
  updateArticlesCache,
  updateArticleDetailCache,
} from "@/lib/cache/article-cache";

// After saving to database:
await updateArticlesCache(allArticles);
await updateArticleDetailCache(newArticle);
```

### Manual Cache Sync (jika diperlukan)

```bash
curl -X POST http://localhost:3000/api/articles/sync-cache
```

---

## 8. Troubleshooting

### Artikel tidak muncul di halaman list

**Solusi**:

1. Cek status artikel di database (harus 'published')
2. Manual sync cache: POST `/api/articles/sync-cache`
3. Clear browser cache: DevTools → Application → Clear storage
4. Check console untuk error message

### Gambar tidak loading

**Solusi**:

1. Verify image path di database
2. Check image file exists di backend `public/uploads/articles/`
3. Verify `NEXT_PUBLIC_API_URL` env variable
4. Check browser Network tab untuk 404 errors

### Render terlalu lambat (> 5ms)

**Solusi**:

1. Reduce artikel list size per page
2. Enable image optimization
3. Remove unnecessary re-renders dengan React.memo
4. Use performanceMetrics untuk identify bottleneck

### Cache tidak terupdate

**Solusi**:

1. Check `data/` folder permissions
2. Verify cache files exist: `data/articles.json`, `data/articles-detail.json`
3. Check server logs untuk error messages
4. Manually delete cache files untuk force regenerate

---

## 📊 Performance Checklist

- ✅ Lazy loading images (hanya priority=true untuk above-the-fold)
- ✅ Skeleton loading saat fetch data
- ✅ useMemo untuk prevent unnecessary re-renders
- ✅ Caching di browser (localStorage)
- ✅ Caching di server (JSON files)
- ✅ SEO meta tags & JSON-LD
- ✅ Mobile responsive & touch-friendly
- ✅ Accessible (aria-labels, semantic HTML)
- ✅ Error handling & fallback cache
- ✅ Performance monitoring

---

## 🚀 Deployment Checklist

- [ ] Set `NEXT_PUBLIC_API_URL` environment variable
- [ ] Set `NEXT_PUBLIC_BASE_URL` environment variable
- [ ] Ensure `data/` folder exists dan writable
- [ ] Test cache sync: `POST /api/articles/sync-cache`
- [ ] Test article list page load
- [ ] Test article detail page load
- [ ] Test image loading di semua breakpoints
- [ ] Test search functionality
- [ ] Run Lighthouse audit (target: 90+)
- [ ] Test on mobile devices

---

## 📞 Support & Contact

Untuk pertanyaan atau issue, hubungi tim development.
