# 🎯 AUTO SEO TEMPLATE - QUICK START GUIDE

## 📌 Gambaran Singkat

Sistem otomatis ini memungkinkan **setiap data baru yang masuk langsung SEO-friendly** tanpa perlu manual configuration. Tinggal input data, template SEO otomatis generate.

---

## 🚀 CARA KERJA

### Flow Diagram

```
Data Baru Input (Article/Product)
        ↓
API Backend Return Data
        ↓
Frontend Call generateMeta() Function
        ↓
Meta Tags Auto-Generated
        ↓
Sitemap Auto-Updated
        ↓
Page Ready untuk SEO 🎉
```

---

## 📝 IMPLEMENTASI PER TIPE DATA

### 1️⃣ ARTICLE BARU

#### Di Backend (Saat Publish Article)

```javascript
// POST /api/articles
{
  title: "Cara Menggunakan Adhesive Industrial",
  description: "Panduan lengkap menggunakan adhesive...",
  content: "...",
  coverImage: "/uploads/adhesive-guide.jpg",
  author: "Admin",
  tags: ["adhesive", "industrial", "tutorial"]
}
```

#### Di Frontend (Halaman Article Detail)

```javascript
import { generateArticleMeta, generateArticleStructuredData } from '@/lib/seo-utils';

export default function ArticleDetailPage() {
  const [article, setArticle] = useState(null);

  useEffect(() => {
    // Fetch article dari API
    const response = await api.get(`/articles/slug/${slug}`);
    setArticle(response.data);
  }, [slug]);

  // ✅ AUTO GENERATE SEO META
  const seoMeta = generateArticleMeta({
    title: article?.title,
    description: article?.description,
    image: getFullImageUrl(article?.coverImage),
    author: article?.author,
    publishedAt: article?.publishedAt,
    url: `https://esabumindo.com/article/${article?.slug}`,
    tags: article?.tags || []
  });

  // ✅ AUTO GENERATE STRUCTURED DATA
  const articleSchema = generateArticleStructuredData({
    title: article?.title,
    description: article?.description,
    image: getFullImageUrl(article?.coverImage),
    author: article?.author,
    publishedAt: article?.publishedAt,
    url: `https://esabumindo.com/article/${article?.slug}`
  });

  return (
    <>
      <Head>
        <title>{seoMeta.title}</title>
        <meta name="description" content={seoMeta.description} />
        <meta name="keywords" content={seoMeta.keywords} />
        {/* ... other meta tags ... */}
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      </Head>
      {/* Page content */}
    </>
  );
}
```

#### Hasil SEO

```
✅ Title: "Cara Menggunakan Adhesive Industrial | Esabumindo"
✅ Meta Description: "Panduan lengkap menggunakan adhesive..."
✅ Keywords: "adhesive, industrial, tutorial"
✅ Open Graph Tags: Otomatis dengan cover image
✅ Twitter Cards: Otomatis dengan cover image
✅ Article Schema: Otomatis dengan author, date, tags
✅ Breadcrumb: Otomatis include article
✅ Sitemap: Otomatis include `/article/slug`
```

---

### 2️⃣ PRODUCT BARU

#### Di Backend (Saat Add Product)

```javascript
// POST /api/products
{
  title: "Super Adhesive 3000",
  description: "Adhesive terbaik untuk industrial...",
  category: "Industrial Adhesive",
  price: 50000,
  sku: "SA-3000",
  image: "/uploads/super-adhesive.jpg",
  features: ["Fast drying", "High strength", "Waterproof"],
  application: "Industrial Assembly"
}
```

#### Di Frontend (Halaman Product Detail)

```javascript
import { generateProductMeta, generateProductStructuredData } from '@/lib/seo-utils';

export default function ProductDetailPage() {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const response = await api.get(`/products/${productId}`);
    setProduct(response.data);
  }, [productId]);

  // ✅ AUTO GENERATE SEO META
  const seoMeta = generateProductMeta({
    title: product?.title,
    description: product?.description,
    image: product?.image,
    price: product?.price,
    url: `https://esabumindo.com/product/${product?.id}`,
    sku: product?.sku,
    category: product?.category
  });

  // ✅ AUTO GENERATE STRUCTURED DATA
  const productSchema = generateProductStructuredData({
    title: product?.title,
    description: product?.description,
    image: product?.image,
    price: product?.price,
    sku: product?.sku,
    rating: product?.rating // if available
  });

  return (
    <>
      <Head>
        <title>{seoMeta.title}</title>
        <meta name="description" content={seoMeta.description} />
        <meta name="keywords" content={seoMeta.keywords} />
        {/* ... other meta tags ... */}
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      </Head>
      {/* Product content */}
    </>
  );
}
```

#### Hasil SEO

```
✅ Title: "Super Adhesive 3000 | Esabumindo"
✅ Meta Description: "Adhesive terbaik untuk industrial..."
✅ Keywords: "Super Adhesive 3000, industrial adhesive, adhesive"
✅ Open Graph Tags: Otomatis dengan product image
✅ Twitter Cards: Otomatis dengan product image
✅ Product Schema: Otomatis dengan harga, SKU, kategori
✅ Breadcrumb: Otomatis include product
✅ Sitemap: Otomatis include `/product/id`
```

---

### 3️⃣ FAQ PAGE

#### Saat Generate FAQ Schema

```javascript
import { generateFAQSchema } from "@/lib/seo-utils";

