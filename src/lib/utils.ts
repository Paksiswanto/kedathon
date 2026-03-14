// src/lib/utils.ts

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function formatTanggal(date: string | Date): string {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatTanggalSingkat(date: string | Date): string {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export const KATEGORI_OPTIONS = [
  'Harga & Pasar',
  'KPR & Bunga',
  'Regulasi',
  'Tips Beli Rumah',
  'Keseharian',
  'Cerita Klien',
  'Properti',
]

export const TAG_SUGGESTIONS = [
  'surabaya', 'sidoarjo', 'kpr', 'tips', 'properti',
  'harga', 'beli rumah', 'investasi', 'regulasi', 'pasar',
]
