// src/app/api/berita/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromCookies } from '@/lib/auth'
import { deleteImage } from '@/lib/cloudinary'
import { generateSlug } from '@/lib/utils'

// GET single berita by id or slug
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const berita = await prisma.berita.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
    })
    if (!berita) return NextResponse.json({ error: 'Berita tidak ditemukan' }, { status: 404 })
    return NextResponse.json({ berita })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil berita' }, { status: 500 })
  }
}

// PUT - Update berita
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = getAdminFromCookies()
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { judul, konten, ringkasan, thumbnail, thumbnailId, kategori, tags, status, scheduledAt } = body

    const existing = await prisma.berita.findUnique({ where: { id: params.id } })
    if (!existing) return NextResponse.json({ error: 'Berita tidak ditemukan' }, { status: 404 })

    // Hapus gambar lama di cloudinary jika thumbnail diganti
    if (thumbnailId && existing.thumbnailId && thumbnailId !== existing.thumbnailId) {
      await deleteImage(existing.thumbnailId).catch(console.error)
    }

    const slug = judul !== existing.judul ? generateSlug(judul) : existing.slug

    const data: Record<string, unknown> = {
      judul,
      slug,
      konten,
      ringkasan: ringkasan || null,
      thumbnail: thumbnail || existing.thumbnail,
      thumbnailId: thumbnailId || existing.thumbnailId,
      kategori,
      tags: Array.isArray(tags) ? tags : [],
      status: status || 'DRAFT',
      publishedAt: existing.publishedAt,
      scheduledAt: null,
    }

    if (status === 'PUBLISHED' && !existing.publishedAt) data.publishedAt = new Date()
    if (status === 'SCHEDULED' && scheduledAt) data.scheduledAt = new Date(scheduledAt)

    const updated = await prisma.berita.update({ where: { id: params.id }, data })
    return NextResponse.json({ success: true, berita: updated })
  } catch (error) {
    console.error('PUT berita error:', error)
    return NextResponse.json({ error: 'Gagal update berita' }, { status: 500 })
  }
}

// DELETE berita
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = getAdminFromCookies()
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const berita = await prisma.berita.findUnique({ where: { id: params.id } })
    if (!berita) return NextResponse.json({ error: 'Berita tidak ditemukan' }, { status: 404 })

    if (berita.thumbnailId) await deleteImage(berita.thumbnailId).catch(console.error)

    await prisma.berita.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal hapus berita' }, { status: 500 })
  }
}
