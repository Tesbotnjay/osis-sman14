import 'server-only'

import { RATE_LIMITS } from '@/constants'

// In-memory rate limit store (for single-instance deployment)
// For production multi-instance: use Redis or Supabase
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore) {
    if (now > value.resetAt) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Clean every minute

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

/**
 * Server-side rate limiting by IP or identifier.
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = RATE_LIMITS.WSPIRAS_MAX_REQUESTS,
  windowSeconds: number = RATE_LIMITS.WSPIRAS_WINDOW_SECONDS
): RateLimitResult {
  const now = Date.now()
  const windowMs = windowSeconds * 1000
  const key = `rate:${identifier}`

  const existing = rateLimitStore.get(key)

  if (!existing || now > existing.resetAt) {
    // New window
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs }
  }

  if (existing.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt }
  }

  existing.count++
  return {
    allowed: true,
    remaining: maxRequests - existing.count,
    resetAt: existing.resetAt,
  }
}

/**
 * Get a hashed identifier from IP for privacy.
 */
export function hashIP(ip: string): string {
  // Simple hash for rate limiting - not for security
  let hash = 0
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}
