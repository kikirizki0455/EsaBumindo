# Fitur Chat Sales via WhatsApp — Panduan Test & Deploy

Dokumen ini untuk tim IT Esa Bumindo. Isi: apa yang ditambahkan, cara mengujinya di komputer sendiri, dan cara menaikkannya ke produksi (backend di VPS Hostinger, frontend di Vercel).

> **Baca dulu sebelum merencanakan rilis.** Deploy otomatis dari GitHub ke Vercel **gagal setiap kali sejak 10 Juni 2026**, termasuk preview PR fitur ini. Situs live tetap ter-update karena di-deploy lewat jalur lain. Penyebabnya hampir pasti pengaturan **Root Directory** proyek Vercel yang kosong, dan perbaikannya satu pengaturan. Sampai itu diperbaiki, merge PR ini tidak otomatis menayangkan apa pun. Rinciannya di bagian 4b.

---

## 1. Ringkasan fitur

Tombol hijau melayang **"Chat Sales"** di pojok kanan bawah semua halaman publik. Saat pengunjung klik:

```
Pengunjung klik tombol
   │
   ▼
Frontend  POST {API}/wa/click  { visitorId, page }
   │
   ▼
Backend memilih 1 sales aktif (metode rotasi + pengunjung kembali), mencatat klik
   │
   ▼
Frontend membuka tab baru  https://wa.me/62xxxx?text=<pesan pembuka>
```

Jalur jika ada masalah:

| Keadaan | Yang terjadi |
|---|---|
| API menjawab tetapi menolak (belum ada sales aktif dan nomor fallback kosong, terlalu banyak klik, error server) | Pengunjung diarahkan ke halaman **Kontak** |
| Browser tidak bisa membaca jawaban API (jaringan putus, diblokir CORS, timeout 8 detik) | Tab diarahkan ke `GET {API}/wa/redirect`, yang memilih sales di server lalu 302 ke `wa.me` |
| JavaScript tidak jalan | Tombol adalah link biasa ke halaman **Kontak** |

Sales dikelola dari admin panel, menu **Sales WhatsApp** (`/admin/sales-wa`): tambah / edit / nonaktifkan sales, bobot, metode pembagian, "pengunjung kembali", pesan pembuka, nomor fallback, statistik, dan log klik.

### Metode pembagian (rotasi)

| Metode | Cara kerja | Cocok untuk |
|---|---|---|
| **Round Robin** (default) | Bergiliran. Sales yang paling lama tidak mendapat lead baru, dapat duluan. Sales baru langsung masuk antrean dan mendapat satu giliran berikutnya. | Semua sales dianggap setara |
| Weighted Round Robin | Porsi mengikuti bobot. Bobot 2 = dapat 2× lebih banyak dari bobot 1. | Ada sales senior/junior, part-time |
| Least Assigned | Ke sales dengan lead baru paling sedikit sejak hitungan dimulai (paling lama 30 hari ke belakang). | Ingin jumlah lead selalu disamakan |
| Random berbobot | Acak, peluang sebanding bobot. | Jika pola giliran tidak boleh bisa ditebak |

Dua aturan yang berlaku di semua metode:

- **Pengunjung kembali.** Pengunjung yang sama (dikenali lewat id anonim di browser) yang klik lagi dalam N hari diarahkan ke sales yang sama, supaya satu prospek tidak ditangani dua sales. Default 7 hari, 0 = nonaktif. Klik ulang ini **dicatat tetapi tidak memakai giliran** dan tidak dihitung sebagai lead baru.
- **Hitungan dimulai ulang saat susunan berubah.** Untuk Weighted dan Least Assigned, hitungan lead dimulai dari nol setiap kali sales ditambah, diaktifkan lagi, bobot diubah, atau metode diganti. Tanpa ini sales yang baru masuk akan menerima semua klik sampai jumlahnya menyamai yang lain.

Rekomendasi awal: **Round Robin + pengunjung kembali 7 hari** (sudah default).

### Yang disimpan

