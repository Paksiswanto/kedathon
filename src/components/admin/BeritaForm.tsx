// src/components/admin/BeritaForm.tsx
'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { KATEGORI_OPTIONS, TAG_SUGGESTIONS } from '@/lib/utils'
import RichEditor from './RichEditor'

interface BeritaFormProps {
  initialData?: {
    id?: string; judul?: string; konten?: string; ringkasan?: string
    thumbnail?: string; thumbnailId?: string; kategori?: string
    tags?: string[]; status?: string; scheduledAt?: string | null
  }
  mode: 'create' | 'edit'
}

export default function BeritaForm({ initialData, mode }: BeritaFormProps) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    judul: initialData?.judul || '',
    konten: initialData?.konten || '',
    ringkasan: initialData?.ringkasan || '',
    thumbnail: initialData?.thumbnail || '',
    thumbnailId: initialData?.thumbnailId || '',
    kategori: initialData?.kategori || KATEGORI_OPTIONS[0],
    tags: initialData?.tags || [] as string[],
    status: initialData?.status || 'DRAFT',
    scheduledAt: initialData?.scheduledAt
      ? new Date(initialData.scheduledAt).toISOString().slice(0, 16)
      : '',
  })

  const [tagInput, setTagInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function addTag(tag: string) {
    const clean = tag.trim().toLowerCase()
    if (clean && !form.tags.includes(clean)) setForm({ ...form, tags: [...form.tags, clean] })
    setTagInput('')
  }

  function removeTag(tag: string) {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) })
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload gagal')
      setForm({ ...form, thumbnail: data.url, thumbnailId: data.publicId })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload gagal')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.judul || !form.konten || !form.kategori) {
      setError('Judul, konten, dan kategori wajib diisi')
      return
    }
    setSaving(true)
    setError('')
    try {
      const url = mode === 'create' ? '/api/berita' : `/api/berita/${initialData?.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'
      const body = { ...form, scheduledAt: form.status === 'SCHEDULED' ? form.scheduledAt : null }
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan')
      setSuccess(mode === 'create' ? 'Berita berhasil dibuat!' : 'Berita berhasil diperbarui!')
      setTimeout(() => router.push('/admin/berita'), 1200)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded mb-6">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded mb-6">{success}</div>}

      {/* Judul */}
      <div className="mb-5">
        <label className="block text-xs text-[#6B6860] mb-1.5 tracking-wide">Judul Berita *</label>
        <input name="judul" value={form.judul} onChange={handleChange}
          className="input-base text-lg font-serif" placeholder="Tulis judul berita yang menarik..." required />
      </div>

      {/* Ringkasan */}
      <div className="mb-5">
        <label className="block text-xs text-[#6B6860] mb-1.5 tracking-wide">Ringkasan / Excerpt</label>
        <textarea name="ringkasan" value={form.ringkasan} onChange={handleChange}
          className="input-base h-20 resize-none" placeholder="Singkat isi berita (tampil di card dan SEO)..." />
      </div>

      {/* Thumbnail */}
      <div className="mb-5">
        <label className="block text-xs text-[#6B6860] mb-1.5 tracking-wide">Thumbnail</label>
        {form.thumbnail ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.thumbnail} alt="thumbnail" className="w-full h-48 object-cover rounded-lg border border-[#E0DDD6]" />
            <button type="button" onClick={() => setForm({ ...form, thumbnail: '', thumbnailId: '' })}
              className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Hapus
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-[#E0DDD6] rounded-lg p-8 text-center cursor-pointer hover:border-gold transition-colors">
            {uploading ? (
              <p className="text-sm text-[#6B6860]">Mengupload...</p>
            ) : (
              <>
                <p className="text-2xl mb-2">🖼️</p>
                <p className="text-sm text-[#6B6860]">Klik untuk upload gambar</p>
                <p className="text-xs text-[#6B6860] mt-1">JPG, PNG, WebP — maks. 5MB</p>
              </>
            )}
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      </div>

      {/* Konten */}
      <div className="mb-5">
        <label className="block text-xs text-[#6B6860] mb-1.5 tracking-wide">Konten *</label>
        <RichEditor
          value={form.konten}
          onChange={(val) => setForm({ ...form, konten: val })}
        />
      </div>

      {/* Row: Kategori + Status */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-xs text-[#6B6860] mb-1.5 tracking-wide">Kategori *</label>
          <select name="kategori" value={form.kategori} onChange={handleChange} className="input-base">
            {KATEGORI_OPTIONS.map((k) => <option key={k}>{k}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-[#6B6860] mb-1.5 tracking-wide">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="input-base">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Tayang Sekarang</option>
            <option value="SCHEDULED">Jadwalkan</option>
          </select>
        </div>
      </div>

      {/* Scheduled date */}
      {form.status === 'SCHEDULED' && (
        <div className="mb-5">
          <label className="block text-xs text-[#6B6860] mb-1.5 tracking-wide">Waktu Publish</label>
          <input type="datetime-local" name="scheduledAt" value={form.scheduledAt} onChange={handleChange}
            className="input-base" min={new Date().toISOString().slice(0, 16)} />
        </div>
      )}

      {/* Tags */}
      <div className="mb-8">
        <label className="block text-xs text-[#6B6860] mb-1.5 tracking-wide">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {form.tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1.5 bg-gold-light text-gold text-xs px-2.5 py-1 rounded">
              #{tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput) } }}
            className="input-base flex-1" placeholder="Tambah tag lalu tekan Enter..." />
          <button type="button" onClick={() => addTag(tagInput)} className="btn-outline px-4 py-2">+</button>
        </div>
        {/* Tag suggestions */}
        <div className="flex gap-1.5 flex-wrap mt-2">
          {TAG_SUGGESTIONS.filter((t) => !form.tags.includes(t)).slice(0, 8).map((tag) => (
            <button key={tag} type="button" onClick={() => addTag(tag)}
              className="text-xs text-[#6B6860] border border-[#E0DDD6] px-2 py-0.5 rounded hover:border-gold hover:text-gold transition-colors">
              +{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button type="submit" disabled={saving || uploading}
          className="btn-gold disabled:opacity-60 disabled:cursor-not-allowed">
          {saving ? 'Menyimpan...' : mode === 'create' ? 'Publikasikan' : 'Simpan Perubahan'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="btn-outline">
          Batal
        </button>
      </div>
    </form>
  )
}
