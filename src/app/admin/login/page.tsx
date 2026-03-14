// src/app/admin/login/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Login gagal'); return }
      router.push('/admin/berita')
      router.refresh()
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-medium text-charcoal">
            Kedhaton <span className="text-gold">Property</span>
          </h1>
          <p className="text-sm text-[#6B6860] mt-2">Dashboard Admin</p>
        </div>

        <div className="bg-white border border-[#E0DDD6] rounded-xl p-8">
          <h2 className="font-serif text-xl text-charcoal mb-6">Masuk</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-[#6B6860] mb-1.5 tracking-wide">Username</label>
              <input type="text" className="input-base" placeholder="admin"
                value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                required autoFocus />
            </div>
            <div>
              <label className="block text-xs text-[#6B6860] mb-1.5 tracking-wide">Password</label>
              <input type="password" className="input-base" placeholder="••••••••"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                required />
            </div>
            <button type="submit" disabled={loading}
              className="btn-gold w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Memuat...' : 'Masuk'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#6B6860] mt-6">
          Default: admin / admin123 — ganti setelah login pertama
        </p>
      </div>
    </div>
  )
}
