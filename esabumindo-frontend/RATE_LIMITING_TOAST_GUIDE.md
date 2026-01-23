# 🔒 Rate Limiting & Toast Notification - Pre-Order Security & UX

## 📋 Overview

Dokumentasi ini menjelaskan implementasi **Rate Limiting** dan **Toast Notification** untuk halaman Pre-Order guna mencegah spam dan memberikan pengalaman pengguna yang lebih baik.

---

## 🎯 Fitur Utama

### 1. **Rate Limiting (Pembatasan Pengiriman)**

- ✅ Membatasi pengiriman pre-order per email
- ✅ **3 pengiriman per 24 jam** per email address
- ✅ Validasi real-time saat user mengetik email
- ✅ Pesan warning jika sudah mencapai batas
- ✅ Data disimpan di localStorage browser (client-side)
- ✅ Duplikasi validasi di API (server-side)

### 2. **Toast Notifications**

- 📢 Notifikasi visual saat pengiriman dimulai
- ✅ Notifikasi success saat berhasil
- ❌ Notifikasi error jika ada masalah
- ⚠️ Warning notifications untuk peringatan
- 📤 Loading state dengan animasi spinner

---

## 🛠️ Komponen & File

### File Baru yang Dibuat:

#### 1. **`lib/rate-limiter.js`** - Utility untuk Rate Limiting

```javascript
// Fungsi utama:
-checkRateLimit(email) - // Cek apakah email bisa submit
  recordSubmission(email) - // Catat pengiriman di localStorage
  getRateLimitData() - // Ambil data rate limit
  resetRateLimit(email) - // Reset untuk admin
  clearAllRateLimits(); // Clear semua data
```

**Fitur:**

- Menyimpan data pengiriman di `localStorage` dengan key `preorder_submissions`
- Auto-cleanup submissions yang sudah expired (24 jam)
- Return object dengan info lengkap:
  ```javascript
  {
    allowed: boolean,
    remaining: number,      // Sisa pengiriman
    retryAfter: number,     // Menit untuk retry
    message: string         // Pesan user-friendly
  }
  ```

#### 2. **`components/ui/toast-context.jsx`** - Toast Context & Provider

```javascript
// Hook untuk digunakan di komponen:
const toast = useToast();

// Metode:
toast.success(message); // Notifikasi sukses (4 detik)
toast.error(message); // Notifikasi error (4 detik)
toast.warning(message); // Notifikasi warning (4 detik)
toast.info(message); // Notifikasi info (4 detik)
toast.loading(message); // Notifikasi loading (tidak auto-close)
toast.removeToast(id); // Close notifikasi manual
```

#### 3. **`components/ui/toast.jsx`** - Toast Component

- Menampilkan notifikasi di bagian top-right
- Animasi smooth slide-in dari atas
- Icon berbeda untuk setiap tipe notifikasi
- Auto-dismiss sesuai duration

---

## 📱 Cara Penggunaan

### Di Halaman Pre-Order

#### 1. **Import Dependencies**

```javascript
import { useToast } from "@/components/ui/toast-context";
import { checkRateLimit, recordSubmission } from "@/lib/rate-limiter";
```

#### 2. **Inisialisasi di Component**

```javascript
const toast = useToast();

// Atau untuk real-time validation saat input email:
const handleEmailChange = (e) => {
  const email = e.target.value;
  const rateLimitStatus = checkRateLimit(email);

  if (!rateLimitStatus.allowed) {
    setRateLimitWarning(rateLimitStatus);
  }
};
```

#### 3. **Saat Pengiriman Form**

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();

  // Check rate limit
  const rateLimitStatus = checkRateLimit(email);
  if (!rateLimitStatus.allowed) {
    toast.error(rateLimitStatus.message);
    return;
  }

  // Show loading
  const loadingToastId = toast.loading("📤 Mengirim pesanan...");

  try {
    const response = await fetch("/api/pre-order", {
      method: "POST",
      body: JSON.stringify({
        // ... form data
        rateLimitStatus, // Kirim ke API
      }),
    });

    // Remove loading toast
    toast.removeToast(loadingToastId);

    if (!response.ok) {
      if (response.status === 429) {
        toast.error(
          `⏱️ Sudah mencapai batas. Coba lagi dalam ${data.retryAfter} menit`
        );
      }
      return;
    }

    // Record submission
    recordSubmission(email);

    // Show success
    toast.success("✅ Pesanan berhasil dikirim!");
  } catch (error) {
    toast.removeToast(loadingToastId);
    toast.error(`❌ Error: ${error.message}`);
  }
};
```

---

## 🔐 Rate Limiting Logic

### Client-Side (localStorage)

```
1. User mengisi email → Check localStorage
2. Jika email sudah pernah submit dalam 24 jam:
   - Count pengiriman tersimpan
   - Jika sudah 3x → Blokir dengan pesan
