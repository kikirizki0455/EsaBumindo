# Dokumentasi: Halaman Detail Product & Pre-Order

## 📋 Daftar File yang Dibuat

### Pages

- `pages/product/[id].js` - Halaman Detail Product
- `pages/pre-order/[id].js` - Halaman Form Pre-Order

### Components

- `components/product/product-detail-skeleton.jsx` - Skeleton Loader untuk Detail Product
- `components/product/pre-order-form-skeleton.jsx` - Skeleton Loader untuk Pre-Order Form
- `components/product/product-specifications.jsx` - Tab Spesifikasi Produk
- `components/product/product-technical-info.jsx` - Tab Informasi Teknis
- `components/product/related-products.jsx` - Produk Terkait
- `components/product/contact-method-selector.jsx` - Selector Metode Kontak (Email/WhatsApp)

### API Routes

- `pages/api/pre-order.js` - API untuk mengirim pre-order ke admin

### Configuration

- `.env.local.example` - Template environment variables

---

## 🎯 Fitur Utama

### 1. Halaman Detail Product (`/product/[id]`)

#### Karakteristik:

✅ **Lazy Loading Skeleton** - Tampilan placeholder saat loading
✅ **Optimasi Gambar** - Menggunakan Next.js Image component
✅ **Tab Navigation** - Gambaran Umum, Spesifikasi, Info Teknis
✅ **Responsive Design** - Mobile-first approach
✅ **Share & Download** - Bagikan produk dan download spesifikasi
✅ **Related Products** - Rekomendasi produk terkait
✅ **Clean Code** - Separation of concerns, memoization

#### Struktur Data Flow:

```
[id].js
├── Router Query (product ID)
├── useMemo → Fetch all products
├── useState → Product data, active tab, loading state
├── useCallback → Share, Download, Pre-Order handlers
├── Dynamic Import → Lazy load heavy components
└── Render → Main content dengan tabs
```

#### Best Practices Diterapkan:

- **Code Splitting** - Dynamic imports untuk komponen berat
- **Memoization** - useMemo untuk data produk
- **Callback Optimization** - useCallback untuk event handlers
- **Error Handling** - Fallback untuk gambar yang tidak loading
- **Image Optimization** - Next.js Image dengan priority loading
- **Performance** - Minimal re-renders dengan dependency arrays

---

### 2. Halaman Pre-Order (`/pre-order/[id]`)

#### Form Sections:

1. **Informasi Pribadi**

   - Nama Lengkap (required)
   - Email (required)
   - Nomor WhatsApp (required)

2. **Informasi Perusahaan**

   - Nama Perusahaan (required)
   - Industri/Sektor (optional)

3. **Detail Pre-Order**

   - Jumlah Pesanan
   - Catatan/Permintaan Khusus

4. **Metode Kontak**
   - Email (formal, tertulis)
   - WhatsApp (cepat, personal)

#### Form Features:

✅ **Real-time Validation** - Validasi saat submit
✅ **Status Messages** - Success/Error notifications
✅ **Disabled State** - UI feedback saat loading
✅ **Product Summary Sidebar** - Sticky review produk
✅ **Contact Info** - Bantuan customer service

#### Data Flow:

```
[id].js
├── Form State Management
│   ├── formData (input values)
│   ├── contactMethod (email/whatsapp)
│   ├── isSubmitting (loading state)
│   └── submitStatus (success/error)
├── Input Handlers
│   └── handleInputChange → Update state
├── Form Validation
│   └── Check required fields
├── API Call
│   └── POST /api/pre-order
└── Response Handling
    ├── Success → Redirect to /product
    └── Error → Show error message
```

---

## 🚀 Setup & Configuration

### 1. Install Dependency (jika belum ada)

```bash
npm install nodemailer
```

### 2. Setup Email (Gmail)

Jika menggunakan Gmail:

1. Buka: https://myaccount.google.com/security
2. Enable "2-Step Verification"
3. Create "App Password" untuk aplikasi
4. Copy password yang dihasilkan

### 3. Setup Environment Variables

Buat file `.env.local` (copy dari `.env.local.example`):

```bash
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Admin Contact
ADMIN_EMAIL=admin@esabond.com
ADMIN_PHONE=+62xxxxxxxxxxxx

# Optional: WhatsApp Integration
# TWILIO_ACCOUNT_SID=
# TWILIO_AUTH_TOKEN=
# TWILIO_WHATSAPP_FROM=

# API
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Update Contact Information

Update di `pages/pre-order/[id].js`:

- Line ~275: `mailto:info@esabond.com` → ganti dengan email admin
- Line ~283: `https://wa.me/62xxxx` → ganti dengan nomor WhatsApp

---

## 📧 Email Integration

### Flow Email:

1. **Email ke Admin** (Notifikasi Pre-Order Baru)

   - Formatted HTML dengan detail lengkap
   - Include link WhatsApp jika ada
   - Reply-To: customer email

2. **Email ke Customer** (Konfirmasi)
   - Terima kasih + summary
   - Order ID
   - Expected response time

### WhatsApp Integration (Optional)

Untuk mengirim WhatsApp otomatis, gunakan salah satu:

#### Option A: Twilio

```bash
npm install twilio
```

Setup di `.env.local`:

```
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_WHATSAPP_FROM=+14155552671
```

Uncomment code di `pages/api/pre-order.js` line ~80

#### Option B: Fonnte (Rekomendasi untuk Indo)

```bash
npm install axios
```

Setup di `.env.local`:

```
FONNTE_API_KEY=your_api_key
FONNTE_DEVICE_ID=your_device_id
```

#### Option C: WhatsApp Business API

