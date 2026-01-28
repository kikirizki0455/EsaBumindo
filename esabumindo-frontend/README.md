# 🚀 Fullstack Web Application

**Next.js (Frontend) & NestJS (Backend)**

Project ini merupakan aplikasi **fullstack web** dengan arsitektur **monorepo**, di mana **frontend** dan **backend** berada dalam satu repository tetapi terpisah secara struktur dan tanggung jawab.

---

## 📁 Project Structure

```bash
project-root/
├── frontend/        # Frontend - Next.js
├── backend/         # Backend - NestJS
├── .gitignore       # Global gitignore
└── README.md
```

---

## 🖥 Frontend (Next.js)

Folder `frontend/` berisi aplikasi **Next.js** yang berfungsi sebagai **client-side** dan **server-side rendered UI**.

### 🔧 Tech Stack

- Next.js
- React
- TypeScript
- Axios (HTTP Client)

### 📌 Tanggung Jawab Frontend

- Menampilkan antarmuka pengguna (UI)
- Mengelola state dan interaksi user
- Mengirim & menerima data dari backend melalui REST API
- Routing dan page rendering

### 🌐 API Communication

Frontend menggunakan **Axios** untuk berkomunikasi dengan backend (NestJS).

Contoh:

```ts
axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
```

Konfigurasi Axios disarankan terpusat, misalnya:

```bash
frontend/src/lib/axios.ts
```

---

## ⚙️ Backend (NestJS)

Folder `backend/` berisi aplikasi **NestJS** yang bertindak sebagai **REST API server**.

### 🔧 Tech Stack

- NestJS
- TypeScript
- TypeORM
- PostgreSQL

### 📌 Tanggung Jawab Backend

- Menyediakan REST API
- Business logic dan validasi data
- Akses database menggunakan TypeORM
- Manajemen entity, service, dan controller

---

## 🗄 Database (PostgreSQL)

Aplikasi backend menggunakan **PostgreSQL** sebagai database utama dan **TypeORM** sebagai ORM.

### 🔹 Alasan Menggunakan PostgreSQL

- Stabil dan production-ready
- Mendukung relasi kompleks
- Performa baik untuk skala menengah hingga besar

### 🔹 Contoh Konfigurasi TypeORM

```ts
TypeOrmModule.forRoot({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  synchronize: true,
});
```

### 🔹 Contoh Entity

```ts
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
```

---

## 🔄 Alur Komunikasi Sistem

```text
User
 ↓
Next.js (Frontend)
 ↓ Axios
NestJS Controller
 ↓
Service
 ↓
TypeORM
 ↓
PostgreSQL Database
 ↓
Response → Frontend
```

---

## 🔐 Environment Variables

File `.env` **tidak di-commit** ke repository.

### Backend (`backend/.env.example`)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=app_db
```

### Frontend (`frontend/.env.example`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## ▶️ Running the Project

### Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend berjalan di:

```
http://localhost:3001
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend dapat diakses di:

```
http://localhost:3000
```

---

## 🧪 Development Notes

- Frontend dan backend dijalankan secara terpisah
- Backend harus berjalan terlebih dahulu
- Gunakan `.env.example` sebagai referensi konfigurasi

---

## 📌 Best Practice yang Digunakan

- Monorepo structure
- Multi `.gitignore` (global, frontend, backend)
- Separation of concerns
- Typed API dan database schema
- Environment-based configuration

---

## 🧑‍💻 Author

**Rizki Rahmat Hidayat**  
Fullstack Developer

---

## 📄 License

This project is intended for learning, development, and internal use.
