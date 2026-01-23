# 🎯 CONTACT PAGE - QUICK REFERENCE CARD

## 📁 File Structure

```
esabumindo-backend/
├── src/email/
│   ├── email.service.ts           ← Email logic & templates
│   ├── email.controller.ts        ← API endpoint /api/email/contact
│   ├── email.module.ts            ← Module config
│   ├── dto/
│   │   └── send-contact-email.dto.ts  ← Validation schema
│   └── ... (existing files)
├── src/app.module.ts              ← Updated: EmailModule import
├── .env.example                   ← Environment template
└── ... (existing files)

esabumindo-frontend/
├── pages/contact.js               ← Updated contact page
├── styles/globals.css             ← Updated: new animations
├── .env.local.example             ← Environment template
└── ... (existing files)

ROOT/
├── CONTACT_PAGE_GUIDE.md          ← Full documentation
├── CONTACT_EMAIL_TESTING.md       ← Testing guide
├── CONTACT_QUICK_START.md         ← 5-minute setup
├── CONTACT_IMPLEMENTATION_SUMMARY.md
└── CONTACT_QUICK_REFERENCE.md     ← This file
```

---

## 🚀 Commands Cheat Sheet

### Backend

```bash
# Setup
cd esabumindo-backend
cp .env.example .env
npm install
npm run start:dev            # Development (watch mode)
npm run start:prod          # Production

# Database (jika diperlukan)
npm run prisma:generate
npm run prisma:migrate

# Linting & Formatting
npm run lint
npm run format

# Testing
npm test
npm run test:cov
```

### Frontend

```bash
# Setup
cd esabumindo-frontend
npm install
npm run dev                 # Development (port 3000)
npm run build              # Production build
npm start                  # Run production server

# Build
npm run build
npm run lint
```

---

## 🔧 Environment Variables

### Backend (.env)

```bash
# REQUIRED untuk contact form
EMAIL_USER=kikirizki0455@gmail.com
EMAIL_PASSWORD=fsnt wlzy iblw asvn

# Optional
PORT=3001
NODE_ENV=development
```

**Note:** Gmail App Password bukan password biasa!
Dapatkan dari: https://myaccount.google.com/apppasswords

### Frontend (.env.local)

```bash
# REQUIRED
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Production
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

---

## 📧 API Endpoint

### POST /api/email/contact

```javascript
// Request
{
  "name": "John Doe",           // Required, string
  "email": "john@example.com",  // Required, valid email
  "phone": "08123456789",       // Optional, string
  "message": "Your message..."  // Required, min 10 chars
}

// Success Response (200)
{
  "success": true,
  "message": "Pesan berhasil dikirim"
}

// Error Response (400/500)
{
  "success": false,
  "message": "Error description..."
}
```

---

## 🎨 Key Features Summary

### Frontend Features

| Feature          | Location             | Status |
| ---------------- | -------------------- | ------ |
| Skeleton Loading | contact.js           | ✅     |
| Next.js Image    | contact.js           | ✅     |
| Lazy Maps        | contact.js           | ✅     |
| Form Validation  | contact.js           | ✅     |
| FAQ Section      | contact.js (6 items) | ✅     |
| Error Handling   | contact.js           | ✅     |
| Loading Spinner  | contact.js           | ✅     |
| Responsive       | contact.js           | ✅     |

### Backend Features

| Feature            | Location                  | Status |
| ------------------ | ------------------------- | ------ |
| Email Service      | email.service.ts          | ✅     |
| Admin Email        | email.service.ts          | ✅     |
| Confirmation Email | email.service.ts          | ✅     |
| HTML Templates     | email.service.ts          | ✅     |
| API Endpoint       | email.controller.ts       | ✅     |
| Validation         | send-contact-email.dto.ts | ✅     |
| Error Handling     | email.controller.ts       | ✅     |

---

## 📧 Email Templates

### Admin Email

- **Subject:** 📧 Pesan Baru dari Kontak - [User Name]
- **To:** kikirizki0455@gmail.com
- **Template:** Professional with sender info & message
- **Header Color:** Purple gradient
- **Components:** Name, Email, Phone, Message

### Confirmation Email

- **Subject:** Terima Kasih! Pesan Anda Telah Diterima - Esa Bumindo
- **To:** User's email
- **Template:** Thank you with next steps
- **Header Color:** Green gradient
- **Components:** Success message, next steps, contact info

---

## ❓ FAQ Reference

| #   | Question                   | Category    |
| --- | -------------------------- | ----------- |
| 1   | Lem apa cocok untuk logam? | Produk      |
| 2   | Berapa lama pengeringan?   | Teknis      |
| 3   | Aman untuk kulit?          | Keselamatan |
| 4   | Harga untuk bulk order?    | Harga       |
| 5   | Apa garansi produk?        | Garansi     |
| 6   | Bisa di permukaan basah?   | Aplikasi    |

**To Add/Edit FAQ:** Edit `faqData` array di `pages/contact.js`

---

## 🎨 Styling Reference

### Colors

```css
--primary: #3b82f6; /* Blue */
--secondary: #764ba2; /* Purple */
--success: #4caf50; /* Green */
--error: #ef4444; /* Red */
--info-blue: #3b82f6;
--info-green: #16a34a;
--info-red: #dc2626;
--info-purple: #9333ea;
```

### Animations

```css
.animate-fade-in         /* Hero title */
/* Hero title */
.animate-fade-in-delay   /* Subtitle */
.animate-fade-in-up      /* Card content */
.animate-pulse; /* Skeleton loading */
```

### Spacing

```css
py-12 md:py-20 lg:py-24  /* Section padding */
px-4                     /* Horizontal padding */
gap-8 lg:gap-12          /* Grid gaps */
```

---

## 🔍 Testing Quick Commands

### cURL Test

```bash
curl -X POST http://localhost:3001/api/email/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "08123456789",
    "message": "This is a test message with sufficient length"
  }'
