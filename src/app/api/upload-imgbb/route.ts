import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/permissions/check'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { authenticated } = await requireAuth()
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const apiKey = process.env.IMGBB_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'IMGBB_API_KEY belum dikonfigurasi di server.' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'File diperlukan.' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipe file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.' },
        { status: 400 }
      )
    }

    // Validate file size (max 32MB for ImgBB)
    if (file.size > 32 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File terlalu besar. Maksimal 32 MB.' },
        { status: 400 }
      )
    }

    // Convert file to base64
    const buffer = Buffer.from(await file.arrayBuffer())
    const base64 = buffer.toString('base64')

    // Upload to ImgBB
    const imgbbForm = new FormData()
    imgbbForm.append('key', apiKey)
    imgbbForm.append('image', base64)
    imgbbForm.append('name', file.name.replace(/\.[^.]+$/, ''))

    const imgbbResponse = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: imgbbForm,
    })

    const result = await imgbbResponse.json()

    if (!result.success) {
      console.error('ImgBB upload error:', result)
      return NextResponse.json(
        { error: 'Gagal mengupload ke ImgBB. Coba lagi.' },
        { status: 500 }
      )
    }

    // Return the direct image URL
    return NextResponse.json({
      url: result.data.url,
      display_url: result.data.display_url,
      thumbnail_url: result.data.thumb?.url || result.data.url,
      delete_url: result.data.delete_url,
    })
  } catch (error) {
    console.error('ImgBB Upload API error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengupload.' },
      { status: 500 }
    )
  }
}
