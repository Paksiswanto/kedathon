<<<<<<< Updated upstream
hnaya untuk portofolio
=======
# 🏠 Kedhaton Property — Website + Dashboard Admin

Website portofolio & berita properti dengan dashboard admin untuk mengelola berita secara dinamis.

## Tech Stack
- **Frontend + Backend**: Next.js 14 (App Router)
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma
- **Auth**: JWT + bcrypt (username & password)
- **Image Upload**: Cloudinary
- **Styling**: Tailwind CSS
- **Deploy**: Vercel

---

## 🚀 Cara Setup (Step by Step)

### 1. Download & Install dependencies
```bash
# Install semua package
npm install
```

### 2. Setup Supabase (Database)
1. Buka [supabase.com](https://supabase.com) → buat akun gratis
2. Klik **New Project** → isi nama project: `kedhaton-property`
3. Setelah project dibuat, buka **Settings → Database**
4. Copy **Connection string (URI)** — format: `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres`

### 3. Setup Cloudinary (Image Upload)
1. Buka [cloudinary.com](https://cloudinary.com) → buat akun gratis
2. Di dashboard, catat: **Cloud Name**, **API Key**, **API Secret**

### 4. Setup Environment Variables
```bash
# Salin file contoh
cp .env.example .env.local

# Edit .env.local dan isi nilainya:
DATABASE_URL="postgresql://postgres:PASSWORD@db.REF.supabase.co:5432/postgres"
JWT_SECRET="buat-string-random-panjang-minimal-32-karakter"
CLOUDINARY_CLOUD_NAME="cloud-name-kamu"
CLOUDINARY_API_KEY="api-key-kamu"
CLOUDINARY_API_SECRET="api-secret-kamu"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="cloud-name-kamu"
```

### 5. Setup Database
```bash
# Push schema ke Supabase
npm run db:push

# Buat data awal (admin user + sample berita)
npm run db:seed
```

### 6. Jalankan di local
```bash
npm run dev
# Buka: http://localhost:3000
```

### 7. Login Admin
- URL: `http://localhost:3000/admin/login`
- Username: `admin`
- Password: `admin123`

> ⚠️ **Segera ganti password** setelah login pertama di Supabase → Table Editor → tabel `Admin`

---

## 📁 Struktur Project

```
src/
├── app/
│   ├── page.tsx                    ← Homepage (publik)
│   ├── berita/
│   │   ├── page.tsx                ← List berita (publik)
│   │   └── [slug]/page.tsx         ← Detail berita (publik)
│   ├── admin/
│   │   ├── login/page.tsx          ← Login admin
│   │   ├── berita/
│   │   │   ├── page.tsx            ← Kelola berita
│   │   │   ├── baru/page.tsx       ← Tulis berita baru
│   │   │   └── [id]/edit/page.tsx  ← Edit berita
│   └── api/
│       ├── auth/login/route.ts     ← POST /api/auth/login
│       ├── auth/logout/route.ts    ← POST /api/auth/logout
│       ├── berita/route.ts         ← GET + POST /api/berita
│       ├── berita/[id]/route.ts    ← GET + PUT + DELETE /api/berita/:id
│       └── upload/route.ts         ← POST /api/upload
├── components/
│   ├── public/
│   │   ├── Navbar.tsx
│   │   └── BeritaCard.tsx
│   └── admin/
│       └── BeritaForm.tsx
└── lib/
    ├── prisma.ts      ← Database client
    ├── auth.ts        ← JWT helpers
    ├── cloudinary.ts  ← Image upload
    └── utils.ts       ← Helpers & constants
```

---

## 🌐 Deploy ke Vercel

1. Push project ke GitHub
2. Buka [vercel.com](https://vercel.com) → **Import Project** → pilih repo
3. Di bagian **Environment Variables**, tambahkan semua variabel dari `.env.local`
4. Klik **Deploy**
5. Setelah deploy, jalankan seed sekali:
   ```bash
   # Di terminal local (pointing ke production DB)
   npm run db:seed
   ```

---

## 🔧 Fitur Admin

| Fitur | Keterangan |
|-------|-----------|
| Login/Logout | Username & password, session 7 hari |
| Tulis Berita | Judul, konten HTML, ringkasan |
| Upload Thumbnail | Otomatis resize ke 1200×630 via Cloudinary |
| Kategori | Pilih dari daftar kategori |
| Tags | Tambah tag custom + saran otomatis |
| Status | Draft / Tayang / Jadwalkan |
| Jadwal Publish | Pilih tanggal & jam publish otomatis |
| Edit Berita | Update semua field |
| Hapus Berita | Otomatis hapus gambar di Cloudinary |

## 📡 API Endpoints

| Method | URL | Auth | Keterangan |
|--------|-----|------|-----------|
| POST | `/api/auth/login` | ✗ | Login admin |
| POST | `/api/auth/logout` | ✓ | Logout |
| GET | `/api/berita` | ✗ | List berita published |
| GET | `/api/berita?status=DRAFT` | ✓ | List semua (admin) |
| POST | `/api/berita` | ✓ | Buat berita baru |
| GET | `/api/berita/:id` | ✗ | Detail berita |
| PUT | `/api/berita/:id` | ✓ | Update berita |
| DELETE | `/api/berita/:id` | ✓ | Hapus berita |
| POST | `/api/upload` | ✓ | Upload gambar |
>>>>>>> Stashed changes
