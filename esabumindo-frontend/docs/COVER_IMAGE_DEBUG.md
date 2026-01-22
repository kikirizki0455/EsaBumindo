// docs/COVER_IMAGE_DEBUG.md

# 🖼️ Panduan Debug Cover Image - Artikel Esabumindo

## ⚠️ Masalah Cover Image Tidak Tampil

Jika cover image tidak tampil di halaman artikel, berikut solusinya:

---

## 🔍 Step 1: Cek Image Path di Database

### Via Prisma Studio

```bash
cd esabumindo-backend
npx prisma studio

# Buka: http://localhost:5555
# Pilih: Article table
# Lihat: column "coverImage"
```

CoverImage harus terisi dengan format:

```
/uploads/articles/article-1768808345693-325745169.jpg
```

❌ **Jangan gunakan format:**

- `http://localhost:3001/uploads/...` (absolute URL)
- `uploads/articles/...` (tanpa leading slash)
- Empty atau null

✅ **Gunakan format:**

- `/uploads/articles/article-TIMESTAMP-RANDOM.jpg` (relative path)

---

## 🔍 Step 2: Cek Folder & File Fisik

### Backend - Verify Image Files Exist

```bash
cd esabumindo-backend

# Check folder exists
ls -la public/uploads/articles/

# Should see file list like:
# -rw-r--r-- 1 user group 123456 Jan 22 10:30 article-1768808345693-325745169.jpg
```

❌ **Jika folder tidak ada:**

```bash
mkdir -p public/uploads/articles
chmod 755 public/uploads/articles
```

❌ **Jika files tidak ada di folder:**

- Upload ulang via admin panel
- Atau copy files dari uploads folder yang existing

### Frontend - Check Images Accessible

```bash
# Di browser console
fetch('http://localhost:3001/uploads/articles/article-1768808345693-325745169.jpg')
  .then(r => console.log('Status:', r.status))
```

Expected: Status 200 ✅

---

## 🔍 Step 3: Cek API Response

### Test GET Article

```bash
# Test article list
curl http://localhost:3001/api/articles/published | json_pp

# Output should include:
# {
#   "id": "uuid",
#   "title": "Article Title",
#   "coverImage": "/uploads/articles/article-1768808345693-325745169.jpg",
#   "slug": "article-slug"
# }
```

❌ **Jika coverImage null atau empty:**

- Update artikel di admin panel dengan image baru
- Atau manually update database:

```sql
UPDATE "Article"
SET "coverImage" = '/uploads/articles/article-1768808345693-325745169.jpg'
WHERE slug = 'article-slug';
```

---

## 🔍 Step 4: Cek Frontend Environment Variables

### Verify .env.local

```bash
cd esabumindo-frontend

# Check file
cat .env.local

# Should have:
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

❌ **Jika tidak ada:**

```bash
cp .env.example .env.local

# Edit dengan nilai yang benar
nano .env.local
```

### Verify Image URL Construction

```javascript
// Di browser console saat akses artikel page

// Correct URL construction
const apiUrl = "http://localhost:3001/api";
const baseUrl = apiUrl.replace("/api", ""); // http://localhost:3001
const imagePath = "/uploads/articles/article-xxx.jpg";
const fullUrl = `${baseUrl}${imagePath}`; // http://localhost:3001/uploads/articles/article-xxx.jpg

console.log("Full URL:", fullUrl);

// Test fetch
fetch(fullUrl).then((r) => console.log("Status:", r.status));
```

Expected: Full URL is correct ✅ dan Status 200 ✅

---

## 🔍 Step 5: Cek CORS & Backend Configuration

### Verify Backend Serving Static Files

```bash
# Test direct access to image
curl -I http://localhost:3001/uploads/articles/article-1768808345693-325745169.jpg

# Should show:
# HTTP/1.1 200 OK
# Content-Type: image/jpeg
# Content-Length: 123456
```

❌ **Jika error 404:**

- Check folder permissions
- Verify file exists: `ls -la public/uploads/articles/article-xxx.jpg`
- Check main.ts atau app.module.ts menggunakan ServeStaticModule

```typescript
// src/main.ts harus ada:
import { NestExpressApplication } from "@nestjs/platform-express";

app.useStaticAssets("public", {
  prefix: "/uploads",
});
```

### Verify CORS Configuration

```typescript
// src/main.ts harus ada CORS enabled:
app.enableCors({
  origin: ["http://localhost:3000", "https://esabumindo.com"],
  credentials: true,
});
```

---

## 🔍 Step 6: Cek Browser Network Tab

### Open DevTools & Monitor

```
1. Open: http://localhost:3000/article
2. Press: F12 (DevTools)
3. Click: Network tab
4. Refresh: Ctrl+R
5. Look for image requests like: article-1768808345693-325745169.jpg
```

✅ **Jika image loaded:**

- Status: 200
- Size: > 0 bytes
- Type: image/jpeg atau image/webp

❌ **Jika image NOT loaded:**

- Status: 404 (image not found) → Check file exists
- Status: 403 (forbidden) → Check permissions
- No request at all → Check LazyImage component rendering

---

## 🔧 Quick Fixes Checklist

- [ ] Image path di database: `/uploads/articles/article-xxx.jpg` format ✅
- [ ] File exists: `ls public/uploads/articles/article-xxx.jpg` ✅
- [ ] Backend serving: `curl http://localhost:3001/uploads/articles/article-xxx.jpg` = 200 ✅
- [ ] Frontend env: `NEXT_PUBLIC_API_URL=http://localhost:3001/api` ✅
- [ ] Image URL constructed correctly di console ✅
- [ ] Network tab shows 200 status ✅
- [ ] CORS enabled di backend ✅
- [ ] ServeStaticModule configured ✅

