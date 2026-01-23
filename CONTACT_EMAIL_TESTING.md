# Testing Contact Email API

## 1. Using cURL

### Test Send Contact Email

```bash
curl -X POST http://localhost:3001/api/email/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "08123456789",
    "message": "Saya ingin menanyakan tentang produk lem untuk aplikasi logam. Apakah produk Anda tersertifikasi internasional?"
  }'
```

### Expected Response (Success)

```json
{
  "success": true,
  "message": "Pesan berhasil dikirim"
}
```

### Expected Response (Error)

```json
{
  "success": false,
  "message": "Gagal mengirim pesan: [error details]"
}
```

---

## 2. Using JavaScript/Fetch

```javascript
// Test dari browser console atau file JS

const sendEmail = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/email/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Jane Smith",
        email: "jane.smith@company.com",
        phone: "08987654321",
        message:
          "Kami tertarik untuk bulk order produk lem. Berapa harga untuk pembelian 500 unit?",
      }),
    });

    const result = await response.json();
    console.log("Response:", result);
  } catch (error) {
    console.error("Error:", error);
  }
};

sendEmail();
```

---

## 3. Using Postman

### Setup Postman Collection

1. **Create New Request**

   - Method: `POST`
   - URL: `http://localhost:3001/api/email/contact`

2. **Headers Tab**

   ```
   Content-Type: application/json
   ```

3. **Body Tab** (raw JSON)

   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "phone": "08123456789",
     "message": "This is a test message from Postman"
   }
   ```

4. **Click Send**

---

## 4. Using Thunder Client (VS Code Extension)

1. Install Thunder Client extension
2. Create New Request
3. Set Method to POST
4. URL: `http://localhost:3001/api/email/contact`
5. Go to Body tab
6. Select `JSON`
7. Paste:

```json
{
  "name": "Thunder Client User",
  "email": "thunderclient@test.com",
  "phone": "08111111111",
  "message": "Testing dari Thunder Client extension"
}
```

8. Click Send

---

## 5. Test Cases

### Test Case 1: Valid Request

**Description**: Send valid contact message
**Expected**: Email terkirim, response success true

```bash
curl -X POST http://localhost:3001/api/email/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Budi Santoso",
    "email": "budi@company.com",
    "phone": "08123456789",
    "message": "Saya butuh lem untuk aplikasi plastik. Rekomendasi produk apa?"
  }'
```

### Test Case 2: Missing Required Field

**Description**: Send without name field
**Expected**: Should be validated at frontend, but backend should handle gracefully

```bash
curl -X POST http://localhost:3001/api/email/contact \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "phone": "08123456789",
    "message": "Test message"
  }'
```

### Test Case 3: Invalid Email Format

**Description**: Send with invalid email
**Expected**: Frontend validation should prevent, but test error handling

```bash
curl -X POST http://localhost:3001/api/email/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "invalid-email",
    "phone": "08123456789",
    "message": "Test message"
  }'
```

### Test Case 4: Long Message

**Description**: Send dengan pesan panjang
**Expected**: Email tetap terkirim dengan baik

```bash
curl -X POST http://localhost:3001/api/email/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Long Message User",
    "email": "longmsg@test.com",
    "phone": "08123456789",
    "message": "Kami adalah perusahaan manufaktur yang membutuhkan solusi adhesive berkualitas tinggi untuk produksi massal. Produk kami digunakan dalam industri otomotif, elektronik, dan konstruksi. Kami mencari supplier yang dapat memberikan: 1) Kualitas konsisten, 2) Harga kompetitif untuk volume besar, 3) Garansi produk, 4) Sertifikasi internasional. Apakah Esa Bumindo dapat memenuhi kebutuhan kami? Mohon hubungi untuk diskusi lebih lanjut."
  }'
```

### Test Case 5: Without Phone (Optional Field)

**Description**: Send tanpa phone number
**Expected**: Email tetap terkirim dengan info "Tidak diberikan"

```bash
curl -X POST http://localhost:3001/api/email/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "No Phone User",
    "email": "nophone@test.com",
    "message": "Pesan tanpa nomor telepon"
  }'
```

---

## 6. Verify Email Receipt

### Check Gmail Inbox

1. Login ke kikirizki0455@gmail.com
2. Check Inbox untuk email baru
3. Verify subject: `📧 Pesan Baru dari Kontak - [User Name]`
4. Check formatting: Header, info pengirim, pesan, footer

### Check Sent Emails (Confirmation)

1. Login ke Gmail
2. Check "Sent" folder
3. Verify email ke user dengan subject: `Terima Kasih! Pesan Anda Telah Diterima - Esa Bumindo`
4. Check HTML formatting dan content

---

## 7. Debugging

### Enable Logging

Tambahkan di `email.service.ts`:

```typescript
async sendContactMessage(data: {...}): Promise<void> {
  console.log('📤 Sending email...', data);

  // Email to admin
  console.log('📧 Admin email sent to:', process.env.EMAIL_USER);

  // Confirmation email
  console.log('✅ Confirmation email sent to:', data.email);
}
```

### Check Environment Variables

```bash
# Di terminal backend
echo $EMAIL_USER
echo $EMAIL_PASSWORD
```

### Test Connection

```bash
# Test jika Gmail credentials valid
telnet smtp.gmail.com 587
```

---

## 8. Common Errors & Solutions

| Error                       | Cause                                  | Solution                                                      |
| --------------------------- | -------------------------------------- | ------------------------------------------------------------- |
| `Invalid login credentials` | Password salah atau bukan App Password | Use Gmail App Password dari myaccount.google.com/apppasswords |
| `ECONNREFUSED`              | Backend tidak running                  | Jalankan `npm run start:dev` di folder backend                |
| `Network timeout`           | Gmail server tidak respond             | Check internet connection, retry                              |
| `CORS error`                | Frontend & backend domain berbeda      | Configure CORS di backend                                     |

---

## 9. Email Templates Preview

Saat email terkirim, format yang akan diterima:

### Admin Email Format:

```
Header: ESA BUMINDO | Solusi Adhesive Berkualitas Tinggi
Status: 📧 Pesan Baru dari Kontak

Sender Information:
- Nama: [user name]
- Email: [clickable email link]
- Telepon: [clickable tel link]

Message:
[User's full message]

Footer: Contact info + Year
```

### Confirmation Email Format:

```
Header: ESA BUMINDO | Solusi Adhesive Berkualitas Tinggi (Green)
Status: ✓ Pesan Anda Telah Berhasil Diterima!

Next Steps:
- Tim kami akan memeriksa pesan
- Akan menghubungi via email/phone
- Biasanya dalam 1-2 jam

Contact Options:
- Phone: [number]
- Email: [address]
- Hours: [operating hours]

Footer: Company info + Year
```

---

## 10. Monitoring

### Log File

```bash
# Tail logs
tail -f backend.log

# Check recent errors
grep ERROR backend.log | tail -20
```

### Database (Future)

Jika nanti store messages di database:

```sql
SELECT * FROM contact_messages
WHERE created_at >= NOW() - INTERVAL 1 DAY
ORDER BY created_at DESC;
```

---

**Last Updated**: January 23, 2026
**Test Environment**: Local Development (http://localhost:3001)