Tabel baru di PostgreSQL: `SalesAgent` (daftar sales), `WaClick` (log klik: sales, halaman, id pengunjung anonim, user-agent, hash IP), `WaSetting` (pengaturan). Tidak ada tabel lama yang diubah. Hash IP memakai HMAC dengan `JWT_SECRET`, jadi tidak bisa ditebak balik tanpa rahasia server.

---

## 2. Endpoint API

Prefix backend: `/api`.

| Method | Path | Akses | Fungsi |
|---|---|---|---|
| POST | `/api/wa/click` | Publik (5/detik, 60/menit per IP) | Pilih sales, catat klik, balas `{ waUrl, sticky }` |
| GET | `/api/wa/redirect?v=&page=` | Publik | Sama, tapi langsung 302 ke `wa.me`. Crawler dan uptime monitor yang dikenal dijawab 204 tanpa memutar giliran |
| GET | `/api/wa/sales` | Login, role ADMIN / DIREKTUR | Daftar sales |
| POST | `/api/wa/sales` | ADMIN / DIREKTUR | Tambah sales `{ name, phone, weight?, isActive? }` |
| PATCH | `/api/wa/sales/:id` | ADMIN / DIREKTUR | Ubah sales |
| DELETE | `/api/wa/sales/:id` | ADMIN / DIREKTUR | Hapus sales. **Log kliknya ikut terhapus.** Untuk menghentikan sementara, pakai `isActive: false` |
| GET | `/api/wa/settings` | ADMIN / DIREKTUR | Pengaturan rotasi |
| PATCH | `/api/wa/settings` | ADMIN / DIREKTUR | Ubah `{ strategy, stickyDays, greeting, fallbackPhone }` |
| GET | `/api/wa/stats?days=30` | ADMIN / DIREKTUR | Statistik per sales: lead baru, klik kembali, porsi aktual dan ideal |
| GET | `/api/wa/clicks?limit=50` | ADMIN / DIREKTUR | Log klik terakhir |
| POST | `/api/wa/sales/reset-counters` | DIREKTUR | Mulai ulang giliran dan hitungan lead. Log klik tidak dihapus |

Nomor boleh ditulis `08xx`, `+62xx`, `62xx`, dengan spasi atau strip. Disimpan sebagai `62xxxxxxxxxx` dan harus nomor Indonesia (62 diikuti 8 sampai 13 digit). Nomor yang sama tidak bisa didaftarkan dua kali (409).

Endpoint admin menerima token login lewat header `Authorization: Bearer <token>` atau cookie `access_token`.

Tidak ada variabel environment baru. Tidak ada dependency npm baru.

---

## 3. Cara test di komputer sendiri

### 3.1 Prasyarat

- Node.js 20 atau lebih baru, npm.
- PostgreSQL 16. Paling mudah pakai Docker:
  ```bash
  docker run -d --name esabumindo-pg \
    -e POSTGRES_USER=esabumindo -e POSTGRES_PASSWORD=esabumindo -e POSTGRES_DB=esabumindo_db \
    -p 5432:5432 postgres:16-alpine
  ```

### 3.2 Backend

Buat file `esabumindo-backend/.env` baru dengan isi berikut. Jangan menyalin `.env.example` untuk test lokal.

```env
DATABASE_URL="postgresql://esabumindo:esabumindo@localhost:5432/esabumindo_db"
PORT=3001
JWT_SECRET=isi-string-acak-panjang
FRONTEND_URL=http://localhost:3000
EMAIL_USER=dummy@example.com
EMAIL_PASSWORD=dummy
EMAIL_ADMIN=dummy@example.com
```

Email boleh dummy. Saat start muncul error `Invalid login` dari Gmail. Itu tidak menghentikan server, hanya form kontak yang tidak terkirim.

```bash
cd esabumindo-backend
npm ci
npx prisma migrate deploy      # membuat semua tabel, termasuk SalesAgent, WaClick, WaSetting
npx prisma generate
npm run start:dev
```

Pastikan di log ada baris `Mapped {/api/wa/click, POST} route`.

Buat user admin lokal untuk login. Jalankan dari folder `esabumindo-backend`. Perintah ini satu baris dan sama di bash, zsh, PowerShell, maupun cmd:

