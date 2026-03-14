import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromCookies } from '@/lib/auth'
import { generateSlug } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const admin = await getAdminFromCookies()
    const kategori = searchParams.get('kategori')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    await prisma.berita.updateMany({
      where: { status: 'SCHEDULED', scheduledAt: { lte: new Date() } },
      data: { status: 'PUBLISHED', publishedAt: new Date() },
    })

    const where: Record<string, unknown> = {}

    if (admin) {
      if (status) where.status = status
    } else {
      where.status = 'PUBLISHED'
    }

    if (kategori && kategori !== 'semua') where.kategori = kategori

    const [berita, total] = await Promise.all([
      prisma.berita.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true, judul: true, slug: true, ringkasan: true,
          thumbnail: true, kategori: true, tags: true, status: true,
          publishedAt: true, scheduledAt: true, createdAt: true,
        },
      }),
      prisma.berita.count({ where }),
    ])

    return NextResponse.json({
      berita,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('GET berita error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data berita' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromCookies()
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { judul, konten, ringkasan, thumbnail, thumbnailId, kategori, tags, status, scheduledAt } = body

    if (!judul || !konten || !kategori) {
      return NextResponse.json({ error: 'Judul, konten, dan kategori wajib diisi' }, { status: 400 })
    }

    let slug = generateSlug(judul)
    const existing = await prisma.berita.findUnique({ where: { slug } })
    if (existing) slug = `${slug}-${Date.now()}`

    const berita = await prisma.berita.create({
      data: {
        judul,
        slug,
        konten,
        ringkasan: ringkasan || null,
        thumbnail: thumbnail || null,
        thumbnailId: thumbnailId || null,
        kategori,
        tags: Array.isArray(tags) ? tags : [],
        status: status || 'DRAFT',
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        scheduledAt: status === 'SCHEDULED' && scheduledAt ? new Date(scheduledAt) : null,
      },
    })

    return NextResponse.json({ success: true, berita }, { status: 201 })
  } catch (error) {
    console.error('POST berita error:', error)
    return NextResponse.json({ error: 'Gagal membuat berita' }, { status: 500 })
  }
}