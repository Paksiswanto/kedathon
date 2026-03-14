// src/components/public/BeritaCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { formatTanggalSingkat } from '@/lib/utils'

interface BeritaCardProps {
  id: string
  slug: string
  judul: string
  ringkasan?: string | null
  thumbnail?: string | null
  kategori: string
  tags: string[]
  publishedAt?: string | null
}

export default function BeritaCard({ slug, judul, ringkasan, thumbnail, kategori, tags, publishedAt }: BeritaCardProps) {
  return (
    <Link href={`/berita/${slug}`} className="card group block">
      {thumbnail && (
        <div className="relative w-full aspect-video rounded overflow-hidden mb-4">
          <Image src={thumbnail} alt={judul} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      <div className="flex items-center gap-2 mb-2">
        <span className="tag-gold">{kategori}</span>
        {publishedAt && (
          <span className="text-xs text-[#6B6860]">{formatTanggalSingkat(publishedAt)}</span>
        )}
      </div>
      <h3 className="font-serif text-lg font-medium text-charcoal leading-snug mb-2 group-hover:text-gold transition-colors">
        {judul}
      </h3>
      {ringkasan && (
        <p className="text-sm text-[#6B6860] leading-relaxed line-clamp-2">{ringkasan}</p>
      )}
      {tags.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mt-3">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs text-[#6B6860] bg-[#F1EFE8] px-2 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}