```bash
node -e "const b=require('bcrypt');const{PrismaClient}=require('@prisma/client');const p=new PrismaClient();b.hash('Admin12345',10).then(h=>p.user.create({data:{email:'admin@local.test',password:h,name:'Admin',role:'ADMIN'}})).then(u=>{console.log('user dibuat:',u.email,u.role);process.exit(0)})"
```

Login dengan `admin@local.test` dan password `Admin12345`. Untuk user dengan role lain (dipakai di checklist nomor 13), ganti email dan `role`, misalnya `KARYAWAN`.

### 3.3 Frontend

```bash
cd esabumindo-frontend
printf 'NEXT_PUBLIC_API_URL=http://localhost:3001/api\nNEXT_PUBLIC_BASE_URL=http://localhost:3000\n' > .env.local
npm ci
npm run dev
```

Buka http://localhost:3000. Tombol hijau "Chat Sales" harus ada di kanan bawah.

### 3.4 Unit test backend

```bash
cd esabumindo-backend
npx jest src/whatsapp-sales
```

30 test harus lulus: normalisasi dan validasi nomor, pembentukan URL, deteksi crawler, keempat metode, pengunjung kembali, nomor fallback, dan retry saat klik bersamaan.

`npm test` penuh menunjukkan 1 test bawaan gagal (`app.controller.spec.ts` mengharapkan "Hello World!" sedangkan service membalas teks lain). Itu sudah ada sebelum fitur ini.

### 3.5 Checklist QA manual

Login di http://localhost:3000/login, lalu buka menu **Sales WhatsApp** dari sidebar.

Dua hal yang perlu diketahui sebelum mulai:

- **Mensimulasikan pengunjung baru.** Pengunjung dikenali lewat `wa_visitor_id` di Local Storage. Semua jendela incognito Chrome yang terbuka bersamaan berbagi Local Storage yang sama, jadi dianggap satu pengunjung. Untuk menjadi pengunjung baru: tutup semua jendela incognito lalu buka lagi, atau jalankan `localStorage.removeItem('wa_visitor_id')` di Console sebelum klik.
- **Halaman admin melempar ke login atau dashboard padahal sudah login.** `next.config.mjs` memberi `Cache-Control: public, max-age=3600` ke semua route, termasuk redirect dari middleware. Akibatnya browser mengingat redirect `/admin/...` ke `/login` selama satu jam jika URL itu pernah dibuka saat belum login. Ini sudah ada sebelum fitur ini. Buka halaman lewat menu sidebar, atau tambahkan `?x=1` di URL.

| # | Langkah | Hasil yang diharapkan |
|---|---|---|
| 1 | Tambah 3 sales (nama bebas, nomor `08…` berbeda) | Muncul di tabel, nomor tampil `+62…`, status Aktif |
| 2 | Tambah sales dengan nomor yang sudah ada | Ditolak, pesan "sudah terdaftar atas nama …" |
| 3 | Tambah sales dengan nomor `12345678` | Ditolak, pesan nomor harus nomor Indonesia yang valid |
| 4 | Klik tombol di website sebagai 3 pengunjung baru berturut-turut | Tab WhatsApp terbuka ke sales 1, 2, 3 bergiliran. "Klik Terakhir" bertambah 3 baris berlabel *rotasi* |
| 5 | Tanpa menghapus `wa_visitor_id`, klik tombol lagi | Ke sales yang sama dengan klik terakhir. Log berlabel *kembali*. Kolom "Lead baru" sales itu tidak bertambah, muncul "+1 kembali" |
| 6 | Klik sebagai pengunjung baru lagi | Mendapat sales berikutnya dalam urutan. Klik ulang di langkah 5 tidak memakai giliran |
| 7 | Nonaktifkan 1 sales (klik badge status), klik sebagai 3 pengunjung baru | Sales nonaktif tidak pernah dapat |
| 8 | Ubah metode ke *Weighted Round Robin*, set bobot satu sales = 2, Simpan, klik sebagai 8 pengunjung baru | Sales bobot 2 dapat sekitar 2× lebih banyak. Kolom "Porsi" mendekati "ideal" |
| 9 | Set "pengunjung kembali" = 0, Simpan, klik 2× tanpa menghapus `wa_visitor_id` | Bisa dapat sales berbeda |
| 10 | Nonaktifkan semua sales, isi "Nomor fallback", klik tombol | WhatsApp terbuka ke nomor fallback |
| 11 | Nonaktifkan semua sales, kosongkan fallback, klik tombol | Pengunjung diarahkan ke halaman Kontak. Tidak ada tab kosong atau halaman error |
| 12 | `curl -i http://localhost:3001/api/wa/sales` (tanpa login) | `401 Unauthorized` |
| 13 | Buat user role KARYAWAN (lihat 3.2), login, buka menu Sales WhatsApp | Data tidak tampil, muncul pesan gagal memuat. Endpoint menjawab `403` |
| 14 | Buka `http://localhost:3001/api/wa/redirect` langsung di browser | Diarahkan ke `wa.me` |