```

### Postman Test

1. Method: POST
2. URL: http://localhost:3001/api/email/contact
3. Header: Content-Type: application/json
4. Body (raw): JSON data from above

### Browser Console Test

```javascript
fetch("http://localhost:3001/api/email/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Test",
    email: "test@example.com",
    phone: "08123456789",
    message: "Test message from console",
  }),
})
  .then((r) => r.json())
  .then(console.log);
```

---

## 🐛 Debugging Tips

### Email Not Sending?

```bash
# 1. Check .env variables
echo $EMAIL_USER
echo $EMAIL_PASSWORD

# 2. Verify it's Gmail App Password (16 chars, no spaces)
# Get from: https://myaccount.google.com/apppasswords

# 3. Check backend logs
# Look for: "Email sending error" in console

# 4. Verify Gmail inbox
# Login to kikirizki0455@gmail.com
# Check Inbox & Spam folders
```

### Form Not Submitting?

```javascript
// Open browser console (F12)
// Check for errors
// Verify NEXT_PUBLIC_API_URL

// Test API directly
fetch("http://localhost:3001/api/email/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Test",
    email: "test@test.com",
    message: "test123",
  }),
})
  .then((r) => r.json())
  .then((d) => console.log(d.success ? "✅" : "❌", d));
```

### Image Not Loading?

```bash
# 1. Check file exists
ls -la public/asset/contact-hero.jpg

# 2. Check dimensions (min 1200x450px)
# 3. Check browser Network tab (F12)
# 4. Look for 404 errors
```

---

## 📋 Before Deploying

### Checklist

- [ ] All .env variables set correctly
- [ ] Backend running without errors
- [ ] Frontend running on port 3000
- [ ] Email sends successfully
- [ ] Form validation works
- [ ] FAQ accordion opens/closes
- [ ] Mobile responsive OK
- [ ] No console errors (F12)
- [ ] Test email in Gmail inbox
- [ ] Test confirmation email

### Production Checklist

- [ ] Update NEXT_PUBLIC_API_URL to production domain
- [ ] Update EMAIL_USER & EMAIL_PASSWORD if needed
- [ ] Set NODE_ENV=production
- [ ] Update contact info (phone, email, address)
- [ ] Update FAQ items for your products
- [ ] Configure CORS in backend
- [ ] Setup monitoring/logging
- [ ] Consider adding reCAPTCHA
- [ ] Setup rate limiting
- [ ] Test thoroughly on staging

---

## 📞 Useful Links

### Gmail App Password

https://myaccount.google.com/apppasswords

### NestJS Documentation

https://docs.nestjs.com

### Next.js Image Component

https://nextjs.org/docs/app/api-reference/components/image

### Tailwind CSS

https://tailwindcss.com

### Lucide React Icons

https://lucide.dev

---

## 🎯 Performance Targets

| Metric        | Target | Tool        |
| ------------- | ------ | ----------- |
| FCP           | < 1.5s | Lighthouse  |
| LCP           | < 2.5s | Lighthouse  |
| CLS           | < 0.1  | Lighthouse  |
| TTI           | < 3.5s | Lighthouse  |
| Form Response | < 2s   | Network tab |

---

## 🚀 Next Steps

### Immediate

1. Run backend: `npm run start:dev`
2. Run frontend: `npm run dev`
3. Test contact form at http://localhost:3000/contact
4. Verify email in Gmail

### This Week

1. Customize FAQ for your products
2. Update contact information
3. Add hero image to `/public/asset/contact-hero.jpg`
4. Customize email templates if needed

### This Month

1. Add reCAPTCHA (optional)
2. Implement rate limiting
3. Setup monitoring/logging
4. Test on production environment

---

## 📚 Documentation Files

| File                              | Purpose         | Read Time |
| --------------------------------- | --------------- | --------- |
| CONTACT_QUICK_START.md            | 5-minute setup  | 5 min     |
| CONTACT_QUICK_REFERENCE.md        | This file       | 10 min    |
| CONTACT_PAGE_GUIDE.md             | Complete guide  | 30 min    |
| CONTACT_EMAIL_TESTING.md          | Testing methods | 20 min    |
| CONTACT_IMPLEMENTATION_SUMMARY.md | Full summary    | 25 min    |

---

## 💾 File Sizes Reference

```
email.service.ts         ~3.5 KB
email.controller.ts      ~2 KB
email.module.ts          ~0.3 KB
send-contact-email.dto.ts ~1.2 KB
contact.js               ~12 KB
globals.css (additions)  ~2 KB
```

Total: ~21 KB of new code

---

## 🎉 You're All Set!

Everything is ready to use. Just:

1. ✅ Setup .env files
2. ✅ Run backend & frontend
3. ✅ Test the form
4. ✅ Customize as needed
5. ✅ Deploy with confidence!

---

**Last Updated:** January 23, 2026
**Status:** ✅ Complete & Ready
**Support:** Check documentation files for detailed help
