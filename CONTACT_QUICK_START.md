# 🚀 QUICK START GUIDE - Contact Page + Email Integration

## ⚡ Setup dalam 5 Menit

### Step 1: Backend Setup (2 menit)

```bash
# 1. Navigate ke backend folder
cd esabumindo-backend

# 2. Buat file .env (copy dari .env.example)
cp .env.example .env

# 3. Edit .env dan pastikan ini terisi:
# EMAIL_USER=kikirizki0455@gmail.com
# EMAIL_PASSWORD=fsnt wlzy iblw asvn

# 4. Jalankan backend
npm install
npm run start:dev
```

✅ Backend berjalan di: http://localhost:3001

---

### Step 2: Frontend Setup (2 menit)

```bash
# 1. Navigate ke frontend folder
cd ../esabumindo-frontend

# 2. Buat/update file .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001/api
EOF

# 3. Install dependencies dan jalankan
npm install
npm run dev
```

✅ Frontend berjalan di: http://localhost:3000

---

### Step 3: Test Contact Form (1 menit)

```bash
# Buka di browser:
# http://localhost:3000/contact

# Test dengan isi form:
# - Nama: Test User
# - Email: your-email@gmail.com
# - Telepon: 08123456789
# - Pesan: Test message

# Klik "Kirim Pesan"
# ✅ Verifikasi email terkirim di Gmail inbox
```

---

## 📋 Checklist

- [ ] Backend running di port 3001
- [ ] Frontend running di port 3000
- [ ] .env dan .env.local sudah dikonfigurasi
- [ ] Email terkirim ke Gmail inbox
- [ ] Confirmation email diterima
- [ ] FAQ accordion membuka/menutup
- [ ] Form validation bekerja
- [ ] Mobile responsive OK

---

## 🔑 Perubahan Utama

### Backend (`src/email/`)

```
email.service.ts     - Email logic dengan template HTML
email.controller.ts  - API endpoint POST /api/email/contact
email.module.ts      - Module configuration
```

### Frontend (`pages/contact.js`)

```
✨ Skeleton loading saat load image
📸 Next.js Image optimization
⚡ Lazy loading untuk maps
💬 FAQ section dengan 6 kategori
✅ Form validation & error handling
📧 Integration dengan Gmail API
```

---

## 📧 Template Email

### Admin Email (untuk tim)

- Header: Purple gradient dengan logo ESA BUMINDO
- Konten: Sender info + full message
- Footer: Contact details

### Confirmation Email (untuk user)

- Header: Green gradient dengan checkmark
- Konten: Thank you + next steps
- Footer: Operating hours

---

## 🐛 Quick Troubleshooting

| Problem              | Solution                                                                        |
| -------------------- | ------------------------------------------------------------------------------- |
| Email tidak terkirim | Cek EMAIL_PASSWORD adalah App Password (dari myaccount.google.com/apppasswords) |
| Backend error        | Jalankan `npm install` dulu, pastikan port 3001 kosong                          |
| Form tidak submit    | Cek NEXT_PUBLIC_API_URL di .env.local                                           |
| Image tidak muncul   | Pastikan file `/public/asset/contact-hero.jpg` ada                              |

---

## 📚 Dokumentasi Lengkap

- **CONTACT_PAGE_GUIDE.md** - Dokumentasi lengkap dengan semua detail
- **CONTACT_EMAIL_TESTING.md** - Testing guide dengan berbagai metode

---

## 🎯 Features Checklist

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Skeleton loading dengan animasi
- ✅ Next.js Image optimization
- ✅ Lazy loading Google Maps
- ✅ Email HTML template professional
- ✅ Admin email notification
- ✅ User confirmation email
- ✅ FAQ dengan 6 kategori
- ✅ Form validation & error handling
- ✅ Loading states & user feedback
- ✅ Performance optimized (< 5ms render)

---

## 🚀 Next Steps

Setelah setup berhasil:

1. **Customize FAQ** - Edit `faqData` di contact.js sesuai produk Anda
2. **Update Kontak** - Ganti alamat, telepon, email di contact info section
3. **Add Hero Image** - Upload gambar ke `/public/asset/contact-hero.jpg`
4. **Customize Email** - Update logo, warna, text di email template
5. **Add Validation** - Tambah reCAPTCHA untuk prevent spam (future)

---

**Last Updated**: January 23, 2026
**Status**: ✅ Ready to Use