### 3.6 Uji rotasi cepat dengan curl

```bash
# 6 klik dari 6 "pengunjung" berbeda → nomor di waUrl harus bergiliran
for i in 1 2 3 4 5 6; do
  curl -s -X POST http://localhost:3001/api/wa/click \
    -H 'Content-Type: application/json' \
    -d "{\"visitorId\":\"uji-$i\",\"page\":\"/product\"}" | grep -o 'wa.me/[0-9]*'
  sleep 0.3
done

# klik ulang pengunjung uji-1 → nomor yang sama, "sticky":true
curl -s -X POST http://localhost:3001/api/wa/click \
  -H 'Content-Type: application/json' -d '{"visitorId":"uji-1"}'
```

`429 Too Many Requests` berarti kena batas 5 klik per detik per IP. Beri jeda.

---

## 4. Deploy ke produksi

Arsitektur produksi: **frontend di Vercel**, **backend di VPS Hostinger** (upload zip). Domain berbeda.

> **Urutan wajib: backend dulu, baru frontend.**
> Jika frontend tayang lebih dulu, tombol memanggil endpoint yang belum ada di backend lama, dan pengunjung dilempar ke halaman Kontak.

Langkah 4a di bawah sudah dijalankan utuh sebagai latihan di kontainer Linux (Node 22) terhadap database yang berisi skema `master`, lalu ditimpa versi ini.

### 4a. Backend → VPS Hostinger

**Langkah 0 — audit (sekali saja, catat hasilnya).** Cara backend dijalankan di VPS tidak terdokumentasi di repo. SSH ke VPS lalu cek:

| Cek | Perintah | Catat |
|---|---|---|
| Process manager | `pm2 list` / `docker ps` / `systemctl list-units --type=service \| grep -i -E "node\|nest\|esa"` | Nama proses, cara restart |
| Folder dan file yang dijalankan | `pm2 describe <nama>` (lihat `script path` dan `exec cwd`) | Path folder, file entry |
| Versi Node | `node -v` | Harus ≥ 20 |
| `.env` produksi | `cat <folder>/.env` | `DATABASE_URL` dan `JWT_SECRET` terisi? `FRONTEND_URL` = domain website produksi? |
| Riwayat migrasi | `cd <folder> && npx prisma migrate status` | Lihat catatan di bawah |
| Reverse proxy | `nginx -T 2>/dev/null \| grep -E "server_name\|proxy_pass\|X-Forwarded-For"` | Domain API, apakah `X-Forwarded-For` diteruskan |

Hasil `prisma migrate status` yang aman untuk lanjut: "Database schema is up to date", atau daftar migrasi yang belum diterapkan dan hanya berisi migrasi baru. Jika muncul error bahwa database tidak kosong tetapi tabel `_prisma_migrations` tidak ada (kode `P3005`), database produksi dulu dibuat tanpa Prisma Migrate. **Berhenti di situ.** Migrasi lama harus ditandai sudah diterapkan dulu dengan `npx prisma migrate resolve --applied <nama_migrasi>` untuk setiap migrasi lama, baru `migrate deploy` boleh dijalankan.

