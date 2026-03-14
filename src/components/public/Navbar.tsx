// src/components/public/Navbar.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFFDF9]/92 backdrop-blur-md border-b border-[#E0DDD6]">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="font-serif text-xl font-semibold text-charcoal tracking-wide">
          Kedhaton <span className="text-gold">Property</span>
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex gap-8 list-none">
          {[
            { href: '/#hero', label: 'Beranda' },
            { href: '/#tentang', label: 'Tentang' },
            { href: '/#blog', label: 'Blog' },
            { href: '/berita', label: 'Berita' },
            { href: '/#kontak', label: 'Kontak' },
          ].map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="text-[#6B6860] text-sm hover:text-gold transition-colors tracking-wide">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button className="md:hidden text-charcoal" onClick={() => setOpen(!open)}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            {open ? (
              <path d="M4 4L18 18M18 4L4 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            ) : (
              <>
                <line x1="3" y1="6" x2="19" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="3" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="3" y1="16" x2="19" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#FFFDF9] border-t border-[#E0DDD6] px-6 py-4 flex flex-col gap-4">
          {[
            { href: '/#hero', label: 'Beranda' },
            { href: '/#tentang', label: 'Tentang' },
            { href: '/#blog', label: 'Blog' },
            { href: '/berita', label: 'Berita' },
            { href: '/#kontak', label: 'Kontak' },
          ].map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
              className="text-[#6B6860] text-sm hover:text-gold transition-colors">
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