const faqItems = [
  {
    id: 1,
    question: "Apa keuntungan adhesive ini?",
    answer: "Keuntungannya adalah...",
    category: "Product",
  },
  {
    id: 2,
    question: "Berapa lama pengeringan?",
    answer: "Waktu pengeringan adalah...",
    category: "Usage",
  },
];

// ✅ AUTO GENERATE FAQ SCHEMA
const faqSchema = generateFAQSchema(faqItems);

// Output untuk <Head> section
<script type="application/ld+json">{JSON.stringify(faqSchema)}</script>;
```

#### Hasil SEO

```
✅ FAQ Schema: Otomatis structured data
✅ Google Rich Results: FAQ box muncul di search results
✅ Enhanced SERP: Better visibility dengan FAQ snippets
```

---

## 🔄 SITEMAP AUTO-UPDATE

### Cara Kerja

```javascript
// pages/api/sitemap.js
// Setiap kali diakses, fetch data real-time dari API

GET /api/articles/published
  ↓
Get semua articles
  ↓
Add ke sitemap dengan URL `/article/slug`
  ↓
Auto-update dalam sitemap.xml
```

### Contoh Output Sitemap

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  <url>
    <loc>https://esabumindo.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Articles Auto-Added -->
  <url>
    <loc>https://esabumindo.com/article/cara-menggunakan-adhesive</loc>
    <lastmod>2024-01-23</lastmod>
    <changefreq>never</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Products Auto-Added -->
  <url>
    <loc>https://esabumindo.com/product/123</loc>
    <lastmod>2024-01-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

---

## ⚙️ SETUP UNTUK IMPLEMENTASI

### Step 1: Verify Files Exist

```bash
# Cek apakah file sudah ada
ls -la lib/seo-utils.js          # ✅ SEO utilities
ls -la lib/cache-manager.js       # ✅ Cache manager
ls -la pages/api/sitemap.js       # ✅ Sitemap route
ls -la pages/api/robots.js        # ✅ Robots route
```

### Step 2: Import di Pages yang Diperlukan

```javascript
// pages/article/[slug].js atau pages/product/[id].js
import {
  generateArticleMeta,
  generateArticleStructuredData,
} from "@/lib/seo-utils";
```

### Step 3: Update Environment Variables

```bash
# .env.local
NEXT_PUBLIC_BASE_URL=https://esabumindo.com
NEXT_PUBLIC_API_URL=https://api.esabumindo.com/api
```

### Step 4: Backend Integration

Pastikan backend API return data dengan struktur:

```javascript
// GET /api/articles/:id
{
  id: 1,
  title: "Article Title",
  description: "Short description",
  content: "Full content",
  coverImage: "/uploads/image.jpg",
  author: "Author Name",
  publishedAt: "2024-01-23",
  tags: ["tag1", "tag2"],
  slug: "article-title"
}

// GET /api/products/:id
{
  id: 1,
  title: "Product Name",
  description: "Product description",
  image: "/uploads/product.jpg",
  price: 50000,
  sku: "PROD-001",
  category: "Category",
  features: ["Feature 1", "Feature 2"]
}
```

---

## 🧪 TESTING AUTO SEO

### Test 1: Publish Article Baru

```bash
1. Go to admin panel
2. Create new article
3. Publish
4. Visit /article/slug
5. View Page Source
6. Verify meta tags ada ✅
7. Check sitemap.xml include URL baru ✅
```

### Test 2: Add Product Baru

```bash
1. Go to admin panel
2. Create new product
3. Save
4. Visit /product/id
5. View Page Source
6. Verify meta tags ada ✅
7. Check schema.org validator ✅
```

### Test 3: Validate Sitemap

```bash
1. Visit https://yoursite.com/sitemap.xml
2. Search untuk article/slug baru
3. Should appear dalam sitemap ✅
4. Lastmod date should be recent ✅
```

### Test 4: Check Robots.txt

```bash
1. Visit https://yoursite.com/robots.txt
2. Should show crawl directives ✅
3. Should include Sitemap URL ✅
```

---

## 📊 MONITORING AUTO SEO

### Dashboard Metrics

```javascript
// Useful metrics untuk monitor
1. Sitemap URLs count
   - Static pages: 5
   - Articles: X
   - Products: Y
   - Total: 5 + X + Y