**Langkah 1 — siapkan zip dari `master` setelah PR di-merge.** Jangan zip folder kerja (ada `node_modules`, `.env`, `dist`). Pakai git:

```bash
git checkout master && git pull
git archive -o esabumindo-backend.zip HEAD:esabumindo-backend
```

Upload zip ke VPS (hPanel File Manager / SFTP / `scp`).

**Langkah 2 — di VPS.** Ganti `backend` dengan nama folder hasil audit dan `20261113` dengan tanggal hari itu.

```bash
# 1. backup database
pg_dump "<DATABASE_URL dari .env>" > ~/backup-sebelum-wa-20261113.sql

# 2. backup folder lama, pasang yang baru
mv backend backend.bak-20261113
mkdir backend && cd backend
unzip ~/esabumindo-backend.zip

# 3. pakai .env produksi yang lama
cp ../backend.bak-20261113/.env .env

# 4. WAJIB: kembalikan file upload (gambar artikel yang di-upload lewat admin)
cp -rn ../backend.bak-20261113/public/uploads/. public/uploads/

# 5. install, migrasi, build
npm ci --include=dev
npx prisma migrate status        # harus menampilkan 2 migrasi baru yang belum diterapkan
npx prisma migrate deploy        # menambah 3 tabel, 1 enum, 1 index; tabel lama tidak diubah
npx prisma generate
npm run build

# 6. jalankan ulang
pm2 restart <nama>
pm2 logs <nama> --lines 200 --nostream | grep "wa/click"   # harus ada: Mapped {/api/wa/click, POST}
```

Catatan untuk langkah di atas:

- **Langkah 4 jangan dilewati.** Zip dari git hanya berisi gambar yang sudah di-commit. Gambar yang di-upload lewat admin setelah commit terakhir hanya ada di folder lama.
- **`--include=dev` diperlukan.** Jika shell VPS menyetel `NODE_ENV=production`, `npm ci` biasa tidak memasang `@nestjs/cli` dan `npm run build` gagal.
- **File entry hasil build adalah `dist/src/main.js`.** Script `start:prod` di `package.json` menunjuk `dist/main`, yang tidak ada. Jika `pm2 describe` menunjukkan proses lama menjalankan file lain, sesuaikan. Untuk mendaftarkan dari awal: `pm2 start dist/src/main.js --name esabumindo-backend && pm2 save`.

**Langkah 3 — verifikasi tanpa mengubah data.**

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://<domain-api>/api/wa/sales
```

`401` berarti backend baru sudah hidup (route ada, minta login). `404` berarti backend lama masih jalan. Jangan memakai `POST /wa/click` untuk verifikasi di produksi: setiap panggilan tercatat sebagai klik sungguhan dan memakai giliran sales.

**Rollback backend.**

```bash
pm2 stop <nama>
mv backend backend.gagal
mv backend.bak-20261113 backend
pm2 restart <nama>
```

Tabel baru boleh dibiarkan, kode lama tidak menyentuhnya. Jika tetap ingin dihapus, perintah berikut **menghapus daftar sales dan seluruh log klik secara permanen**. Jalankan `pg_dump` dulu.

```sql
DROP TABLE "WaClick"; DROP TABLE "SalesAgent"; DROP TABLE "WaSetting";
DROP TYPE "WaRotationStrategy";
DELETE FROM "_prisma_migrations"
 WHERE migration_name LIKE '%add_whatsapp_sales_rotation'
    OR migration_name LIKE '%wa_rotation_epoch_unique_phone';
