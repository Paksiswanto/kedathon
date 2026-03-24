// src/app/page.tsx
import Link from 'next/link'
import Navbar from '@/components/public/Navbar'
import BeritaCard from '@/components/public/BeritaCard'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'


async function getLatestBerita() {
  try {
    return await prisma.berita.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: {
        id: true, slug: true, judul: true, ringkasan: true,
        thumbnail: true, kategori: true, tags: true, publishedAt: true,
      },
    })
  } catch {
    return []
  }
}

export default async function HomePage() {
  const berita = await getLatestBerita()

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section id="hero" className="min-h-screen flex items-center pt-24 pb-16 px-6 bg-[#FFFDF9] relative overflow-hidden">
        <div className="absolute right-[-80px] top-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-[#E8E5DF] rounded-full pointer-events-none hidden md:block" />
        <div className="absolute right-[60px] top-1/2 -translate-y-1/2 w-[360px] h-[360px] border border-[#E0DDD6] rounded-full pointer-events-none hidden md:block" />

        <div className="max-w-5xl mx-auto w-full relative z-10">
          <span className="inline-block bg-gold-light text-gold text-xs font-medium tracking-widest uppercase px-3.5 py-1.5 rounded mb-6">
            Marketing Property · Surabaya
          </span>
          <h1 className="font-serif text-5xl md:text-6xl font-medium leading-tight text-charcoal mb-5 max-w-2xl">
            Menemukan Rumah <em className="italic text-gold">Impian</em> Anda Bersama Kami
          </h1>
          <p className="text-[#6B6860] text-lg font-light max-w-xl mb-10 leading-relaxed">
            Kedhaton Property hadir dengan dedikasi penuh membantu Anda menemukan hunian terbaik.
            Kami memahami bahwa membeli rumah adalah keputusan hidup.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="#tentang" className="btn-primary">Kenali Kami</Link>
            <Link href="#kontak" className="btn-outline">Hubungi Sekarang</Link>
          </div>

          {/* Stats */}
          <div className="flex gap-12 mt-14 pt-10 border-t border-[#E0DDD6]">
            {[
              { num: '120+', label: 'Rumah Terjual' },
              { num: '5+', label: 'Tahun Pengalaman' },
              { num: '98%', label: 'Klien Puas' },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-serif text-3xl font-medium text-charcoal">{s.num}</div>
                <div className="text-sm text-[#6B6860] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-[#E0DDD6]" />

      {/* TENTANG */}
      <section id="tentang" className="max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
        <div className="relative">

          <div className="w-full aspect-[4/5] rounded overflow-hidden relative">
            <Image
              src="/images/hero.jpeg"
              alt="Kedhaton Property"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        <div>
          <p className="section-label">Tentang Kami</p>
          <h2 className="font-serif text-4xl font-medium text-charcoal mb-5 leading-snug">
            Profesional di Bidang Properti Residensial
          </h2>
          <p className="text-[#6B6860] text-sm leading-loose mb-4">
            Kedhaton Property adalah tim marketing properti yang berfokus pada penjualan rumah di wilayah
            Surabaya dan sekitarnya. Kami percaya setiap keluarga berhak mendapat hunian yang nyaman.
          </p>
          <p className="text-[#6B6860] text-sm leading-loose mb-4">
            Dengan pengalaman lebih dari 5 tahun, kami telah membantu ratusan keluarga menemukan
            rumah impian. Pendekatan kami yang personal dan jujur membuat proses pembelian lebih mudah.
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            {['Penjualan Rumah', 'Konsultasi Properti', 'Nego & KPR', 'Surabaya & Sidoarjo'].map((tag) => (
              <span key={tag} className="tag-gold">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-[#E0DDD6]" />

      {/* BERITA TERBARU */}
      <section id="blog" className="max-w-5xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-label">Update Terbaru</p>
            <h2 className="font-serif text-4xl font-medium text-charcoal">Berita Properti</h2>
          </div>
          <Link href="/berita" className="text-sm text-gold hover:underline hidden md:block">
            Lihat semua →
          </Link>
        </div>

        {berita.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {berita.map((b) => (
              <BeritaCard key={b.id} {...b} publishedAt={b.publishedAt?.toISOString() ?? null} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-[#6B6860]">
            <p className="text-lg font-serif mb-2">Belum ada berita</p>
            <p className="text-sm">Segera hadir konten menarik dari kami.</p>
          </div>
        )}

        <div className="text-center mt-8 md:hidden">
          <Link href="/berita" className="btn-outline inline-block">Lihat semua berita</Link>
        </div>
      </section>

      <div className="border-t border-[#E0DDD6]" />

      {/* KONTAK */}
      <section id="kontak" className="max-w-5xl mx-auto px-6 py-20">
        <div className="bg-charcoal rounded-xl p-10 md:p-14 flex flex-col md:flex-row gap-10 items-start md:items-center">
          <div className="flex-1">
            <p className="text-xs tracking-widest uppercase text-white/40 mb-3">Hubungi Kami</p>
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-white mb-3">
              Siap Bantu Kamu Temukan Rumah Impian
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Konsultasi gratis, tanpa tekanan. Kami senang mendengar kebutuhan Anda.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { icon: '📱', label: 'WhatsApp', value: '+62 812-3456-7890', href: 'https://wa.me/6281234567890' },
              { icon: '✉️', label: 'Email', value: 'hello@kedhatonproperty.com', href: 'mailto:hello@kedhatonproperty.com' },
              { icon: '📍', label: 'Lokasi', value: 'Surabaya, Jawa Timur', href: '#' },
              { icon: '📸', label: 'Instagram', value: '@kedhatonproperty', href: '#' },
            ].map((item) => (
              <a key={item.label} href={item.href}
                className="flex items-center gap-3 text-white/70 hover:text-gold transition-colors text-sm">
                <div className="w-9 h-9 rounded bg-white/[0.07] flex items-center justify-center text-base shrink-0">
                  {item.icon}
                </div>
                <span>{item.value}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#E0DDD6] text-center py-6 text-sm text-[#6B6860]">
        © 2026 <span className="font-serif text-gold">Kedhaton Property</span> · Dibuat dengan dedikasi untuk hunian terbaik Anda
      </footer>
    </>
  )
}