2. Meta tags coverage
   - Pages with meta: Y%
   - Pages with schema: Y%

3. Rendering performance
   - Target: <5ms ✅
   - Actual: Monitor dengan Lighthouse

4. Google Search Console
   - Indexed URLs
   - Crawl stats
   - Rankings
```

---

## 🎯 BEST PRACTICES

### Do's ✅

- ✅ Always fill title, description, image saat input data
- ✅ Use descriptive, keyword-rich titles
- ✅ Keep descriptions concise (150-160 chars)
- ✅ Upload high-quality images (1200x630 untuk OG)
- ✅ Use proper tags/categories
- ✅ Update data jika ada perubahan penting
- ✅ Monitor Google Search Console regularly

### Don'ts ❌

- ❌ Don't leave title/description empty
- ❌ Don't use clickbait titles
- ❌ Don't duplicate content across articles
- ❌ Don't upload low-quality images
- ❌ Don't forget canonical URLs
- ❌ Don't ignore crawl errors di GSC
- ❌ Don't spam keywords

---

## 🚀 ADVANCED FEATURES

### Custom Meta Tags

Jika perlu custom meta untuk halaman spesifik:

```javascript
const customMeta = generatePageMeta({
  title: "Custom Title",
  description: "Custom Description",
  keywords: "custom, keywords",
  // Override defaults
  locale: "id_ID",
  author: "Custom Author",
});
```

### Breadcrumb Customization

```javascript
const customBreadcrumb = generateBreadcrumbSchema([
  { name: "Articles", url: "https://esabumindo.com/article" },
  { name: "Tutorial", url: "https://esabumindo.com/article/tutorial" },
  { name: "Current Article", url: "https://esabumindo.com/article/current" },
]);
```

### Cache Optimization

```javascript
import { globalCache } from "@/lib/cache-manager";

// Manual cache untuk data penting
globalCache.set("important_data", data, 10 * 60 * 1000); // 10 minutes

// Get cached data
const cached = globalCache.get("important_data");

// Check cache stats
console.log(globalCache.getStats());
```

---

## 📝 TROUBLESHOOTING

### Issue: Meta tags tidak muncul

**Solution:**

1. Check browser source (bukan DevTools)
2. Verify `<Head>` component dari Next.js digunakan
3. Check console untuk error
4. Restart development server

### Issue: Sitemap tidak update

**Solution:**

1. Verify API endpoints return correct data
2. Check `/api/sitemap.js` error logs
3. Try manual URL: `http://localhost:3000/sitemap.xml`
4. Check cache TTL setting

### Issue: Performance masih >5ms

**Solution:**

1. Check image optimization
2. Disable browser cache saat testing
3. Verify dynamic imports working
4. Check bundle size dengan `npm run build`

### Issue: Schema validation error

**Solution:**

1. Use schema.org JSON-LD validator
2. Check all required fields present
3. Verify data types correct
4. Check console untuk JavaScript errors

---

## 📚 REFERENCE

### Function List

| Function                             | Purpose            | Usage                |
| ------------------------------------ | ------------------ | -------------------- |
| generatePageMeta()                   | Generic page meta  | Home, About, Contact |
| generateArticleMeta()                | Article meta tags  | Article pages        |
| generateProductMeta()                | Product meta tags  | Product pages        |
| generateArticleStructuredData()      | Article schema     | Article JSON-LD      |
| generateProductStructuredData()      | Product schema     | Product JSON-LD      |
| generateOrganizationStructuredData() | Org schema         | Homepage             |
| generateBreadcrumbSchema()           | Breadcrumb schema  | All pages            |
| generateFAQSchema()                  | FAQ schema         | Contact, Help pages  |
| generateSitemapEntry()               | Sitemap entry      | Dynamic sitemap      |
| getCanonicalUrl()                    | Canonical URL      | URL generation       |
| generateImageAttributes()            | Image attributes   | Image optimization   |
| generateRobotsTxt()                  | Robots.txt content | Dynamic robots       |

---

## ✨ SUMMARY

✅ **Otomatis**: Semua data baru langsung SEO-friendly  
✅ **Dynamic**: Sitemap & robots auto-update  
✅ **Fast**: <5ms rendering dengan caching  
✅ **Scalable**: Mudah tambah article/product baru  
✅ **Production-Ready**: Siap deploy

**Status: READY TO USE** 🚀

---

**Last Updated**: January 23, 2026  
**Version**: 1.0.0
