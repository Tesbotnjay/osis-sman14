import { RATE_LIMITS, UPLOAD_LIMITS } from '@/constants'

/**
 * Validate W-SPIRAS form input.
 */
export function validateWspirasInput(data: {
  category?: string
  name?: string
  class?: string
  message?: string
  honeypot?: string
}): { valid: boolean; error?: string } {
  // Honeypot check - should be empty
  if (data.honeypot) {
    return { valid: false, error: 'spam_detected' }
  }

  // Category validation
  const validCategories = ['aspirasi', 'saran', 'kritik']
  if (!data.category || !validCategories.includes(data.category)) {
    return { valid: false, error: 'Kategori tidak valid.' }
  }

  // Message validation
  if (!data.message || typeof data.message !== 'string') {
    return { valid: false, error: 'Pesan tidak boleh kosong.' }
  }

  const trimmedMessage = data.message.trim()

  if (trimmedMessage.length < RATE_LIMITS.WSPIRAS_MIN_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: `Pesan minimal ${RATE_LIMITS.WSPIRAS_MIN_MESSAGE_LENGTH} karakter.`,
    }
  }

  if (trimmedMessage.length > RATE_LIMITS.WSPIRAS_MAX_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: `Pesan maksimal ${RATE_LIMITS.WSPIRAS_MAX_MESSAGE_LENGTH} karakter.`,
    }
  }

  // Name validation (optional, but if provided, sanitize)
  if (data.name && typeof data.name === 'string' && data.name.trim().length > 100) {
    return { valid: false, error: 'Nama terlalu panjang.' }
  }

  // Class validation (optional)
  if (data.class && typeof data.class === 'string' && data.class.trim().length > 20) {
    return { valid: false, error: 'Kelas tidak valid.' }
  }

  return { valid: true }
}

/**
 * Validate image file upload.
 */
export function validateImageUpload(file: {
  type: string
  size: number
  name: string
}): { valid: boolean; error?: string } {
  const { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE, ALLOWED_EXTENSIONS } = UPLOAD_LIMITS

  // Check MIME type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Tipe file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.' }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const maxMB = Math.round(MAX_FILE_SIZE / (1024 * 1024))
    return { valid: false, error: `File terlalu besar. Maksimal ${maxMB} MB.` }
  }

  // Check extension
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: 'Ekstensi file tidak valid.' }
  }

  return { valid: true }
}

/**
 * General text input validation.
 */
export function validateRequired(value: unknown, fieldName: string): { valid: boolean; error?: string } {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { valid: false, error: `${fieldName} tidak boleh kosong.` }
  }
  return { valid: true }
}
