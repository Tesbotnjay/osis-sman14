/**
 * Sanitize user input to prevent XSS and injection attacks.
 */

/**
 * Strip HTML tags from input string.
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '')
}

/**
 * Escape HTML entities to prevent XSS.
 */
export function escapeHtml(input: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  }
  return input.replace(/[&<>"'/]/g, (s) => map[s] || s)
}

/**
 * Sanitize text input for safe storage and display.
 * Removes HTML, trims whitespace, normalizes line breaks.
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') return ''

  return stripHtml(input)
    .trim()
    .replace(/\r\n/g, '\n') // Normalize line breaks
    .replace(/\n{3,}/g, '\n\n') // Max 2 consecutive line breaks
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control chars
}

/**
 * Sanitize name input.
 */
export function sanitizeName(input: string | null | undefined): string | null {
  if (!input || typeof input !== 'string') return null
  const sanitized = sanitizeText(input).slice(0, 100)
  return sanitized || null
}

/**
 * Sanitize class input.
 */
export function sanitizeClass(input: string | null | undefined): string | null {
  if (!input || typeof input !== 'string') return null
  const sanitized = sanitizeText(input)
    .replace(/[^a-zA-Z0-9\s\-/]/g, '') // Only allow alphanumeric, spaces, hyphens, slashes
    .slice(0, 20)
  return sanitized || null
}

/**
 * Generate a simple hash for duplicate detection.
 */
export function hashMessage(message: string): string {
  const normalized = message.toLowerCase().replace(/\s+/g, ' ').trim()
  let hash = 0
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}
