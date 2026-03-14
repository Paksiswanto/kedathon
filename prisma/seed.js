// prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hash,
      name: 'Kedhaton Property',
    },
  })
  
  console.log('✅ Admin created:', admin.username)

  // Seed sample berita
  const beritaSample = [
    {
      judul: 'Harga Properti di Surabaya Naik 12% Awal 2026',
      slug: 'harga-properti-surabaya-naik-2026',
      konten: '<p>Permintaan tinggi dari generasi milenial mendorong kenaikan harga properti residensial di kawasan Surabaya Barat dan Timur.</p><p>Data terbaru menunjukkan rata-rata harga rumah tapak di Surabaya mencapai Rp 850 juta untuk tipe 36/72.</p>',
      ringkasan: 'Permintaan tinggi dari generasi milenial mendorong kenaikan harga properti residensial.',
      kategori: 'Harga & Pasar',
      tags: ['surabaya', 'harga', 'properti'],
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
    {
      judul: 'Tips KPR: 5 Hal yang Wajib Disiapkan Sebelum Mengajukan',
      slug: 'tips-kpr-persiapan-pengajuan',
      konten: '<p>Mengajukan KPR bisa terasa rumit jika tidak dipersiapkan dengan baik. Berikut 5 hal yang perlu kamu siapkan.</p><ol><li>Pastikan slip gaji 3 bulan terakhir sudah ada</li><li>Rekening koran minimal 3 bulan</li><li>DP minimal 10-20% dari harga rumah</li><li>Skor BI Checking harus bersih</li><li>Pilih tenor yang sesuai kemampuan cicilan</li></ol>',
      ringkasan: '5 hal wajib yang perlu disiapkan sebelum mengajukan KPR agar prosesnya lancar.',
      kategori: 'Tips',
      tags: ['kpr', 'tips', 'beli rumah'],
      status: 'PUBLISHED',
      publishedAt: new Date(Date.now() - 86400000),
    },
  ]

  for (const b of beritaSample) {
    await prisma.berita.upsert({
      where: { slug: b.slug },
      update: {},
      create: b,
    })
  }

  console.log('✅ Sample berita created')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