- Paling kompleks, paling powerful
- Requires official WhatsApp approval

---

## 🎨 Styling & Color Scheme

Warna yang digunakan (sudah sesuai brand Esabond):

- **Primary Blue**: `#0c439a` - Tombol utama, link
- **Accent Red**: `#ca161e` - Highlight, accent
- **Gray**: `#f5f5f5` ke `#1f2937` - Background & text

Semua komponen maintain consistency dengan warna brand.

---

## 📊 Image Optimization

### Best Practices Diterapkan:

1. **Next.js Image Component**

   - Automatic format conversion (WebP, AVIF)
   - Responsive sizing
   - Lazy loading

2. **Image Path Structure**

   ```
   /public/images/products/
   ├── 1.png
   ├── 2.png
   ├── placeholder.png
   └── ...
   ```

3. **Fallback Handling**
   - Error callback untuk image yang broken
   - Fallback ke placeholder.png
   - User experience tetap smooth

---

## 🔄 Lazy Loading & Performance

### Dynamic Imports (Code Splitting)

```javascript
// Detail Product Page
const ProductDetailSkeleton = dynamic(
  () => import("@/components/product/product-detail-skeleton"),
  { loading: () => <div className="h-screen bg-gray-100 animate-pulse" /> }
);

const RelatedProducts = dynamic(
  () => import("@/components/product/related-products"),
  { loading: () => <div className="h-96 bg-gray-100 animate-pulse" /> }
);
```

**Benefit:**

- Smaller initial bundle
- Faster page load
- Better Core Web Vitals

### Skeleton Loading

Skeleton components ditampilkan saat lazy load:

- Smooth loading experience
- Better perceived performance
- Professional UX

---

## 🧪 Testing Checklist

### Product Detail Page

- [ ] Load halaman dengan ID produk valid
- [ ] Check skeleton loading tampil ~600ms
- [ ] Verify gambar load dengan error fallback
- [ ] Test share button (copy link)
- [ ] Test download spec button
- [ ] Click pre-order → navigate ke pre-order page
- [ ] Test tab navigation (Overview, Spesifikasi, Info Teknis)
- [ ] Test related products navigation
- [ ] Responsive test (mobile, tablet, desktop)

### Pre-Order Page

- [ ] Form validation (required fields)
- [ ] Input value updates state
- [ ] Email/WhatsApp selector works
- [ ] Submit button loading state
- [ ] Success message tampil
- [ ] Redirect ke /product setelah success
- [ ] Error handling (network error, etc)
- [ ] Sidebar sticky saat scroll
- [ ] Responsive form layout
- [ ] Contact links work (mailto, WhatsApp)

### Email Testing

- [ ] Admin email receive notification
- [ ] Customer email receive confirmation
- [ ] Email formatting looks good
- [ ] Links in email work

---

## 🔧 Maintenance & Customization

### Mengubah Product Data

Edit `data/products.jsx`:

```javascript
export const BEST_SELLER_PRODUCTS = [
  {
    id: "1",
    name: "Product Name",
    category: "Category",
    application: "Application",
    performance: "Performance",
    features: ["feature1", "feature2"],
    type: "Type",
  },
  // ...
];
```

### Mengubah Spesifikasi Produk

Edit `components/product/product-specifications.jsx`:

```javascript
const specifications = [
  {
    category: "Category Name",
    items: [
      { label: "Label", value: "Value" },
      // ...
    ],
  },
];
```

### Mengubah Informasi Teknis

Edit `components/product/product-technical-info.jsx`:

```javascript
const technicalInfo = [
  {
    title: "Title",
    content: "Content...",
  },
];

const usageGuidelines = ["Guideline 1", "Guideline 2"];
```

---

## 📈 Analytics & Tracking (Optional)

Untuk tracking pre-order, bisa ditambahkan:

```javascript
// Di handleSubmit
gtag.event("pre_order_submit", {
  product: product.name,
  product_id: product.id,
  quantity: formData.quantity,
  contact_method: contactMethod,
});
```

---

## 🐛 Troubleshooting

### Email tidak terkirim

**Solusi:**

- Check .env.local sudah benar
- Verify Gmail 2FA dan App Password
- Check ADMIN_EMAIL di .env.local
- Lihat error message di console

### Gambar tidak muncul

**Solusi:**

- Check file ada di `/public/images/products/`
- Verify nama file sesuai product ID
- Check fallback ke placeholder.png
- Buka DevTools Network tab

### Form submit tidak bekerja

**Solusi:**

- Check network tab di DevTools
- Verify API route `/api/pre-order.js` ada
- Check form validation messages
- Cek browser console untuk error

### Styling tidak konsisten

**Solusi:**

- Check Tailwind CSS sudah di-compile
- Verify custom color di tailwind config
- Clear browser cache
- Restart dev server

---

## 📝 Notes

✅ Semua komponen sudah implement:

- Clean Code practices
- Refactoring-friendly structure
- Image optimization
- Lazy loading dengan skeleton
- Error handling
- Responsive design
- Performance optimization

⚠️ TODO:

- Integrate WhatsApp API (pilih Twilio, Fonnte, atau official)
- Setup database untuk menyimpan pre-order (optional)
- Setup download PDF untuk spesifikasi
- Add analytics tracking
- Setup backup email service

---

## 🔗 Useful Links

- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Next.js Dynamic Imports](https://nextjs.org/docs/advanced-features/dynamic-import)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Twilio WhatsApp API](https://www.twilio.com/en-us/messaging/channels/whatsapp)
- [Gmail App Password](https://support.google.com/accounts/answer/185833)

---

**Last Updated**: January 22, 2026
**Status**: ✅ Production Ready (dengan setup email)
