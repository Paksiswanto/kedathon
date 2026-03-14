// src/app/admin/berita/[id]/edit/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import BeritaForm from '@/components/admin/BeritaForm'
import { prisma } from '@/lib/prisma'

interface Props { params: { id: string } }

export default async function EditBeritaPage({ params }: Props) {
  const berita = await prisma.berita.findUnique({ where: { id: params.id } })
  if (!berita) notFound()

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/berita" className="text-[#6B6860] hover:text-gold text-sm">← Kembali</Link>
        <span className="text-[#E0DDD6]">/</span>
        <span className="text-sm text-charcoal line-clamp-1">Edit: {berita.judul}</span>
      </div>

      <div className="mb-8">
        <h1 className="font-serif text-3xl font-medium text-charcoal">Edit Berita</h1>
        <p className="text-sm text-[#6B6860] mt-1">Perbarui konten lalu klik simpan</p>
      </div>

      <BeritaForm
        mode="edit"
        initialData={{
          id: berita.id,
          judul: berita.judul,
          konten: berita.konten,
          ringkasan: berita.ringkasan || '',
          thumbnail: berita.thumbnail || '',
          thumbnailId: berita.thumbnailId || '',
          kategori: berita.kategori,
          tags: berita.tags,
          status: berita.status,
          scheduledAt: berita.scheduledAt?.toISOString() || null,
        }}
      />
    </div>
  )
}
