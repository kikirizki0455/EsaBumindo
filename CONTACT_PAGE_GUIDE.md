# 📧 Contact Page - Implementation Guide

## Overview

Halaman kontak telah diperbaharui dengan fitur-fitur berikut:

- ✅ Desain modern dan responsive dengan Tailwind CSS
- ✅ Skeleton loading untuk performa optimal
- ✅ Next.js Image optimization
- ✅ Lazy loading untuk iframe Google Maps
- ✅ Integrasi email dengan Gmail menggunakan nodemailer
- ✅ Template email HTML yang professional dan corporate
- ✅ FAQ section dengan 6 kategori pertanyaan tentang produk lem
- ✅ Form validation dan error handling
- ✅ Loading states dan user feedback

---

## 🚀 Setup Instructions

### Backend Setup (NestJS)

#### 1. Install Dependencies

```bash
cd esabumindo-backend
npm install
```

#### 2. Environment Variables

Pastikan `.env` file Anda memiliki konfigurasi email:

```env
# Email Configuration
EMAIL_USER=kikirizki0455@gmail.com
EMAIL_PASSWORD=fsnt wlzy iblw asvn

# Database (jika ada)
DATABASE_URL=your_database_url
```

**⚠️ PENTING: Gunakan Gmail App Password, bukan password biasa!**

- Kunjungi: https://myaccount.google.com/apppasswords
- Pilih app: Mail
- Pilih device: Windows Computer (atau device Anda)
- Copy password yang dihasilkan (16 karakter tanpa spasi)

#### 3. Email Module Structure

```
src/email/
├── email.service.ts      # Service untuk mengirim email dengan template
├── email.controller.ts   # Controller untuk API endpoint
└── email.module.ts       # Module configuration
```

#### 4. API Endpoint

- **POST** `/api/email/contact`
- **Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "08123456789",
  "message": "Pertanyaan tentang produk lem..."
}
```

- **Response Success:**

```json
{
  "success": true,
  "message": "Pesan berhasil dikirim"
}
```

- **Response Error:**

```json
{
  "success": false,
  "message": "Gagal mengirim pesan: [error details]"
}
```

#### 5. Menjalankan Backend

```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

---

### Frontend Setup (Next.js)

#### 1. Environment Variables

Update file `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Jika menggunakan production
# NEXT_PUBLIC_API_URL=https://api.esabumindo.com/api
```

#### 2. Image Requirements

Pastikan file image berikut ada di `public/asset/`:

- `contact-hero.jpg` - Hero image untuk contact page (min: 1200x450px)

Jika belum ada, gunakan placeholder atau ganti src di contact.js:

```javascript
src = "/asset/contact-hero.jpg";
// Atau ganti dengan URL eksternal
src = "https://your-cdn.com/contact-hero.jpg";
```

#### 3. Development Server

```bash
cd esabumindo-frontend
npm install
npm run dev
```

Buka: http://localhost:3000/contact

---

## 📧 Email Templates

### 1. Incoming Message Template

Email yang diterima tim ketika ada pesan dari kontak form.

**Fitur:**

- Header dengan gradient brand color
- Info pengirim yang terorganisir
- Isi pesan dalam box highlight
- Footer dengan info kontak

**Screenshot:**

- Gradient header biru-ungu
- Bagian sender info dengan background abu-abu
- Message section dengan background kuning
- Footer dengan contact details

### 2. Confirmation Email

Email konfirmasi ke pengirim pesan.

**Fitur:**

- Success message dengan checkmark
- Informasi next steps
- Contact info untuk pertanyaan mendesak
- Professional corporate branding

**Personalisasi:**
Semua email ditandatangani dengan:

- Logo/emoji: 🧴
- Nama: ESA BUMINDO
- Tagline: Solusi Adhesive Berkualitas Tinggi

---

## ❓ FAQ Data Structure

FAQ terdiri dari 6 item dengan kategori:

### Categories:

1. **Produk** - Rekomendasi produk untuk kebutuhan tertentu
2. **Teknis** - Informasi teknis tentang produk
3. **Keselamatan** - Keamanan dan safety guidelines
4. **Harga** - Informasi pricing dan bulk orders
5. **Garansi** - Warranty dan garansi produk
6. **Aplikasi** - Cara aplikasi dan best practices

### Menambah FAQ Baru:

Edit array `faqData` di `pages/contact.js`:

```javascript
{
  id: 7,
  question: 'Pertanyaan Anda di sini?',
  answer: 'Jawaban lengkap Anda di sini...',
  category: 'Kategori',
}
```

