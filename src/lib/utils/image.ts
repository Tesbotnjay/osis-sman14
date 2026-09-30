import 'server-only'

import sharp from 'sharp'
import { UPLOAD_LIMITS } from '@/constants'

interface ProcessedImage {
  thumbnail: Buffer
  medium: Buffer
  large: Buffer
  format: 'webp'
  originalWidth: number
  originalHeight: number
}

/**
 * Process an uploaded image:
 * 1. Validate dimensions
 * 2. Resize to three variants
 * 3. Compress
 * 4. Convert to WebP
 */
export async function processImage(buffer: Buffer): Promise<ProcessedImage> {
  const metadata = await sharp(buffer).metadata()

  if (!metadata.width || !metadata.height) {
    throw new Error('Tidak dapat membaca dimensi gambar.')
  }

  if (metadata.width > UPLOAD_LIMITS.MAX_DIMENSION * 2 || metadata.height > UPLOAD_LIMITS.MAX_DIMENSION * 2) {
    throw new Error(`Dimensi gambar terlalu besar. Maksimal ${UPLOAD_LIMITS.MAX_DIMENSION * 2}px.`)
  }

  // Generate thumbnail
  const thumbnail = await sharp(buffer)
    .resize(UPLOAD_LIMITS.THUMBNAIL_SIZE, UPLOAD_LIMITS.THUMBNAIL_SIZE, {
      fit: 'cover',
      position: 'centre',
    })
    .webp({ quality: 75 })
    .toBuffer()

  // Generate medium
  const medium = await sharp(buffer)
    .resize(UPLOAD_LIMITS.MEDIUM_SIZE, undefined, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toBuffer()

  // Generate large
  const large = await sharp(buffer)
    .resize(UPLOAD_LIMITS.LARGE_SIZE, undefined, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 85 })
    .toBuffer()

  return {
    thumbnail,
    medium,
    large,
    format: 'webp',
    originalWidth: metadata.width,
    originalHeight: metadata.height,
  }
}

/**
 * Process a single image (no variants) for logos, avatars, etc.
 */
export async function processLogo(buffer: Buffer, maxSize: number = 512): Promise<Buffer> {
  return sharp(buffer)
    .resize(maxSize, maxSize, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 85 })
    .toBuffer()
}

/**
 * Validate actual image content (not just extension/MIME).
 */
export async function validateImageBuffer(buffer: Buffer): Promise<boolean> {
  try {
    const metadata = await sharp(buffer).metadata()
    return !!metadata.format && !!metadata.width && !!metadata.height
  } catch {
    return false
  }
}
