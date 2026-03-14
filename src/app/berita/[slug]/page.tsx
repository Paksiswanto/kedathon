// src/app/berita/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/public/Navbar'
import { prisma } from '@/lib/prisma'
import { formatTanggal } from '@/lib/utils'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props) {
  const berita = await prisma.berita.findFirst({ where: { slug: params.slug, status: 'PUBLISHED' } })
  if (!berita) return { title: 'Berita Tidak Ditemukan' }
  return { title: `${berita.judul} | Kedhaton Property`, description: berita.ringkasan }
}

export default async function BeritaDetailPage({ params }: Props) {
  const berita = await prisma.berita.findFirst({
    where: { slug: params.slug, status: 'PUBLISHED' },
  })
  if (!berita) notFound()

  const related = await prisma.berita.findMany({
    where: { status: 'PUBLISHED', kategori: berita.kategori, id: { not: berita.id } },
    take: 3,
    orderBy: { publishedAt: 'desc' },
    select: { id: true, slug: true, judul: true, kategori: true, publishedAt: true, thumbnail: true },
  })

  return (
    <>
      <Navbar />
      <div className="pt-24 pb-20 max-w-3xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#6B6860] mb-8">
          <Link href="/" className="hover:text-gold">Beranda</Link>
          <span>/</span>
          <Link href="/berita" className="hover:text-gold">Berita</Link>
          <span>/</span>
          <span className="text-charcoal truncate max-w-xs">{berita.judul}</span>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-4">
          <span className="tag-gold">{berita.kategori}</span>
          {berita.publishedAt && (
            <span className="text-xs text-[#6B6860]">{formatTanggal(berita.publishedAt)}</span>
          )}
        </div>

        <h1 className="font-serif text-3xl md:text-4xl font-medium text-charcoal leading-tight mb-6">
          {berita.judul}
        </h1>

        {berita.ringkasan && (
          <p className="text-[#6B6860] text-lg leading-relaxed border-l-2 border-gold pl-4 mb-8 italic">
            {berita.ringkasan}
          </p>
        )}

        {berita.thumbnail && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-10">
            <Image src={berita.thumbnail} alt={berita.judul} fill className="object-cover" />
          </div>
        )}

        {/* Konten */}
        <div
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-charcoal prose-p:text-[#6B6860] prose-p:leading-relaxed prose-li:text-[#6B6860] prose-a:text-gold"
          dangerouslySetInnerHTML={{ __html: berita.konten }}
        />

        {/* Tags */}
        {berita.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-10 pt-8 border-t border-[#E0DDD6]">
            {berita.tags.map((tag) => (
              <span key={tag} className="text-sm text-[#6B6860] bg-[#F1EFE8] px-3 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h3 className="font-serif text-2xl font-medium text-charcoal mb-6">Berita Terkait</h3>
            <div className="flex flex-col gap-4">
              {related.map((r) => (
                <Link key={r.id} href={`/berita/${r.slug}`}
                  className="flex gap-4 items-start p-4 border border-[#E0DDD6] rounded-lg hover:border-gold transition-colors group">
                  {r.thumbnail && (
                    <div className="relative w-20 h-16 rounded overflow-hidden shrink-0">
                      <Image src={r.thumbnail} alt={r.judul} fill className="object-cover" />
                    </div>
                  )}
                  <div>
                    <span className="tag-gold text-xs">{r.kategori}</span>
                    <p className="font-serif text-base font-medium text-charcoal mt-1 group-hover:text-gold transition-colors leading-snug">
                      {r.judul}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10">
          <Link href="/berita" className="btn-outline inline-block">← Kembali ke Berita</Link>
        </div>
      </div>

      <footer className="border-t border-[#E0DDD6] text-center py-6 text-sm text-[#6B6860]">
        © 2026 <span className="font-serif text-gold">Kedhaton Property</span>
      </footer>
    </>
  )
}
