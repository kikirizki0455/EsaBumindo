// docs/ARTICLE_IMAGE_FIX.md

# 🖼️ Analisis & Solusi Masalah Gambar Artikel

## 📋 Ringkasan Masalah

Terdapat 3 masalah utama pada halaman artikel:

1. **Cover image tidak muncul** di index.js dan [slug].js
2. **Gambar dalam content blocks** sebagian muncul, sebagian jadi skeleton saat di-scroll
3. **Gambar placeholder terus berjalan** (infinite skeleton animation)

---

## 🔍 Root Cause Analysis

### Masalah #1: Cover Image Tidak Muncul

**Penyebab:**

- File `prisma/seed-articles.ts` tidak memiliki field `coverImage`
- Data di database memiliki `coverImage: null`
- BlockRenderer dan index.js tidak bisa menampilkan gambar jika data kosong

**File yang Bermasalah:**

```
❌ prisma/seed-articles.ts - tidak ada coverImage field
❌ pages/article/[slug].js - data dari API tidak memiliki coverImage
❌ pages/index.js - ditampilkan kosong
```

---

### Masalah #2: Gambar di Content Blocks Jadi Skeleton Saat Scroll

**Penyebab Utama - LazyImage Component Bug:**

```javascript
// ❌ MASALAH: Menggunakan getElementById dengan ID yang tidak konsisten
const imageContainer = document.getElementById(`lazy-img-${src}`);
if (imageContainer) {
  observer.observe(imageContainer);
}

// Jika element tidak ketemu, IntersectionObserver tidak ter-attach
// → Skeleton terus muncul karena isLoading never becomes false
```

**Masalah Teknis:**

1. Container div dibuat dengan ID `lazy-img-${src}`
2. Tapi IntersectionObserver hanya attach jika element ditemukan
3. Kalau element tidak ketemu → observer tidak attach
4. Saat scroll → skeleton berjalan selamanya (infinite loop)

**File yang Bermasalah:**

```
❌ components/article/lazy-image.jsx (line 36-47)
   - Menggunakan getElementById yang unreliable
   - Tidak ada error handling jika element tidak ketemu
   - setState dependency issue di useEffect
```

---

### Masalah #3: URL Gambar Tidak Valid

**Penyebab:**

- `getFullImageUrl()` tidak menangani berbagai format path
- Backend mengembalikan path dengan format yang tidak konsisten
- API_URL environment variable mungkin tidak tepat

**File yang Bermasalah:**

```
❌ pages/article/[slug].js (getFullImageUrl function)
   - Tidak handle edge case
   - Tidak ada fallback placeholder
   - Logging tidak lengkap
```

---

## ✅ Solusi Yang Diimplementasikan

### Solusi #1: Perbaiki LazyImage Component

**Mengubah dari `getElementById` ke `useRef`:**

```javascript
// ✅ BEFORE (problematic)
const imageContainer = document.getElementById(`lazy-img-${src}`);

// ✅ AFTER (fixed)
const containerRef = useRef(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !imageSrc) {
          setImageSrc(src);
          setIsLoading(true);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "50px",
      threshold: 0.01,
    }
  );

  if (containerRef.current) {
    observer.observe(containerRef.current);
  }

  return () => observer.disconnect();
}, [priority, src, imageSrc]);
```

**Keuntungan:**

- ✅ Ref selalu ter-attach pada element yang tepat
- ✅ Tidak bergantung pada ID selector
- ✅ Observer disconnect dengan proper
- ✅ Skeleton animation berhenti ketika image load

---

### Solusi #2: Update Seed Data dengan Cover Image

**Tambahkan `coverImage` ke setiap artikel:**

```typescript
// ✅ SEBELUM
{
  title: 'Keunggulan Adhesive...',
  slug: 'keunggulan-adhesive-berkualitas',
  contentBlocks: [/* ... */],
  excerpt: 'Pelajari...',
  // ❌ TIDAK ADA: coverImage
}

// ✅ SESUDAH
{
  title: 'Keunggulan Adhesive...',
  slug: 'keunggulan-adhesive-berkualitas',
  coverImage: '/uploads/articles/adhesive-quality-cover.jpg', // ✅ DITAMBAH
  contentBlocks: [
    // ✅ TAMBAHKAN id, level ke setiap block
    {
      id: 'block-1',
      type: 'heading',
      level: 2,
      content: '...'
    },
    // ✅ TAMBAHKAN image blocks
    {
      id: 'block-3',
      type: 'image',
      layout: 'single',
      images: [{
        url: '/uploads/articles/adhesive-application-1.jpg',
        alt: '...',
        caption: '...'
      }]
    }
  ]
}
```

