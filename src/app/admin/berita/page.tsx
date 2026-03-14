// src/app/admin/berita/page.tsx
'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatTanggalSingkat } from '@/lib/utils'

interface Berita {
  id: string; judul: string; slug: string; kategori: string; status: string
  thumbnail?: string | null; publishedAt?: string | null; scheduledAt?: string | null; createdAt: string
}

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  PUBLISHED: { label: 'Tayang', cls: 'bg-green-50 text-green-700 border-green-200' },
  DRAFT: { label: 'Draft', cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  SCHEDULED: { label: 'Terjadwal', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
}

export default function AdminBeritaPage() {
  const [berita, setBerita] = useState<Berita[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, scheduled: 0 })
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' })
      if (filter) params.set('status', filter)
      const res = await fetch(`/api/berita?${params}`)
      const data = await res.json()
      setBerita(data.berita || [])
      setTotalPages(data.pagination?.totalPages || 1)

      // Fetch stats
      const [pub, drf, sch] = await Promise.all([
        fetch('/api/berita?status=PUBLISHED&limit=1').then(r => r.json()),
        fetch('/api/berita?status=DRAFT&limit=1').then(r => r.json()),
        fetch('/api/berita?status=SCHEDULED&limit=1').then(r => r.json()),
      ])
      setStats({
        total: (pub.pagination?.total || 0) + (drf.pagination?.total || 0) + (sch.pagination?.total || 0),
        published: pub.pagination?.total || 0,
        draft: drf.pagination?.total || 0,
        scheduled: sch.pagination?.total || 0,
      })
    } catch {
      setBerita([])
    } finally {
      setLoading(false)
    }
  }, [page, filter])

  useEffect(() => { fetchData() }, [fetchData])

  async function handleDelete(id: string, judul: string) {
    if (!confirm(`Hapus berita "${judul}"?`)) return
    setDeleting(id)
    try {
      await fetch(`/api/berita/${id}`, { method: 'DELETE' })
      fetchData()
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-medium text-charcoal">Kelola Berita</h1>
          <p className="text-sm text-[#6B6860] mt-1">Semua berita Kedhaton Property</p>
        </div>
        <Link href="/admin/berita/baru" className="btn-gold">+ Tulis Berita</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: stats.total, color: 'text-charcoal' },
          { label: 'Tayang', value: stats.published, color: 'text-green-600' },
          { label: 'Draft', value: stats.draft, color: 'text-yellow-600' },
          { label: 'Terjadwal', value: stats.scheduled, color: 'text-blue-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[#E0DDD6] rounded-lg p-5">
            <div className="text-xs text-[#6B6860] mb-1">{s.label}</div>
            <div className={`font-serif text-3xl font-medium ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {[{ val: '', label: 'Semua' }, { val: 'PUBLISHED', label: 'Tayang' }, { val: 'DRAFT', label: 'Draft' }, { val: 'SCHEDULED', label: 'Terjadwal' }].map((f) => (
          <button key={f.val} onClick={() => { setFilter(f.val); setPage(1) }}
            className={`px-3 py-1.5 rounded text-xs border transition-colors ${
              filter === f.val ? 'bg-charcoal text-white border-charcoal' : 'border-[#E0DDD6] text-[#6B6860] hover:border-charcoal'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E0DDD6] rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#6B6860] text-sm">Memuat...</div>
        ) : berita.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-serif text-xl text-charcoal mb-2">Belum ada berita</p>
            <Link href="/admin/berita/baru" className="text-gold text-sm hover:underline">Tulis berita pertama →</Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-[#E0DDD6] bg-[#FAF8F4]">
              <tr>
                <th className="text-left px-5 py-3 text-xs text-[#6B6860] font-medium">Berita</th>
                <th className="text-left px-4 py-3 text-xs text-[#6B6860] font-medium">Kategori</th>
                <th className="text-left px-4 py-3 text-xs text-[#6B6860] font-medium">Status</th>
                <th className="text-left px-4 py-3 text-xs text-[#6B6860] font-medium">Tanggal</th>
                <th className="text-right px-5 py-3 text-xs text-[#6B6860] font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {berita.map((b, i) => (
                <tr key={b.id} className={`border-b border-[#E0DDD6] last:border-0 ${i % 2 === 0 ? '' : 'bg-[#FAF8F4]/50'}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {b.thumbnail ? (
                        <div className="relative w-14 h-10 rounded overflow-hidden shrink-0">
                          <Image src={b.thumbnail} alt={b.judul} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-14 h-10 rounded bg-[#E8E5DF] shrink-0 flex items-center justify-center text-lg">📰</div>
                      )}
                      <span className="font-medium text-charcoal leading-snug line-clamp-2 max-w-xs">{b.judul}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="tag-gold text-xs">{b.kategori}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded border ${STATUS_LABEL[b.status]?.cls}`}>
                      {STATUS_LABEL[b.status]?.label}
                      {b.status === 'SCHEDULED' && b.scheduledAt && (
                        <span className="block text-[10px] opacity-70">{formatTanggalSingkat(b.scheduledAt)}</span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[#6B6860] text-xs">
                    {b.publishedAt ? formatTanggalSingkat(b.publishedAt) : formatTanggalSingkat(b.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/berita/${b.slug}`} target="_blank"
                        className="px-3 py-1.5 text-xs border border-[#E0DDD6] rounded hover:border-gold hover:text-gold transition-colors">
                        Lihat
                      </Link>
                      <Link href={`/admin/berita/${b.id}/edit`}
                        className="px-3 py-1.5 text-xs border border-[#E0DDD6] rounded hover:border-gold hover:text-gold transition-colors">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(b.id, b.judul)} disabled={deleting === b.id}
                        className="px-3 py-1.5 text-xs border border-red-200 text-red-500 rounded hover:bg-red-50 transition-colors disabled:opacity-50">
                        {deleting === b.id ? '...' : 'Hapus'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-6 justify-end">
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded text-xs transition-colors ${
                page === i + 1 ? 'bg-gold text-white' : 'border border-[#E0DDD6] text-[#6B6860] hover:border-gold'
              }`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
