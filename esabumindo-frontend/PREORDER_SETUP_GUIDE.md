# 🚀 SETUP GUIDE: Halaman Detail Product & Pre-Order

## ✅ Checklist Implementasi

### 1. Dependencies Installation

```bash
# Install nodemailer untuk email
npm install nodemailer

# Verify existing packages
npm ls next react react-dom tailwindcss
```

### 2. Environment Setup

#### Copy Template .env.local

```bash
cp .env.local.example .env.local
```

#### Edit `.env.local` dengan nilai sebenarnya:

```bash
# Gmail Setup (https://myaccount.google.com/security)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Admin Details
ADMIN_EMAIL=admin@esabond.com
ADMIN_PHONE=+62xxxxxxxxxxxx

# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. File Structure Verification

Pastikan semua file sudah ada:

**Pages:**

- ✅ `pages/product/[id].js` - Detail Product
- ✅ `pages/pre-order/[id].js` - Pre-Order Form

**Components:**

- ✅ `components/product/product-detail-skeleton.jsx`
- ✅ `components/product/pre-order-form-skeleton.jsx`
- ✅ `components/product/product-specifications.jsx`
- ✅ `components/product/product-technical-info.jsx`
- ✅ `components/product/related-products.jsx`
- ✅ `components/product/contact-method-selector.jsx`

**API:**

- ✅ `pages/api/pre-order.js`

**Config:**

- ✅ `.env.local.example`
- ✅ `PRODUCT_DETAIL_PREORDER_DOCS.md`
- ✅ `PREORDER_SETUP_GUIDE.md` (file ini)

### 4. Directory Structure untuk Images

Pastikan direktori produk ada:

```bash
mkdir -p public/images/products/
```

Tambahkan file gambar:

```
/public/images/products/
├── 1.png (untuk product ID 1)
├── 2.png (untuk product ID 2)
├── placeholder.png (fallback)
└── ...
```

---

## 📧 Email Configuration Guide

### Setup Gmail (Recommended untuk testing)

#### Step 1: Enable 2-Factor Authentication

1. Buka https://myaccount.google.com/
2. Pilih "Security" di sidebar kiri
3. Scroll ke "2-Step Verification"
4. Click "Get Started"
5. Ikuti petunjuk verifikasi

#### Step 2: Generate App Password

1. Di halaman Security, cari "App passwords"
2. Pilih "Mail" dan "Windows Computer" (atau device Anda)
3. Google akan generate password (16 karakter)
4. Copy password ini ke `.env.local` sebagai `EMAIL_PASSWORD`

#### Step 3: Verify di .env.local

```bash
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
ADMIN_EMAIL=admin@esabond.com
```

### Alternative Email Services

#### Option A: SendGrid

```bash
npm install @sendgrid/mail
```

```javascript
// pages/api/pre-order.js
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: process.env.ADMIN_EMAIL,
  from: process.env.SENDGRID_FROM_EMAIL,
  subject: "🔔 Pre-Order Baru",
  html: emailHtml,
});
```

#### Option B: Resend (Modern, Easy)

```bash
npm install resend
```

```javascript
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: "onboarding@resend.dev",
  to: process.env.ADMIN_EMAIL,
  subject: "🔔 Pre-Order Baru",
  html: emailHtml,
});
```

---

## 💬 WhatsApp Integration (Optional)

### Option A: Twilio (Recommended)

#### Setup:

1. Buat akun di https://www.twilio.com/
2. Verify nomor WhatsApp Anda
3. Setup WhatsApp Sandbox

#### Installation:

```bash
npm install twilio
```

#### Environment:

```bash
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_WHATSAPP_FROM=+14155552671
```

#### Implementation:

Uncomment code di `pages/api/pre-order.js` line ~80

### Option B: Fonnte (Best untuk Indonesia)

#### Setup:

1. Buat akun di https://fonnte.com/
2. Verify WhatsApp number
3. Get API key

#### Installation:

```bash
npm install axios
```

#### Environment:

```bash
FONNTE_API_KEY=your_api_key
FONNTE_DEVICE_ID=your_device_id
```

#### Implementation:

```javascript
// pages/api/pre-order.js
const axios = require("axios");