---

## 🆘 Masih Tidak Bisa? Debug Dengan Logging

### Step 1: Enable Console Logging

Edit `pages/article/[slug].js`:

```javascript
const getFullImageUrl = useCallback((path) => {
  console.log("Original path:", path);

  if (!path) {
    console.log("Path is empty, using placeholder");
    return "/images/placeholder-article.jpg";
  }

  if (path.startsWith("http")) {
    console.log("Already full URL:", path);
    return path;
  }

  const apiHost = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace("/api", "")
    : "http://localhost:3001";

  const fullUrl = `${apiHost}${path}`;
  console.log("Constructed full URL:", fullUrl);

  return fullUrl;
}, []);
```

### Step 2: Check Console Output

```
1. Open article page
2. Open DevTools Console (F12)
3. Look for logs like:
   - Original path: /uploads/articles/article-xxx.jpg ✅
   - Constructed full URL: http://localhost:3001/uploads/articles/article-xxx.jpg ✅
```

### Step 3: Test LazyImage Component

```javascript
// Di console, test image fetch
fetch("http://localhost:3001/uploads/articles/article-xxx.jpg")
  .then((r) => {
    console.log("Status:", r.status);
    console.log("Headers:", r.headers);
    return r.blob();
  })
  .then((blob) => console.log("Blob size:", blob.size, "bytes"))
  .catch((e) => console.error("Error:", e));
```

---

## 💡 Common Issues & Solutions

### Issue 1: Image path null/undefined

**Cause:** Article tidak punya cover image saat dibuat
**Solution:**

```bash
# Update article dengan cover image
# Via admin panel atau:
UPDATE "Article"
SET "coverImage" = '/uploads/articles/article-1768808345693-325745169.jpg'
WHERE id = 'article-id';
```

### Issue 2: Image 404 (Not Found)

**Cause:** File tidak ada di `public/uploads/articles/`
**Solution:**

- Upload ulang via admin panel
- Atau copy file dari backup

### Issue 3: Image 403 (Forbidden)

**Cause:** Permission issue pada file atau folder
**Solution:**

```bash
chmod 755 public/uploads/articles/
chmod 644 public/uploads/articles/*
```

### Issue 4: CORS Error

**Cause:** Backend CORS tidak dikonfigurasi
**Solution:** Ensure CORS enabled di `src/main.ts`:

```typescript
app.enableCors({
  origin: "*", // atau specific origins
  credentials: true,
});
```

### Issue 5: Image tidak lazy load

**Cause:** LazyImage component issue
**Solution:** Check browser support:

```javascript
// Test IntersectionObserver support
console.log(
  "IntersectionObserver supported:",
  "IntersectionObserver" in window
);
```

---

## 📊 Full Debugging Flowchart

```
1. Is coverImage null in database?
   ├─ YES → Go to Step 2
   └─ NO → Go to Step 3

2. Update/re-upload image
   └─ Go to Step 3

3. Does file exist in public/uploads/articles/?
   ├─ NO → Check upload permissions → Upload again
   └─ YES → Go to Step 4

4. Can backend serve the image? (curl test)
   ├─ NO → Check CORS, ServeStaticModule
   └─ YES → Go to Step 5

5. Is frontend env configured correctly?
   ├─ NO → Update .env.local
   └─ YES → Go to Step 6

6. Is image URL constructed correctly? (console test)
   ├─ NO → Check getImageUrl function
   └─ YES → Go to Step 7

7. Does Network tab show 200 status?
   ├─ NO → Check image file permissions
   └─ YES → Image should display! ✅
```

---

## 🚀 Quick Test Script

```bash
#!/bin/bash
# test-cover-image.sh

API_URL="http://localhost:3001"

echo "🔍 Testing Cover Image Setup..."
echo ""

echo "1. Checking if backend is running..."
curl -s "$API_URL/api/articles/published" > /dev/null && echo "✅ Backend OK" || echo "❌ Backend NOT running"

echo ""
echo "2. Getting first article..."
ARTICLE=$(curl -s "$API_URL/api/articles/published" | jq '.[0]')
SLUG=$(echo $ARTICLE | jq -r '.slug')
IMAGE_PATH=$(echo $ARTICLE | jq -r '.coverImage')

echo "Slug: $SLUG"
echo "Image path: $IMAGE_PATH"

echo ""
echo "3. Checking if image file exists..."
if [ -f "esabumindo-backend/public$IMAGE_PATH" ]; then
  echo "✅ Image file exists"
  SIZE=$(ls -lh "esabumindo-backend/public$IMAGE_PATH" | awk '{print $5}')
  echo "File size: $SIZE"
else
  echo "❌ Image file NOT found at: esabumindo-backend/public$IMAGE_PATH"
fi

echo ""
echo "4. Testing image URL..."
FULL_URL="$API_URL$IMAGE_PATH"
echo "Full URL: $FULL_URL"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FULL_URL")
echo "HTTP Status: $STATUS"
[ "$STATUS" = "200" ] && echo "✅ Image accessible" || echo "❌ Image NOT accessible"

echo ""
echo "Done! ✓"
```

---

## 📞 Masih Butuh Bantuan?

Kumpulkan informasi berikut saat report issue:

1. **Database Screenshot:**

   - Buka Prisma Studio
   - Foto column "coverImage" value

2. **Backend Log:**

   ```bash
   npm run start:dev 2>&1 | tail -100
   ```

3. **Frontend Console Error:**

   - F12 → Console
   - Cari error message

4. **Network Request:**

   - F12 → Network → cari image request
   - Screenshot headers & response

5. **Environment Variables:**
   ```bash
   cat esabumindo-frontend/.env.local
   ```

Dengan info di atas, kita bisa debug lebih cepat! 🚀
