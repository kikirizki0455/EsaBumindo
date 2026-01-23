# 🔧 PANDUAN MENJALANKAN APLIKASI - PERBAIKAN BUG API

## ⚠️ MASALAH YANG DITEMUKAN & DIPERBAIKI

### Masalah 1: Network Error saat Fetch API

**Error:** `Network Error` ketika mengakses halaman artikel admin dan public

**Penyebab Utama:**

- Backend NestJS belum berjalan di port 3001
- API URL tidak dikonfigurasi dengan benar di frontend
- Inconsistent API calls (ada yang pakai `api.get()`, ada yang pakai `fetch()`)
- Missing error handling dan fallback

**File yang Diperbaiki:**

1. ✅ `/pages/admin/artikel/index.js` - Consistent API calls + Error handling
2. ✅ `/pages/article/index.js` - Consistent API calls + Cache fallback + Error message
3. ✅ `/pages/admin/finance/index.js` - Consistent API calls + Error state
4. ✅ `/pages/admin/index.js` - Dashboard dengan error handling

---

## 🚀 CARA MENJALANKAN APLIKASI (LANGKAH DEMI LANGKAH)

### Step 1: Siapkan Terminal (2 Terminal Terpisah)

**Terminal 1** - Untuk Backend
**Terminal 2** - Untuk Frontend

---

### Step 2: Jalankan Backend NestJS

Di **Terminal 1**, jalankan:

```bash
cd d:\esabond\esabond_web\esabumindo-backend

# Install dependencies (jika belum)
npm install

# Jalankan dev server
npm run start:dev
```

**Expected Output:**

```
✅ Backend running on http://localhost:3001
📁 Static assets folder: d:\esabond\esabond_web\esabumindo-backend\public
📸 Images accessible at: http://localhost:3001/uploads/articles/
```

**Pastikan:**

- ✅ Backend berjalan tanpa error
- ✅ API accessible di `http://localhost:3001/api/articles`
- ✅ Database terkoneksi dengan baik

---

### Step 3: Jalankan Frontend Next.js

Di **Terminal 2**, jalankan:

```bash
cd d:\esabond\esabond_web\esabumindo-frontend

# Install dependencies (jika belum)
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local (pastikan URL benar)
# NEXT_PUBLIC_API_URL=http://localhost:3001/api
# NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Jalankan dev server
npm run dev
```

**Expected Output:**

```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

### Step 4: Test Aplikasi

**❌ JIKA MASIH ERROR:**

#### Testing Backend

```bash
# Test apakah backend berjalan
curl http://localhost:3001/api/articles/published

# Jika error 404, cek:
1. Backend belum start?
2. Port 3001 sudah dipakai aplikasi lain?
3. Database tidak terkoneksi?
```

#### Testing Frontend

Buka browser: `http://localhost:3000`

**Halaman yang bisa ditest:**

1. **Artikel Public** - `http://localhost:3000/article`

   - Seharusnya menampilkan list artikel
   - Jika error: "Gagal memuat artikel. Pastikan backend berjalan di port 3001"

2. **Artikel Admin** - `http://localhost:3000/admin/artikel`

   - Seharusnya menampilkan management artikel
   - Jika error: "Gagal memuat artikel. Pastikan backend berjalan di port 3001"

3. **Dashboard** - `http://localhost:3000/admin`
   - Seharusnya menampilkan stats
   - Jika error: "Gagal memuat dashboard. Pastikan backend berjalan di port 3001"

---

## 🔧 TROUBLESHOOTING

### Error: "Network Error" / "Gagal memuat..."

**Penyebab & Solusi:**

| Masalah                  | Penyebab                         | Solusi                                                                    |
| ------------------------ | -------------------------------- | ------------------------------------------------------------------------- |
| Backend tidak running    | Port 3001 tidak jalan            | `npm run start:dev` di backend folder                                     |
| Port 3001 sudah terpakai | Aplikasi lain menggunakan port   | Kill process atau ganti port di `.env`                                    |
| CORS Error               | Backend CORS tidak dikonfigurasi | Verify main.ts ada `enableCors()`                                         |
| API URL salah            | .env.local tidak dikonfigurasi   | Edit `.env.local` dan set `NEXT_PUBLIC_API_URL=http://localhost:3001/api` |
| Database error           | Database tidak running           | Setup database PostgreSQL                                                 |

**Quick Fixes:**

```bash
# Kill process yang menggunakan port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Restart backend
npm run start:dev

# Clear Next.js cache
rm -rf .next
npm run dev
```

---

## ✅ CHECKLIST SEBELUM PRESENTASI

- [ ] Backend berjalan di port 3001
- [ ] Frontend berjalan di port 3000
- [ ] Artikel page (`/article`) menampilkan data atau error message yang jelas
- [ ] Admin article page (`/admin/artikel`) menampilkan data atau error message yang jelas
- [ ] Dashboard (`/admin`) menampilkan stats atau error message yang jelas
- [ ] Tidak ada red error di console browser (F12)
- [ ] Tidak ada Network Error di Network tab

---

## 📝 SUMMARY PERUBAHAN

### Yang Diperbaiki:

1. **Consistent API Calls**

   - Semua menggunakan `api.get()`, `api.post()`, `api.patch()`, `api.delete()`
   - Tidak ada mix antara `axios` dan `fetch()`

2. **Error Handling**

   - Setiap halaman punya error state
   - User melihat pesan jelas: "Pastikan backend berjalan di port 3001"

3. **Fallback untuk Cache**

   - Halaman artikel punya fallback ke localStorage jika API error
   - User tetap bisa melihat artikel sebelumnya

4. **Better Error Messages**
   - User tahu persis apa masalahnya
   - Tidak hanya "Network Error" yang membingungkan

---

## 🎯 NEXT STEPS (UNTUK PRESENTASI)

1. ✅ Jalankan backend & frontend
2. ✅ Test semua halaman yang bermasalah
3. ✅ Screenshot hasil yang benar
4. ✅ Siapkan penjelasan tentang:
   - Masalah yang ditemukan
   - Bagaimana cara memperbaikinya
   - Error handling yang sudah ditambahkan

---

**Selamat! Bug sudah diperbaiki dan siap untuk presentasi! 🎉**
