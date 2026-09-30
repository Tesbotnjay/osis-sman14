import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkRateLimit, hashIP } from '@/lib/security/rate-limit'
import { validateWspirasInput } from '@/lib/security/validation'
import { sanitizeText, sanitizeName, sanitizeClass, hashMessage } from '@/lib/security/sanitize'
import { decryptToken, sendTelegramNotification } from '@/lib/utils/telegram'
import { WSPIRAS_CATEGORY_LABELS } from '@/constants'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'

// In-memory duplicate detection store
const recentMessages = new Map<string, number>()

// Clean old entries every 5 minutes
setInterval(() => {
  const oneHourAgo = Date.now() - 3600000
  for (const [key, timestamp] of recentMessages) {
    if (timestamp < oneHourAgo) {
      recentMessages.delete(key)
    }
  }
}, 300000)

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown'
    const ipHash = hashIP(ip)

    // 1. Rate limiting
    const rateResult = checkRateLimit(ipHash)
    if (!rateResult.allowed) {
      return NextResponse.json(
        { error: 'Terlalu banyak pengiriman. Silakan coba lagi beberapa menit.' },
        { status: 429 }
      )
    }

    // 2. Parse body
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Format data tidak valid.' },
        { status: 400 }
      )
    }

    // 3. Honeypot check
    if (body.honeypot) {
      // Silently accept but don't process (appears successful to bots)
      return NextResponse.json({ success: true })
    }

    // 4. Input validation
    const validation = validateWspirasInput(body)
    if (!validation.valid) {
      if (validation.error === 'spam_detected') {
        return NextResponse.json({ success: true }) // Silent reject
      }
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // 5. Sanitize inputs
    const sanitizedMessage = sanitizeText(body.message)
    const sanitizedName = sanitizeName(body.name)
    const sanitizedClass = sanitizeClass(body.class)

    if (!sanitizedMessage || sanitizedMessage.length < 10) {
      return NextResponse.json(
        { error: 'Pesan minimal 10 karakter setelah pemrosesan.' },
        { status: 400 }
      )
    }

    // 6. Duplicate detection
    const messageHash = hashMessage(sanitizedMessage)
    const duplicateKey = `${ipHash}:${messageHash}`
    if (recentMessages.has(duplicateKey)) {
      return NextResponse.json(
        { error: 'Pesan yang sama sudah dikirim sebelumnya. Silakan tulis pesan baru.' },
        { status: 400 }
      )
    }

    // 7. Insert into database
    const supabase = createAdminClient()

    const isAnonymous = !sanitizedName

    // Get active period
    const { data: activePeriod } = await supabase
      .from('periods')
      .select('id')
      .eq('is_active', true)
      .single()

    const { data: submission, error: insertError } = await supabase
      .from('w_spiras')
      .insert({
        category: body.category,
        name: sanitizedName,
        class: sanitizedClass,
        message: sanitizedMessage,
        is_anonymous: isAnonymous,
        ip_hash: ipHash,
        status: 'baru',
        telegram_status: 'pending',
        period_id: (activePeriod as any)?.id || null,
      } as any)
      .select()
      .single()

    if (insertError) {
      console.error('W-SPIRAS insert error:', insertError)
      return NextResponse.json(
        { error: 'Gagal mengirim aspirasi. Silakan coba lagi.' },
        { status: 500 }
      )
    }

    // 8. Record duplicate prevention
    recentMessages.set(duplicateKey, Date.now())

    // 9. Send Telegram notification (async, don't block response)
    sendTelegramNotificationAsync(supabase, submission)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('W-SPIRAS API error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}

/**
 * Send Telegram notification asynchronously.
 * Updates the submission record with delivery status.
 */
async function sendTelegramNotificationAsync(
  supabase: ReturnType<typeof createAdminClient>,
  submission: Record<string, unknown>
) {
  try {
    // Get Telegram settings
    const { data: telegramSettings } = await supabase
      .from('telegram_settings')
      .select('*')
      .single()

    const tgSettings = telegramSettings as any

    if (!tgSettings?.enabled || !tgSettings.bot_token_encrypted || !tgSettings.chat_id) {
      // Telegram not configured - mark as not applicable
      await (supabase as any)
        .from('w_spiras')
        .update({ telegram_status: 'pending' })
        .eq('id', submission.id as string)
      return
    }

    const botToken = decryptToken(tgSettings.bot_token_encrypted)
    const categoryLabel = WSPIRAS_CATEGORY_LABELS[submission.category as string] || String(submission.category)

    const result = await sendTelegramNotification(
      botToken,
      tgSettings.chat_id,
      {
        category: categoryLabel,
        sender: (submission.name as string) || 'Anonymous',
        class: (submission.class as string) || '-',
        message: String(submission.message).slice(0, 500), // Truncate for Telegram
        time: format(new Date(submission.created_at as string), 'dd MMMM yyyy, HH:mm', { locale: localeId }),
        status: 'Baru',
      }
    )

    if (result.success) {
      await (supabase as any)
        .from('w_spiras')
        .update({
          telegram_status: 'sent',
          telegram_sent_at: new Date().toISOString(),
        })
        .eq('id', submission.id as string)
    } else {
      await (supabase as any)
        .from('w_spiras')
        .update({
          telegram_status: 'failed',
          telegram_error: result.error,
        })
        .eq('id', submission.id as string)
    }
  } catch (error) {
    console.error('Telegram notification error:', error)
    await (supabase as any)
      .from('w_spiras')
      .update({
        telegram_status: 'failed',
        telegram_error: error instanceof Error ? error.message : 'Unknown error',
      })
      .eq('id', submission.id as string)
  }
}