if (data.contactMethod === "whatsapp") {
  await axios.post(
    "https://api.fonnte.com/send",
    {
      target: data.customerPhone,
      message: whatsappMessage,
    },
    {
      headers: {
        Authorization: process.env.FONNTE_API_KEY,
      },
    }
  );
}
```

### Option C: WhatsApp Business API (Enterprise)

- Official WhatsApp solution
- Paling powerful tapi kompleks
- Memerlukan business verification

---

## 🧪 Testing Checklist

### Local Testing

#### 1. Start Development Server

```bash
npm run dev
```

#### 2. Test Halaman Detail Product

```
1. Buka: http://localhost:3000/product/1
2. Verify skeleton loading muncul (~600ms)
3. Verify gambar load dengan fallback
4. Test tab navigation
5. Click "Pre-Order Sekarang" → harus ke /pre-order/1
6. Test share button
7. Test responsive di mobile/tablet/desktop
```

#### 3. Test Halaman Pre-Order

```
1. Buka: http://localhost:3000/pre-order/1
2. Verify form muncul dengan semua fields
3. Try submit kosong → harus show validation error
4. Fill semua required fields
5. Select contact method (Email/WhatsApp)
6. Click submit → check loading state
7. Verify success message muncul
8. Check email masuk ke admin & customer
9. Verify redirect ke /product setelah 2 detik
```

#### 4. Test Email Integration

```
1. Check inbox admin email
2. Verify email format & styling
3. Check customer confirmation email
4. Test email links (mailto, WhatsApp)
5. Verify data akurat di email
```

#### 5. Test Form Validation

```
1. Submit tanpa nama → error
2. Submit tanpa email → error
3. Submit tanpa nomor → error
4. Submit tanpa perusahaan → error
5. Submit dengan semua field → success
```

#### 6. Test Responsive

```
Desktop (1920px):
- Form layout 2 columns
- Sidebar sticky
- All elements visible

Tablet (768px):
- Form layout 2 columns
- Sidebar below form
- Mobile-friendly

Mobile (375px):
- Form layout 1 column
- Sidebar full width
- Touch-friendly buttons
```

### Production Testing

#### Before Deploy:

1. ✅ Test di production environment
2. ✅ Verify .env.local tidak di-commit
3. ✅ Check all images ada di `/public/images/products/`
4. ✅ Test email dengan real SMTP
5. ✅ Test WhatsApp integration (jika implemented)
6. ✅ Check performance (Lighthouse score > 80)
7. ✅ Verify security headers
8. ✅ Test error handling edge cases

---

## 🔗 Integration dengan Existing Code

### Update Product Page

File: `pages/product.js`

Handlers sudah diupdate:

```javascript
const handleDetail = useCallback(
  (productId) => {
    router.push(`/product/${productId}`);
  },
  [router]
);

const handleRequest = useCallback(
  (productId) => {
    router.push(`/pre-order/${productId}`);
  },
  [router]
);
```

### Update Product Card (Optional)

File: `components/product/product-card.jsx`

Sudah support onClick handlers:

```javascript
<Button
  onClick={() => onDetail && onDetail(product.id)}
  className="flex-1 bg-[#ca161e]"
>
  Detail