```

**Catatan operasional.**

- Batas `/api/wa/click`: 5 klik per detik dan 60 per menit **per IP**. Pengunjung dari satu kantor besar bisa berbagi satu IP. Naikkan `CLICK_THROTTLE` di `src/whatsapp-sales/whatsapp-sales.controller.ts` jika terjadi.
- `main.ts` sudah menyetel `trust proxy`. Reverse proxy harus mengirim `X-Forwarded-For`. Kalau tidak, semua pengunjung terlihat sebagai satu IP dan batas di atas salah sasaran.
- `JWT_SECRET` dipakai juga sebagai kunci hash IP. Mengganti `JWT_SECRET` membuat hash IP lama tidak bisa dibandingkan dengan yang baru. Tidak berpengaruh ke rotasi.

### 4b. Frontend → Vercel

**Kondisi saat dokumen ini ditulis: deploy otomatis dari GitHub gagal, sedangkan situs live tetap ter-update lewat jalur lain.**

Riwayat deployment yang tercatat di GitHub:

| Tanggal | Commit | Proyek Vercel | Root Directory proyek | Hasil |
|---|---|---|---|---|
| 7 Juni 2026 | `7fd2bc7` | `esa-bumindo` | `esabumindo-frontend` | Gagal |
| 7 Juni 2026 | `b6cc468`, `038aefb` | `esa-bumindo` | `esabumindo-frontend` | Sukses |
| 10 Juni 2026 | `9e0d5f2` | `esabumindo-frontend` | kosong | Gagal |
| 16 September 2026 | `ab21301` (HEAD `master`) | `esabumindo-frontend` | kosong | Gagal |
| 12 November 2026 | PR fitur ini | `esabumindo-frontend` | kosong | Gagal |

Kegagalan 7 Juni adalah hal lain: commit itu masih memakai Next.js 16.0.5, bot Vercel langsung membuka PR #1 dan #2 untuk menaikkannya, dan setelah di-merge deploy sukses.

Yang sudah dipastikan:

- **Proyek Vercel berganti antara 7 dan 10 Juni.** Proyek lama `esa-bumindo` punya Root Directory `esabumindo-frontend`. Proyek sekarang bernama `esabumindo-frontend` dan Root Directory-nya kosong. Sumbernya metadata di komentar bot Vercel pada PR #1, #2, dan #3.
- **Root repo tidak punya `package.json`.** Dengan Root Directory kosong, Vercel mem-build dari root repo. Builder Vercel (`vercel build`) yang dijalankan di root repo gagal dengan pesan ini:
  ```
  Error: [NEXT_NO_VERSION] No Next.js version detected. Make sure your package.json has "next"
  in either "dependencies" or "devDependencies". Also check your Root Directory setting matches
  the directory of your package.json file.
  ```
- **Kodenya tidak bermasalah.** Builder yang sama, dijalankan dari dalam folder `esabumindo-frontend`, selesai tanpa error untuk `master` maupun branch fitur ini.
- **Situs live tidak ketinggalan.** `esabumindo.com` dilayani proyek `esabumindo-frontend` dan sudah memuat halaman dari commit 16 September. Jadi ada deploy yang berhasil lewat jalur selain push GitHub. Kemungkinan besar lewat Vercel CLI yang dijalankan dari dalam folder `esabumindo-frontend`, karena dari sana `package.json` ditemukan.

Yang belum dipastikan: log deployment di Vercel belum dibaca, karena butuh akses ke proyeknya. Untuk memastikan:

```bash
npx vercel inspect dpl_7Rne1yWhD2iNNpR5vHtgscWeZUiP --logs
```

Jika baris error-nya `NEXT_NO_VERSION`, diagnosis di atas benar.

**Perbaikan.**

1. Vercel → proyek `esabumindo-frontend` → Settings → Build and Deployment → **Root Directory** → isi `esabumindo-frontend` → Save.
2. Deployments → pilih deployment `master` terakhir → **Redeploy**. Pastikan sukses.
3. Setelah Root Directory diisi, perintah `vercel` dari komputer harus dijalankan dari **root repo**, bukan dari dalam folder `esabumindo-frontend`.

**Menayangkan fitur ini.**

1. Pastikan Environment Variable `NEXT_PUBLIC_API_URL = https://<domain-api>/api` terisi untuk **Production**. Isi juga untuk **Preview** jika preview ingin dipakai menguji. Nilai ini ditanam saat build, jadi mengubahnya butuh redeploy.
2. Jika Root Directory sudah diperbaiki: merge PR ke `master`, Vercel deploy ke produksi otomatis.
3. Jika belum diperbaiki: merge PR, lalu deploy dengan jalur manual yang dipakai sekarang, dari `master` terbaru.
4. Rollback: Vercel → Deployments → pilih deployment sebelumnya → **Promote to Production**.

