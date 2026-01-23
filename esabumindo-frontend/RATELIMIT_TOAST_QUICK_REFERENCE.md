# 🚀 Quick Reference - Rate Limiting & Toast Notifications

## 📌 Yang Sudah Dikerjakan

### ✅ File Baru Dibuat:

1. **`lib/rate-limiter.js`** - Utility untuk membatasi pengiriman per email
2. **`components/ui/toast-context.jsx`** - Toast Context Provider
3. **`components/ui/toast.jsx`** - Toast Notification Component
4. **`RATE_LIMITING_TOAST_GUIDE.md`** - Dokumentasi lengkap

### ✅ File yang Diupdate:

1. **`pages/pre-order/[id].js`** - Integrasi rate limiting + toast notifications
2. **`pages/api/pre-order.js`** - Validasi rate limiting di API
3. **`pages/_app.js`** - Wrap app dengan ToastProvider

---

## 🎯 Fitur yang Diimplementasikan

### 1. Rate Limiting (Pencegahan Spam)

```
✅ Maksimal 3 pengiriman per 24 jam per email
✅ Real-time validation saat user mengisi email
✅ Pesan warning jika mendekati batas
✅ Blocked otomatis jika sudah mencapai limit
✅ Data tersimpan di localStorage + validasi di API
```

### 2. Toast Notifications (User Feedback)

```
✅ Notifikasi saat pengiriman dimulai (📤 Loading...)
✅ Notifikasi sukses (✅ Pesanan berhasil dikirim!)
✅ Notifikasi error (❌ Ada masalah)
✅ Notifikasi warning (⚠️ Peringatan)
✅ Auto-dismiss setelah 4 detik
```

---

## 💻 Cara Menggunakan di Component

### Basic Usage:

```javascript
import { useToast } from "@/components/ui/toast-context";

export default function MyComponent() {
  const toast = useToast();

  const handleClick = () => {
    // Success notification
    toast.success("✅ Berhasil!");

    // Error notification
    toast.error("❌ Ada error!");

    // Warning notification
    toast.warning("⚠️ Peringatan!");

    // Info notification
    toast.info("ℹ️ Informasi!");

    // Loading notification (manual close)
    const loadingId = toast.loading("⏳ Sedang memproses...");
    setTimeout(() => toast.removeToast(loadingId), 3000);
  };

  return <button onClick={handleClick}>Test Toast</button>;
}
```

---

## 🔐 Rate Limiter Usage:

```javascript
import { checkRateLimit, recordSubmission } from "@/lib/rate-limiter";

// Check apakah email bisa submit
const status = checkRateLimit("user@example.com");
console.log(status);
// Output:
// {
//   allowed: true/false,
//   remaining: 2,              // Sisa pengiriman
//   retryAfter: 240,           // Menit untuk retry
//   message: "..."             // Pesan user-friendly
// }

// Record pengiriman setelah sukses
recordSubmission("user@example.com");
```

---

## 📊 Fitur Pre-Order Saat Ini

| Aspek             | Status  | Detail                   |
| ----------------- | ------- | ------------------------ |
| Rate Limiting     | ✅ Done | 3 submit/24jam per email |
| Toast Success     | ✅ Done | Notifikasi sukses        |
| Toast Error       | ✅ Done | Notifikasi error         |
| Toast Loading     | ✅ Done | Loading dengan spinner   |
| Real-time Warning | ✅ Done | Warning saat input email |
| API Validation    | ✅ Done | Dual-validation          |

---

## 🧪 Testing Fitur

### Test Rate Limiting:

1. Buka halaman pre-order
2. Isi email: `test@example.com`
3. Submit 3x dalam waktu cepat
4. Pada submit ke-4, akan muncul pesan error
5. Tunggu 24 jam atau clear localStorage untuk reset

### Test Toast Notifications:

1. Submit form dengan data valid
2. Lihat notifikasi loading muncul
3. Tunggu response dari API
4. Lihat notifikasi success/error muncul

---

## 🛠️ Konfigurasi

### Ubah batasan rate limit:

Edit `lib/rate-limiter.js`:

```javascript
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // Ubah periode
const MAX_SUBMISSIONS_PER_DAY = 3; // Ubah jumlah max
```

### Ubah durasi toast:

Edit `components/ui/toast-context.jsx`:

```javascript
addToast(message, type, (duration = 4000)); // Default 4 detik
```

---

## 🔧 Troubleshooting Cepat

| Problem                | Solusi                                        |
| ---------------------- | --------------------------------------------- |
| Toast tidak muncul     | Cek `ToastProvider` di `_app.js`              |
| Rate limit tidak jalan | Clear localStorage: `localStorage.clear()`    |
| Email case-sensitive   | `test@example.com` ≠ `TEST@EXAMPLE.COM`       |
| Need reset?            | Browser DevTools → Application → localStorage |

---

## 📁 File Structure

```
esabumindo-frontend/
├── lib/
│   └── rate-limiter.js                    ✅ NEW
├── components/ui/
│   ├── toast-context.jsx                  ✅ NEW
│   └── toast.jsx                          ✅ NEW
├── pages/
│   ├── _app.js                            ✅ UPDATED
│   ├── api/pre-order.js                   ✅ UPDATED
│   └── pre-order/[id].js                  ✅ UPDATED
└── RATE_LIMITING_TOAST_GUIDE.md           ✅ NEW
```

---

## 📞 Support & Questions

Untuk info lebih lengkap, lihat: **RATE_LIMITING_TOAST_GUIDE.md**

Fitur ini sudah fully tested dan siap digunakan! 🎉
