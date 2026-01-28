# ��� WhatsApp Integration Guide untuk Pre-Order System

## ��� Daftar Isi

1. [Overview](#overview)
2. [Prerequisite](#prerequisite)
3. [Setup Options](#setup-options)
4. [Implementation Steps](#implementation-steps)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## Overview

Sistem Pre-Order ESABUMINDO mendukung integrasi WhatsApp untuk notifikasi otomatis ke admin ketika ada:

- **Pesanan Langsung (Direct Order)**: Untuk pembelian dalam jumlah besar
- **Permintaan Sample**: Untuk testing sebelum pembelian

### Fitur WhatsApp Integration:

✅ Notifikasi real-time ke admin  
✅ Format pesan yang rapi dan terstruktur  
✅ Membedakan antara Direct Order dan Sample Request  
✅ Include informasi lengkap pelanggan dan pesanan  
✅ Fallback ke Email jika WhatsApp tidak tersedia

---

## Prerequisite

Sebelum setup WhatsApp integration, pastikan Anda memiliki:

1. **WhatsApp Business Account** (bisa via reseller/partner)
2. **API Service** untuk mengirim WhatsApp (pilih salah satu):

   - **Fonnte** (Recommended untuk Indonesia)
   - **Twilio**
   - **WhatsApp Business API** (Official tapi lebih kompleks)
   - **Baileys** (Desktop/Node.js only)

3. **Environment Variables** siap dikonfigurasi
4. **Nomor WhatsApp Admin**: `082146024328` (bisa diubah)

---

## Setup Options

### Option 1: Fonnte (⭐ Recommended untuk Indonesia)

**Keuntungan:**

- Mudah setup
- Support Indonesia
- Harga terjangkau (~Rp 50-100 ribu/bulan untuk starter)
- API sederhana
- No webhook complexity

**Langkah Setup:**

1. **Daftar di Fonnte**

   - Kunjungi: https://fonnte.com
   - Sign up dengan email
   - Verify account

2. **Dapatkan API Key**

   - Login ke dashboard
   - Pilih menu "Setting"
   - Copy API Key (format: `fonnte_xxxxxxxxxxxxxxxx`)

3. **Connect WhatsApp Number**

   - Di dashboard Fonnte, scan QR code dengan WhatsApp Business
   - Atau gunakan nomor biasa (akan dijadikan WhatsApp Business)

4. **Setup Environment Variable**

   ```bash
   # di .env file (frontend)
   NEXT_PUBLIC_WHATSAPP_API_KEY=db7nWkFx7pYvDzCZAgPb7z5MFpUU4rU14rrLxsSJWrxXtUWkdf
   NEXT_PUBLIC_WHATSAPP_API_URL=https://api.fonnte.com/send
   ```

5. **Update API Implementation**
   Ganti fungsi `sendWhatsAppMessage` di `/pages/api/pre-order.js`:

   ```javascript
   const sendWhatsAppMessage = async (phoneNumber, message) => {
     try {
       const response = await fetch("https://api.fonnte.com/send", {
         method: "POST",
         headers: {
           Authorization: process.env.NEXT_PUBLIC_WHATSAPP_API_KEY,
           "Content-Type": "application/json",
         },
         body: JSON.stringify({
           target: phoneNumber, // Format: 6282146024328 (tanpa +)
           message: message,
           delay: 1000, // delay 1 detik
           countryCode: "62", // Indonesia
         }),
       });

       const result = await response.json();

       if (result.status === true) {
         console.log("✅ WhatsApp via Fonnte sent successfully");
         return true;
       } else {
         console.log("❌ Fonnte error:", result.reason);
         return false;
       }
     } catch (error) {
       console.error("WhatsApp Fonnte error:", error.message);
       return false;
     }
   };
   ```

---

### Option 2: Twilio

**Keuntungan:**

- Resmi dan terpercaya
- Support global
- Dokumentasi lengkap

**Kelemahan:**

- Lebih mahal
- Setup lebih kompleks
- Perlu approval dari WhatsApp

**Langkah Setup:**

1. **Daftar di Twilio**

   - Kunjungi: https://www.twilio.com
   - Sign up dengan email

2. **Setup WhatsApp Sandbox**

   - Go to Messaging > Try it out > Send a WhatsApp message
   - Follow sandbox setup

3. **Dapatkan Credentials**

   - Account SID
   - Auth Token
   - WhatsApp Number

4. **Setup Environment Variable**

   ```bash
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_WHATSAPP_NUMBER=+14155238886
   ```

5. **Update API Implementation**

   ```javascript
   const sendWhatsAppMessage = async (phoneNumber, message) => {
     const twilio = require("twilio");
     const client = twilio(
       process.env.TWILIO_ACCOUNT_SID,
       process.env.TWILIO_AUTH_TOKEN
     );

     try {
       const result = await client.messages.create({
         body: message,
         from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
         to: `whatsapp:+${phoneNumber}`,
       });

       console.log("✅ WhatsApp via Twilio sent:", result.sid);
       return true;
     } catch (error) {
       console.error("❌ Twilio error:", error.message);
       return false;
     }
   };
   ```

---

### Option 3: WhatsApp Business API (Official)

**Keuntungan:**

- Official dari Meta
- Paling stabil
- Support lengkap

**Kelemahan:**

- Setup sangat kompleks
- Harga lebih mahal
- Perlu approval khusus

Untuk opsi ini, hubungi WhatsApp Business Developer atau gunakan partner resmi.

---

## Implementation Steps

### Step 1: Pilih Service Provider

Pilih salah satu dari opsi di atas. **Kami rekomendasikan Fonnte** karena:

- Paling mudah untuk Indonesia
- Harga terjangkau
- Setup cepat

### Step 2: Configure Environment Variables

Di file `.env` atau `.env.local` di root project:

```bash
# WhatsApp Configuration
WHATSAPP_API_PROVIDER=fonnte  # atau 'twilio'
NEXT_PUBLIC_WHATSAPP_API_KEY=fonnte_xxxxxxxxxxxxxxxx
NEXT_PUBLIC_WHATSAPP_API_URL=https://api.fonnte.com/send

# Admin WhatsApp Number (format Indonesia: 62xxxxxxxxxx)
WHATSAPP_ADMIN_NUMBER=6282146024328
```

### Step 3: Update Pre-Order API

Sesuaikan fungsi `sendWhatsAppMessage` di `/pages/api/pre-order.js` dengan provider pilihan Anda (lihat contoh di atas).

### Step 4: Test Integration

```bash
# Test dari command line (gunakan curl)
curl -X POST https://api.fonnte.com/send \
  -H "Authorization: fontte_xxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "target": "6282146024328",
    "message": "Test message dari ESABUMINDO"
  }'
```

### Step 5: Deploy Changes

```bash
cd esabumindo-frontend
git add .
git commit -m "feat: add WhatsApp integration for pre-order"
git push
```

---

## Testing

### Test Scenario 1: Direct Order via WhatsApp

1. Buka halaman Pre-Order produk
2. Isi form dengan data:

   - Nama: `John Doe`
   - Email: `john@example.com`
   - Phone: `0821xxx` (nomor test Anda)
   - Company: `PT Testing`
   - Order Type: `Pesanan Langsung`
   - Quantity: `500` kg
   - Metode Kontak: **WhatsApp**

3. Submit form
4. Periksa WhatsApp admin apakah notifikasi masuk

### Test Scenario 2: Sample Request via WhatsApp

1. Isi form dengan data sama seperti di atas
2. Ubah:

   - Order Type: `Pengambilan Sample`
   - Quantity: `50` kg (dalam range 1-100)
   - Metode Kontak: **WhatsApp**

3. Submit form
4. Periksa WhatsApp admin apakah notifikasi sample masuk

### Test Scenario 3: Fallback ke Email

Jika WhatsApp API tidak tersedia:

1. Pastikan `WHATSAPP_API_KEY` di-remove atau salah
2. Submit form dengan contact method WhatsApp
3. Sistem akan fallback ke email
4. Email tetap dikirim ke admin & customer

---

## Troubleshooting

### ❌ "WhatsApp message sent failed"

**Penyebab:**

- API Key salah
- Nomor WhatsApp tidak aktif
- Rate limit tercapai

**Solusi:**

1. Verify API Key di dashboard service provider
2. Pastikan nomor WhatsApp sudah terdaftar
3. Tunggu 1 jam sebelum retry (rate limit reset)

---

### ❌ "WhatsApp service not available"

**Penyebab:**

- Environment variable belum set
- Network error
- Service provider down

**Solusi:**

```bash
# Check environment variable
echo $NEXT_PUBLIC_WHATSAPP_API_KEY

# Restart Next.js
npm run dev

# Check logs
# Lihat console untuk error details
```

---

### ❌ Nomor Format Error

**Penyebab:**

- Format nomor salah (dengan +62, 0, atau typo)

**Solusi:**
Pastikan format nomor:

```javascript
// ✅ BENAR (untuk Fonnte)
"6282146024328"; // Tanpa +, tanpa 0

// ❌ SALAH
"+6282146024328"; // Ada +
"082146024328"; // Ada 0

// Format auto-fix di code:
phoneNumber.replace(/^(\+62|0)/, "62");
```

---

### ❌ Pesan tidak sampai ke customer

**Note:** WhatsApp integration untuk admin saja (notifikasi incoming).
Customer menerima notifikasi via **Email** (bukan WhatsApp).

Jika email tidak terkirim:

1. Check gmail configuration
2. Verify EMAIL_USER & EMAIL_PASSWORD di .env
3. Check spam folder

---

## Monitoring & Logs

### Check WhatsApp Notifications

**Di Fonnte Dashboard:**

1. Login ke https://fonnte.com
2. Go to "Message" tab
3. Lihat history pesan yang terkirim

**Di Console:**

```bash
# Terminal running next.js dev server
# Cari log: "WhatsApp message sent successfully"
# atau: "WhatsApp service not available"
```

---

## Security Best Practices

### ��� Environment Variables

```bash
# ❌ JANGAN: hardcode API key
const apiKey = "fontte_xxxxxxx";

# ✅ BENAR: gunakan environment variable
const apiKey = process.env.NEXT_PUBLIC_WHATSAPP_API_KEY;
```

### ��� Phone Number Sanitization

```javascript
// Cleanup phone number input
const cleanPhone = (phone) => {
  return phone
    .replace(/\D/g, "") // remove non-digits
    .replace(/^(0|\+62)/, "62"); // normalize to 62
};
```

### ��� Rate Limiting

Fonnte memiliki rate limit:

- **Free tier**: 1000 messages/bulan
- **Paid tier**: unlimited

Monitor usage di dashboard untuk menghindari overage charges.

---

## Advanced Configuration

### Multiple Admin Numbers

Jika ingin notifikasi ke beberapa nomor:

```javascript
// Update sendWhatsAppMessage
const adminNumbers = [
  "6282146024328", // Admin 1
  "6281234567890", // Admin 2
];

for (const number of adminNumbers) {
  await sendWhatsAppMessage(number, message);
}
```

### Custom Message Templates

Ubah format pesan di `formatPreOrderDataForWhatsApp`:

```javascript
const customMessage = `
��� *NEW ORDER ALERT*
========================
Product: ${data.product}
Quantity: ${data.quantityKg} kg
Customer: ${data.customerName}
========================
Check email for details.
`;
```

### Webhook Listener (Advanced)

Untuk two-way communication:

```javascript
// pages/api/whatsapp/webhook.js
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { phone, message } = req.body;
    console.log(`Message from ${phone}: ${message}`);
    // Process customer reply
    res.status(200).json({ status: "received" });
  }
}
```

---

## Summary Checklist

- [ ] Pilih WhatsApp Service Provider (Fonnte recommended)
- [ ] Daftar & dapatkan API Key
- [ ] Connect WhatsApp Business Number
- [ ] Setup Environment Variables (.env)
- [ ] Update `sendWhatsAppMessage` function
- [ ] Test dengan scenario 1, 2, dan 3
- [ ] Monitor logs & Fonnte dashboard
- [ ] Deploy ke production
- [ ] Set reminder untuk monitor usage/billing

---

## Support & Documentation

| Service               | Link                          | Support               |
| --------------------- | ----------------------------- | --------------------- |
| **Fonnte**            | https://fonnte.com            | docs.fonnte.com       |
| **Twilio**            | https://twilio.com            | twilio.com/docs       |
| **WhatsApp Business** | https://business.facebook.com | facebook.com/whatsapp |

---

## Next Steps

1. **Setup Fonnte Account** → 15 menit
2. **Configure Environment** → 5 menit
3. **Update API Code** → 10 menit
4. **Test Integration** → 10 menit
5. **Deploy** → 5 menit

**Total Setup Time: ~45 menit**

---

**Last Updated:** January 23, 2026
**Version:** 1.0
**Status:** Ready for Implementation ✅