Dua hal tentang Preview Deployment, yang baru tersedia setelah Root Directory diperbaiki:

- Preview memanggil backend yang ditunjuk `NEXT_PUBLIC_API_URL`. Jika itu backend produksi, klik saat menguji tercatat di data produksi dan memakai giliran sales.
- Dari domain `*.vercel.app`, `fetch` ke backend ditolak CORS karena backend hanya mengizinkan `FRONTEND_URL`. Tombol otomatis memakai jalur `redirect`, jadi tetap bisa diuji. Di domain produksi jalur utama yang dipakai.

### 4c. Setelah keduanya naik

1. Login admin → menu **Sales WhatsApp**.
2. **Tambah Sales** untuk setiap sales (nama + nomor WA). Nomor sales tidak ditulis di repo ini karena repo publik. Minta daftarnya ke PIC.
3. Biarkan metode *Round Robin* dan pengunjung kembali 7 hari. Sesuaikan pesan pembuka. Isi **nomor fallback** (nomor CS umum) supaya tombol tetap membuka WhatsApp jika semua sales dinonaktifkan.
4. Dari HP, buka website, klik tombol → WhatsApp terbuka ke salah satu sales. Cek di admin, log klik bertambah.
5. Setelah seminggu, lihat kolom "Porsi (aktual / ideal)". Jika timpang jauh, cek apakah ada sales yang sering dinonaktifkan.

---

## 5. File yang berubah

Backend `esabumindo-backend/`

- `prisma/schema.prisma`
- `prisma/migrations/20261030094144_add_whatsapp_sales_rotation/` — 3 tabel, 1 enum
- `prisma/migrations/20261112170000_wa_rotation_epoch_unique_phone/` — 1 kolom, 1 index unik
- `src/whatsapp-sales/` — module, controller, service, DTO, unit test
- `src/app.module.ts` — mendaftarkan module
- `src/auth/jwt.strategy.ts` — JWT juga diterima lewat header `Authorization: Bearer` (sebelumnya cookie saja). Klien axios admin mengirim Bearer, dan cookie `SameSite=Lax` tidak ikut terkirim pada permintaan lintas domain dari Vercel ke VPS, jadi tanpa ini endpoint ber-guard tidak bisa dipanggil dari admin panel

Frontend `esabumindo-frontend/`

- `components/whatsapp-float-button.jsx` — tombol
- `pages/layouts/main-layout.js` — memasang tombol di semua halaman publik
- `pages/admin/sales-wa/index.jsx` — halaman admin
- `components/layout/admin-layout.jsx` — item menu
- `locales/id/common.json`, `locales/en/common.json` — label tombol

---

## 6. Catatan di luar scope fitur ini

Ditemukan saat mengerjakan fitur dan **tidak diubah** di branch ini supaya PR tetap fokus.

| Hal | Dampak ke rilis fitur ini |
|---|---|
| Deploy otomatis GitHub ke Vercel gagal sejak 10 Juni 2026, Root Directory proyek kosong | Merge PR tidak otomatis tayang dan preview PR tidak tersedia sampai diperbaiki (bagian 4b) |
| `next.config.mjs` memberi cache publik 1 jam ke semua route, termasuk redirect middleware dan halaman admin | Halaman admin bisa terlempar ke login padahal sudah login (bagian 3.5) |
| Script `start:prod` menunjuk `dist/main`, padahal hasil build `dist/src/main.js` | Perlu diperhatikan saat menjalankan backend (bagian 4a) |
| 1 unit test bawaan gagal (`app.controller.spec.ts`) | `npm test` tidak hijau penuh walau test fitur ini lulus |
| `lint` proyek tidak bersih (backend ±700 error, frontend ±50 error sebelum fitur ini) | File fitur ini lolos lint; file lain tidak disentuh |

Temuan keamanan di luar scope disampaikan terpisah ke tim, tidak ditulis di repo publik.
