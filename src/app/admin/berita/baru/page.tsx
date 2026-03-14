// src/app/admin/berita/baru/page.tsx
import BeritaForm from '@/components/admin/BeritaForm'
import Link from 'next/link'

export default function BeritaBaruPage() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/berita" className="text-[#6B6860] hover:text-gold text-sm">← Kembali</Link>
        <span className="text-[#E0DDD6]">/</span>
        <span className="text-sm text-charcoal">Tulis Berita Baru</span>
      </div>

      <div className="mb-8">
        <h1 className="font-serif text-3xl font-medium text-charcoal">Tulis Berita Baru</h1>
        <p className="text-sm text-[#6B6860] mt-1">Isi semua field yang diperlukan lalu pilih status</p>
      </div>

      <BeritaForm mode="create" />
    </div>
  )
}