**File yang Diubah:**

```
✅ prisma/seed-articles.ts
   - Tambah coverImage untuk setiap artikel
   - Tambah id, level ke setiap content block
   - Tambah image blocks dengan proper structure
```

---

### Solusi #3: Improve URL Handling di Frontend

**Better `getFullImageUrl()` function:**

```javascript
// ✅ SEBELUM (problematic)
const getFullImageUrl = (path) => {
  if (!path) return "/images/placeholder-article.jpg";
  if (path.startsWith("http")) return path;

  const apiHost = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace("/api", "")
    : "http://localhost:3001";

  return `${apiHost}${path}`;
};

// ✅ SESUDAH (fixed)
const getFullImageUrl = useCallback((path) => {
  if (!path) return "/images/placeholder-article.jpg";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("/uploads/")) {
    const apiHost = process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL.replace("/api", "")
      : "http://localhost:3001";
    return `${apiHost}${path}`;
  }

  console.warn(`Invalid image path: ${path}`);
  return "/images/placeholder-article.jpg";
}, []);
```

**Improvements:**

- ✅ Validasi path yang lebih ketat
- ✅ Handle berbagai format URL
- ✅ Console warning untuk debug
- ✅ Fallback ke placeholder
- ✅ useCallback memoization

---

## 📝 Steps to Test

### 1. Generate Placeholder Images

```bash
cd esabumindo-backend
npm run prisma:seed
```

### 2. Reset Database dan Seed

```bash
npm run prisma:reset
# atau
npm run prisma:migrate
npm run prisma:seed
```

### 3. Test di Frontend

```bash
cd esabumindo-frontend
npm run dev
```

**Test Cases:**

- [ ] Buka http://localhost:3000/article - cek cover image muncul
- [ ] Click artikel → halaman detail muncul, cover image terlihat
- [ ] Scroll content → gambar di dalam article load smooth (tidak jadi skeleton lama)
- [ ] Buka DevTools Console → tidak ada warning tentang image path

---

## 📊 Perubahan File Summary

| File                                    | Perubahan                                | Status |
| --------------------------------------- | ---------------------------------------- | ------ |
| `components/article/lazy-image.jsx`     | Fix IntersectionObserver, gunakan useRef | ✅     |
| `pages/article/[slug].js`               | Improve getFullImageUrl, add logging     | ✅     |
| `prisma/seed-articles.ts`               | Tambah coverImage & image blocks         | ✅     |
| `prisma/generate-placeholder-images.ts` | Script generate placeholder              | ✅     |

---

## 🎯 Expected Results Setelah Fix

✅ **Cover image muncul di index.js**

- Card artikel menampilkan thumbnail
- Placeholder jika coverImage kosong

✅ **Cover image muncul di [slug].js**

- Image hero section terlihat dengan baik
- Load smooth, tidak jadi skeleton lama

✅ **Gambar di content blocks muncul lancar**

- Lazy loading bekerja dengan proper
- Skeleton animation berhenti saat image load
- Scroll smooth tanpa freeze

✅ **Better error handling**

- Console log jika ada masalah dengan image path
- Fallback ke placeholder jika URL invalid
- Network error handling yang lebih baik

---

## 🔧 Configuration Files

### .env.local (Frontend)

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### .env (Backend)

```
API_URL=http://localhost:3001
UPLOAD_DIR=./public/uploads/articles
```

### Prisma Schema

```prisma
model Article {
  coverImage  String?  // ✅ Bisa null atau path
  contentBlocks Json   // ✅ Array of content blocks
}
```

---

## 📚 References

- **Lazy Loading:** https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- **Next.js Image:** https://nextjs.org/docs/api-reference/next/image
- **React useRef:** https://react.dev/reference/react/useRef
