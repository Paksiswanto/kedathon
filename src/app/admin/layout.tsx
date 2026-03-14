// src/app/admin/layout.tsx
'use client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  { href: '/admin/berita', label: 'Berita', icon: '📰' },
  { href: '/admin/berita/baru', label: 'Tulis Berita', icon: '✏️' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  if (pathname === '/admin/login') return <>{children}</>

  return (
    <div className="min-h-screen flex bg-[#F5F3EF]">
      {/* Sidebar */}
      <aside className="w-56 bg-charcoal flex flex-col shrink-0">
        <div className="px-6 py-5 border-b border-white/10">
          <div className="font-serif text-lg text-white leading-tight">
            Kedhaton <span className="text-gold">Property</span>
          </div>
          <div className="text-xs text-white/40 mt-0.5">Dashboard Admin</div>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/admin/berita' && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                  active ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}>
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <Link href="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors mb-1">
            <span className="text-base">🌐</span>
            Lihat Website
          </Link>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-white/60 hover:text-red-400 hover:bg-white/5 transition-colors">
            <span className="text-base">🚪</span>
            Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