3. Jika baru pertama kali → Allowed
4. Saat submit successful → Record timestamp di localStorage
```

### Server-Side (API Validation)

```
1. Terima request dengan rateLimitStatus dari client
2. Validasi ulang rate limit
3. Jika status.allowed === false → Return 429 error
4. Jika passed → Process & send email
```

**Alasan dual-validation:**

- Client-side: UX yang responsif & instant feedback
- Server-side: Security (prevent bypass dengan dev tools)

---

## 📊 Data Structure

### localStorage `preorder_submissions`

```javascript
{
  "email1@example.com": [
    1705948800000,  // Timestamp pengiriman 1
    1705952400000,  // Timestamp pengiriman 2
    1705956000000   // Timestamp pengiriman 3
  ],
  "email2@example.com": [
    1705870800000   // Timestamp pengiriman 1
  ]
}
```

---

## 🎨 Toast Notification Styling

### Tipe & Warna

| Tipe    | Color  | Icon      | Duration |
| ------- | ------ | --------- | -------- |
| Success | Green  | ✓         | 4s       |
| Error   | Red    | !         | 4s       |
| Warning | Yellow | ⚠️        | 4s       |
| Info    | Blue   | ℹ️        | 4s       |
| Loading | Blue   | ⚙️ (spin) | Manual   |

---

## ⚙️ Konfigurasi

### Rate Limiter Settings

Untuk mengubah batasan, edit `lib/rate-limiter.js`:

```javascript
// Ubah nilai ini:
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 jam
const MAX_SUBMISSIONS_PER_DAY = 3; // Max 3 submit
```

### Toast Duration

Untuk mengubah durasi notifikasi, edit `components/ui/toast-context.jsx`:

```javascript
addToast(message, type, (duration = 4000)); // Default 4 detik
```

---

## 🧪 Testing

### Test Rate Limiting

```javascript
// Di browser console:

// 1. Check status email
import { checkRateLimit } from "@/lib/rate-limiter";
checkRateLimit("test@example.com");

// 2. Record manual submission
import { recordSubmission } from "@/lib/rate-limiter";
recordSubmission("test@example.com");

// 3. Check localStorage
localStorage.getItem("preorder_submissions");

// 4. Clear semua data (admin)
import { clearAllRateLimits } from "@/lib/rate-limiter";
clearAllRateLimits();
```

### Test Toast Notifications

```javascript
// Di halaman mana saja
const { useToast } = require("@/components/ui/toast-context");

// Gunakan di component:
const toast = useToast();
toast.success("Test success!");
toast.error("Test error!");
toast.warning("Test warning!");
toast.info("Test info!");
toast.loading("Test loading...");
```

---

## 🔧 Troubleshooting

### Toast tidak muncul?

- ✅ Pastikan `ToastProvider` sudah wrap aplikasi di `_app.js`
- ✅ Pastikan `useToast()` dipanggil di dalam component yang di-wrap ToastProvider

### Rate Limit tidak bekerja?

- ✅ Clear localStorage: `localStorage.clear()`
- ✅ Check di DevTools → Application → localStorage → preorder_submissions
- ✅ Pastikan email diisi dengan benar (case-sensitive)

### Toast autohide tidak bekerja?

- ✅ Cek duration parameter (default 4000ms)
- ✅ Untuk loading, set duration ke 0 (manual close)

---

## 📈 Future Enhancements

### Potential Improvements:

1. **IP-based Rate Limiting** - Block by IP address juga
2. **Database Storage** - Move dari localStorage ke database
3. **Admin Dashboard** - View rate limit stats & manage blocks
4. **Email Verification** - Confirm email sebelum count
5. **Sliding Window** - Lebih sophisticated rate limiting algorithm
6. **Custom Limits** - Different limits per product type
7. **Captcha Integration** - Add reCAPTCHA untuk extra protection

---

## 📝 Summary

| Aspek                   | Detail                                          |
| ----------------------- | ----------------------------------------------- |
| **Rate Limit**          | 3 pengiriman / 24 jam per email                 |
| **Storage**             | localStorage (client) + API validation (server) |
| **Toast Notifications** | 5 tipe dengan auto-dismiss                      |
| **User Feedback**       | Real-time validation + loading state            |
| **Security**            | Dual-validation (client + server)               |

---

## 📞 Support

Jika ada pertanyaan atau masalah, silakan hubungi tim development atau check file dokumentasi lengkap di repository.
