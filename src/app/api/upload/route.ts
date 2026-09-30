import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { processImage, processLogo, validateImageBuffer } from '@/lib/utils/image'
import { UPLOAD_LIMITS, PERMISSIONS } from '@/constants'
import { requirePermission, requireAuth } from '@/lib/permissions/check'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const bucket = formData.get('bucket') as string
    
    // Map buckets to required permissions
    const bucketPermissions: Record<string, string> = {
      'members': PERMISSIONS.MANAGE_MEMBERS,
      'programs': PERMISSIONS.MANAGE_PROGRAMS,
      'gallery': PERMISSIONS.MANAGE_GALLERY,
      'extracurriculars': PERMISSIONS.MANAGE_EXTRACURRICULARS,
      'logos': PERMISSIONS.MANAGE_SETTINGS,
      'heroes': PERMISSIONS.MANAGE_SETTINGS,
    }

    const requiredPermission = bucketPermissions[bucket]
    if (requiredPermission) {
      await requirePermission(requiredPermission as any)
    } else {
      // Fallback check just for authentication if bucket isn't strictly mapped
      const { authenticated } = await requireAuth()
      if (!authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const file = formData.get('file') as File | null
    const type = formData.get('type') as string // 'image' | 'logo'

    if (!file) {
      return NextResponse.json({ error: 'File diperlukan.' }, { status: 400 })
    }

    if (!bucket) {
      return NextResponse.json({ error: 'Bucket diperlukan.' }, { status: 400 })
    }

    // Validate file type
    if (!UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipe file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > UPLOAD_LIMITS.MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File terlalu besar. Maksimal ${Math.round(UPLOAD_LIMITS.MAX_FILE_SIZE / (1024 * 1024))} MB.` },
        { status: 400 }
      )
    }

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Validate actual image content
    const isValidImage = await validateImageBuffer(buffer)
    if (!isValidImage) {
      return NextResponse.json(
        { error: 'File bukan gambar yang valid.' },
        { status: 400 }
      )
    }

    const adminClient = createAdminClient()
    const timestamp = Date.now()
    const baseName = `${timestamp}`

    if (type === 'logo') {
      // Process as logo (single variant)
      const processed = await processLogo(buffer)
      const path = `${baseName}.webp`

      const { error: uploadError } = await adminClient.storage
        .from(bucket)
        .upload(path, processed, {
          contentType: 'image/webp',
          upsert: true,
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return NextResponse.json({ error: 'Gagal mengupload file.' }, { status: 500 })
      }

      const { data: { publicUrl } } = adminClient.storage
        .from(bucket)
        .getPublicUrl(path)

      return NextResponse.json({
        url: publicUrl,
        path,
      })
    }

    // Process as gallery/content image (three variants)
    const processed = await processImage(buffer)

    // Upload all variants
    const uploads = await Promise.all([
      adminClient.storage.from(bucket).upload(`${baseName}_thumb.webp`, processed.thumbnail, {
        contentType: 'image/webp',
      }),
      adminClient.storage.from(bucket).upload(`${baseName}_medium.webp`, processed.medium, {
        contentType: 'image/webp',
      }),
      adminClient.storage.from(bucket).upload(`${baseName}_large.webp`, processed.large, {
        contentType: 'image/webp',
      }),
    ])

    const errors = uploads.filter(u => u.error)
    if (errors.length > 0) {
      console.error('Upload errors:', errors.map(e => e.error))
      return NextResponse.json({ error: 'Gagal mengupload file.' }, { status: 500 })
    }

    // Get public URLs
    const thumbnailUrl = adminClient.storage.from(bucket).getPublicUrl(`${baseName}_thumb.webp`).data.publicUrl
    const mediumUrl = adminClient.storage.from(bucket).getPublicUrl(`${baseName}_medium.webp`).data.publicUrl
    const largeUrl = adminClient.storage.from(bucket).getPublicUrl(`${baseName}_large.webp`).data.publicUrl

    return NextResponse.json({
      url: largeUrl,
      thumbnail_url: thumbnailUrl,
      medium_url: mediumUrl,
      large_url: largeUrl,
      width: processed.originalWidth,
      height: processed.originalHeight,
    })
  } catch (error) {
    console.error('Upload API error:', error)
    if (error instanceof Error && error.message.startsWith('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengupload.' },
      { status: 500 }
    )
  }
}