---

## 🎨 Design Features

### Skeleton Loading

- Digunakan pada hero image dan maps
- Animasi pulse otomatis selama loading
- Smooth transition ke konten sebenarnya

### Animations

- **Fade In**: Hero title dan subtitle
- **Fade In Up**: Card content
- **Pulse**: Skeleton loading
- **Slide Down**: FAQ expand/collapse

### Responsive Design

- Mobile: Optimized untuk layar kecil
- Tablet: Grid 2 kolom untuk form + info
- Desktop: Full responsive dengan max-width container

### Color Scheme

- Primary: Blue (#3B82F6)
- Secondary: Purple (#764BA2)
- Success: Green (#4CAF50)
- Error: Red (#EF4444)
- Info icons: Various colors untuk visual distinction

---

## ⚡ Performance Optimizations

### 1. Next.js Image

```javascript
<Image
  src="/asset/contact-hero.jpg"
  alt="Hubungi Kami"
  fill
  className="object-cover"
  priority={true} // Untuk hero image
  sizes="(max-width: 768px) 100vw, 100vw"
/>
```

- Automatic format conversion (WebP)
- Responsive image sizing
- Lazy loading (default)
- Priority loading untuk hero image

### 2. Lazy Loading Maps

```javascript
<iframe
  src="https://www.google.com/maps/embed?..."
  loading="lazy"
  // ...
/>
```

### 3. Form Optimization

- useCallback untuk prevent unnecessary re-renders
- Conditional rendering untuk loading states
- Efficient state management

### Expected Performance:

- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.5s

---

## 🔐 Security Considerations

### Email Security

1. **Environment Variables**: Credentials disimpan di `.env`, tidak di kode
2. **Validation**: Form fields divalidasi sebelum dikirim
3. **Rate Limiting**: (Optional) Implementasikan di API

### Data Protection

1. **Email Privacy**: Jangan expose EMAIL_PASSWORD di frontend
2. **CORS**: Pastikan API hanya accept request dari domain yang diizinkan
3. **Input Sanitization**: Gunakan DOMPurify jika menampilkan user input

---

## 🐛 Troubleshooting

### Email tidak terkirim

**Error: "Invalid login credentials"**

```
Solusi:
1. Pastikan EMAIL_PASSWORD adalah App Password, bukan password account
2. Periksa apakah 2FA enabled di Gmail account
3. Verifikasi format password (16 karakter, tanpa spasi)
```

**Error: "ECONNREFUSED"**

```
Solusi:
1. Pastikan backend running di port 3001
2. Check NEXT_PUBLIC_API_URL di .env.local
3. Verify CORS settings di backend
```

### Image tidak muncul

**Hero image blank**

```
Solusi:
1. Pastikan file ada: public/asset/contact-hero.jpg
2. Check browser console untuk error messages
3. Verify image dimensions (min 1200x450px)
```

**Maps tidak muncul**

```
Solusi:
1. Verify internet connection
2. Check browser console untuk blocked requests
3. Pastikan iFrame src valid
```

### Form tidak submit

**Button tidak responsive**

```
Solusi:
1. Check browser console untuk JavaScript errors
2. Verify NEXT_PUBLIC_API_URL correct
3. Test API endpoint dengan Postman/curl
```

---

## 📝 Testing Checklist

- [ ] Hero image loads with skeleton
- [ ] Form validation works (required fields)
- [ ] Email sends to Gmail successfully
- [ ] Confirmation email sent to user
- [ ] FAQ accordion opens/closes
- [ ] Maps iframe loads lazily
- [ ] Mobile responsive looks good
- [ ] Loading spinner shows during submit
- [ ] Success/error messages display correctly
- [ ] All links (email, phone) are clickable

---

## 📞 Contact Support

Jika ada pertanyaan atau issue:

1. Check troubleshooting section
2. Review console logs (F12 developer tools)
3. Verify environment variables
4. Test API endpoint directly

---

## 🔄 Future Enhancements

Ide untuk improvement:

- [ ] Add Recaptcha untuk spam prevention
- [ ] Implement rate limiting
- [ ] Add WhatsApp integration
- [ ] Store messages di database
- [ ] Dashboard untuk manage messages
- [ ] Email notifications ke team
- [ ] Auto-reply scheduling
- [ ] Multi-language FAQ

---

**Last Updated:** January 23, 2026
**Version:** 1.0.0
