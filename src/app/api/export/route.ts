import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requirePermission } from '@/lib/permissions/check'
import { PERMISSIONS } from '@/constants'
import * as XLSX from 'xlsx'

export async function GET(request: NextRequest) {
  try {
    await requirePermission(PERMISSIONS.EXPORT_DATA)

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (!type) {
      return NextResponse.json({ error: 'Type parameter required' }, { status: 400 })
    }

    const supabase = await createClient()

    switch (type) {
      case 'members':
        return exportMembers(supabase)
      case 'programs':
        return exportPrograms(supabase)
      case 'events':
        return exportEvents(supabase)
      case 'wspiras':
        return exportWspiras(supabase)
      case 'gallery':
        return exportGallery(supabase)
      default:
        return NextResponse.json({ error: 'Invalid export type' }, { status: 400 })
    }
  } catch (error) {
    console.error('Export error:', error)
    if (error instanceof Error && error.message.startsWith('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json({ error: 'Export gagal.' }, { status: 500 })
  }
}

function createExcelResponse(data: Record<string, unknown>[], sheetName: string, fileName: string) {
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(data)
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${fileName}.xlsx"`,
    },
  })
}

async function exportMembers(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase
    .from('members')
    .select('name, description, active, order_index, created_at')
    .order('order_index')

  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Tidak ada data anggota.' }, { status: 404 })
  }

  const formatted = data.map((m: any) => ({
    Nama: m.name,
    Deskripsi: m.description || '-',
    Aktif: m.active ? 'Ya' : 'Tidak',
    Urutan: m.order_index,
    'Dibuat Pada': m.created_at,
  }))

  return createExcelResponse(formatted, 'Anggota', 'anggota_osis')
}

async function exportPrograms(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase
    .from('programs')
    .select('title, description, date, location, responsible_person, category, status, published, created_at')
    .order('created_at', { ascending: false })

  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Tidak ada data program.' }, { status: 404 })
  }

  const statusLabels: Record<string, string> = {
    akan_datang: 'Akan Datang',
    berlangsung: 'Berlangsung',
    selesai: 'Selesai',
  }

  const formatted = data.map((p: any) => ({
    Judul: p.title,
    Deskripsi: p.description || '-',
    Tanggal: p.date || '-',
    Lokasi: p.location || '-',
    'Penanggung Jawab': p.responsible_person || '-',
    Kategori: p.category || '-',
    Status: statusLabels[p.status] || p.status,
    Dipublikasikan: p.published ? 'Ya' : 'Tidak',
    'Dibuat Pada': p.created_at,
  }))

  return createExcelResponse(formatted, 'Program Kerja', 'program_kerja_osis')
}

async function exportEvents(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase
    .from('events')
    .select('title, description, date, start_time, end_time, location, category, responsible_person, published, created_at')
    .order('date', { ascending: false })

  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Tidak ada data kegiatan.' }, { status: 404 })
  }

  const formatted = data.map((e: any) => ({
    Judul: e.title,
    Deskripsi: e.description || '-',
    Tanggal: e.date,
    'Waktu Mulai': e.start_time || '-',
    'Waktu Selesai': e.end_time || '-',
    Lokasi: e.location || '-',
    Kategori: e.category,
    'Penanggung Jawab': e.responsible_person || '-',
    Dipublikasikan: e.published ? 'Ya' : 'Tidak',
    'Dibuat Pada': e.created_at,
  }))

  return createExcelResponse(formatted, 'Kegiatan', 'kegiatan_osis')
}

async function exportWspiras(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase
    .from('w_spiras')
    .select('category, name, class, message, status, is_anonymous, created_at')
    .order('created_at', { ascending: false })

  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Tidak ada data W-SPIRAS.' }, { status: 404 })
  }

  const categoryLabels: Record<string, string> = {
    aspirasi: 'Aspirasi',
    saran: 'Saran',
    kritik: 'Kritik',
  }

  const statusLabels: Record<string, string> = {
    baru: 'Baru',
    dibaca: 'Dibaca',
    diproses: 'Diproses',
    selesai: 'Selesai',
    spam: 'Spam',
  }

  const formatted = data.map((w: any) => ({
    Kategori: categoryLabels[w.category] || w.category,
    Pengirim: w.name || 'Anonymous',
    Kelas: w.class || '-',
    Pesan: w.message,
    Status: statusLabels[w.status] || w.status,
    Anonim: w.is_anonymous ? 'Ya' : 'Tidak',
    'Dikirim Pada': w.created_at,
  }))

  return createExcelResponse(formatted, 'W-SPIRAS', 'wspiras_osis')
}

async function exportGallery(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase
    .from('gallery')
    .select('title, caption, description, category, date, image_url, published, created_at')
    .order('created_at', { ascending: false })

  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Tidak ada data gallery.' }, { status: 404 })
  }

  const formatted = data.map((g: any) => ({
    Judul: g.title || '-',
    Caption: g.caption || '-',
    Deskripsi: g.description || '-',
    Kategori: g.category || '-',
    Tanggal: g.date || '-',
    'URL Gambar': g.image_url,
    Dipublikasikan: g.published ? 'Ya' : 'Tidak',
    'Dibuat Pada': g.created_at,
  }))

  return createExcelResponse(formatted, 'Gallery', 'gallery_osis')
}
