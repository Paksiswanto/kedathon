// src/app/berita/page.tsx
'use client'
import { useState, useEffect, useCallback } from 'react'
import Navbar from '@/components/public/Navbar'
import BeritaCard from '@/components/public/BeritaCard'
import { KATEGORI_OPTIONS } from '@/lib/utils'

interface Berita {
  id: string; slug: string; judul: string; ringkasan?: string | null
  thumbnail?: string | null; kategori: string; tags: string[]; publishedAt?: string | null
}

export default function BeritaPage() {
  const [berita, setBerita] = useState<Berita[]>([])
  const [loading, setLoading] = useState(true)
  const [kategori, setKategori] = useState('semua')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchBerita = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '9' })
      if (kategori !== 'semua') params.set('kategori', kategori)
      const res = await fetch(`/api/berita?${params}`)
      const data = await res.json()
      setBerita(data.berita || [])
      setTotalPages(data.pagination?.totalPages || 1)
    } catch {
      setBerita([])
    } finally {
      setLoading(false)
    }
  }, [page, kategori])

  useEffect(() => { fetchBerita() }, [fetchBerita])

  const handleKategori = (k: string) => { setKategori(k); setPage(1) }

  return (
    <>
      <Navbar />
      <div className="pt-24 pb-20 max-w-5xl mx-auto px-6">
        <div className="mb-10">
          <p className="section-label">Informasi Terkini</p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-charcoal">Berita Properti</h1>
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {['semua', ...KATEGORI_OPTIONS].map((k) => (
            <button key={k} onClick={() => handleKategori(k)}
              className={`px-4 py-1.5 rounded text-sm border transition-colors ${
                kategori === k
                  ? 'bg-charcoal text-white border-charcoal'
                  : 'border-[#E0DDD6] text-[#6B6860] hover:border-charcoal hover:text-charcoal'
              }`}>
              {k === 'semua' ? 'Semua' : k}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-[#E0DDD6] rounded-lg p-5 animate-pulse">
                <div className="aspect-video bg-[#E8E5DF] rounded mb-4" />
                <div className="h-3 bg-[#E8E5DF] rounded w-1/3 mb-3" />
                <div className="h-5 bg-[#E8E5DF] rounded w-full mb-2" />
                <div className="h-4 bg-[#E8E5DF] rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : berita.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {berita.map((b) => <BeritaCard key={b.id} {...b} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-[#6B6860]">
            <p className="font-serif text-xl mb-2">Belum ada berita</p>
            <p className="text-sm">Coba pilih kategori lain.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded text-sm transition-colors ${
                  page === i + 1
                    ? 'bg-gold text-white'
                    : 'border border-[#E0DDD6] text-[#6B6860] hover:border-gold hover:text-gold'
                }`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <footer className="border-t border-[#E0DDD6] text-center py-6 text-sm text-[#6B6860]">
        © 2026 <span className="font-serif text-gold">Kedhaton Property</span>
      </footer>
    </>
  )
}