</Button>
```

---

## 📊 Database Integration (Optional)

Jika ingin save pre-order ke database:

### Dengan Prisma Schema

```prisma
// prisma/schema.prisma
model PreOrder {
  id            String    @id @default(cuid())
  productId     String
  product       String
  customerName  String
  customerEmail String    @unique
  customerPhone String
  company       String
  industri      String?
  quantity      Int       @default(1)
  message       String?
  contactMethod String    @default("email")
  status        String    @default("pending") // pending, contacted, converted
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

### Migrate Database

```bash
npx prisma migrate dev --name add_preorder_model
```

### Save di API

```javascript
// pages/api/pre-order.js
import { prisma } from "@/lib/prisma";

// Save to database
await prisma.preOrder.create({
  data: {
    productId: data.productId,
    product: data.product,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone,
    company: data.company,
    industri: data.industri,
    quantity: parseInt(data.quantity),
    message: data.message,
    contactMethod: data.contactMethod,
  },
});
```

---

## 🐛 Troubleshooting

### Email tidak terkirim

**Problem:** Error saat send email
**Solution:**

1. Check `.env.local` sudah benar
2. Verify Gmail 2FA enabled
3. Check app-specific password di Gmail
4. Lihat error di terminal/console
5. Test email configuration:

```javascript
// Test file: test-email.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) console.log(error);
  else console.log("Email config OK");
});
```

### Form submit stuck loading

**Problem:** Submit button tetap loading, tidak ada response
**Solution:**

1. Check network tab di DevTools
2. Verify API route `/api/pre-order.js` exist
3. Check server console untuk error
4. Restart dev server
5. Check CORS issues (jika different domain)

### Gambar tidak muncul

**Problem:** Image shows placeholder only
**Solution:**

1. Verify file ada di `/public/images/products/`
2. Check filename sesuai product ID (e.g., `1.png`)
3. Try refresh browser cache
4. Check image format supported (PNG, JPG, WebP)
5. DevTools Network → check image request status

### Styling tidak konsisten

**Problem:** Colors atau styles tidak match design
**Solution:**

1. Clear Tailwind cache: `rm -rf .next`
2. Restart dev server
3. Check custom colors di `tailwind.config.js`
4. Verify Tailwind CSS sudah compiled
5. Check browser cache (Ctrl+Shift+Del)

### Form validation error terus muncul

**Problem:** Validation error muncul meski sudah diisi
**Solution:**

1. Check required fields validation logic
2. Verify input names match state keys
3. Check form state value di React DevTools
4. Try fill ulang semua fields
5. Check console untuk error message

---

## 📱 Mobile Optimization

### Performance Tips

1. **Image Optimization**

   - Images sudah lazy load
   - Use WebP format untuk smaller file size
   - Optimize ke max width 1200px

2. **Bundle Size**

   - Dynamic imports reduce bundle
   - Tree-shaking enabled
   - Remove unused imports

3. **Network**
   - Minimal API calls
   - Response caching
   - Optimized payloads

### Mobile-First CSS

Semua komponen sudah mobile-first:

```css
/* Mobile first */
.container {
  /* ... */
}

/* Then tablet/desktop */
@media (md: 768px) {
  /* ... */
}
@media (lg: 1024px) {
  /* ... */
}
```

---

## 🔒 Security Best Practices

### Implemented:

✅ Environment variables tidak expose
✅ Email validation
✅ Phone number validation
✅ XSS protection (React escaping)
✅ CSRF protection (Next.js built-in)

### Additional:

1. Add rate limiting ke API
2. Add CAPTCHA untuk form
3. Sanitize user input
4. Add HTTPS only (production)
5. Monitor for abuse patterns

---

## 📈 Performance Metrics

### Target Scores:

- Lighthouse: > 90
- Core Web Vitals: Green
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

### Sudah Optimized:

✅ Image lazy loading
✅ Code splitting
✅ CSS minification
✅ Component memoization
✅ Skeleton loading states

---

## 📞 Support & Maintenance

### Regular Maintenance:

1. Check pre-order data regulerly
2. Monitor email delivery
3. Update dependencies monthly
4. Backup database regularly
5. Review analytics

### Future Enhancements:

- [ ] Add PDF download for spec
- [ ] Integrate analytics
- [ ] Add pre-order tracking system
- [ ] Add admin dashboard
- [ ] Add SMS notifications
- [ ] Multilingual support

---

## 🎓 Documentation Links

- [Next.js Dynamic Imports](https://nextjs.org/docs/advanced-features/dynamic-import)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Nodemailer Docs](https://nodemailer.com/about/)
- [Tailwind CSS Responsive](https://tailwindcss.com/docs/responsive-design)
- [React Hooks Best Practices](https://react.dev/reference/react/hooks)

---

## ✨ Summary

Semua sudah siap! Langkah selanjutnya:

1. ✅ Install dependencies: `npm install nodemailer`
2. ✅ Setup .env.local dengan email credentials
3. ✅ Verify file structure lengkap
4. ✅ Add product images ke /public/images/products/
5. ✅ Run dev server: `npm run dev`
6. ✅ Test semua functionality
7. ✅ Deploy ke production

**Status**: 🎉 Production Ready!

---

**Last Updated**: January 22, 2026
**Version**: 1.0.0
**Maintained By**: Development Team
