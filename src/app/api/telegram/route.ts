import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requirePermission } from '@/lib/permissions/check'
import { PERMISSIONS } from '@/constants'
import { encryptToken, decryptToken, testTelegramConnection } from '@/lib/utils/telegram'

/**
 * Test Telegram connection
 */
export async function POST(request: NextRequest) {
  try {
    // Check permission
    await requirePermission(PERMISSIONS.MANAGE_TELEGRAM)
    const body = await request.json()
    const { action } = body

    if (action === 'test') {
      return handleTest(body)
    } else if (action === 'save') {
      return handleSave(body)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Telegram API error:', error)
    if (error instanceof Error && error.message.startsWith('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json(
      { error: 'Terjadi kesalahan.' },
      { status: 500 }
    )
  }
}

async function handleTest(body: { botToken?: string; chatId?: string }) {
  const { botToken, chatId } = body

  if (!botToken || !chatId) {
    return NextResponse.json(
      { error: 'Bot token dan Chat ID diperlukan.' },
      { status: 400 }
    )
  }

  const result = await testTelegramConnection(botToken, chatId)

  if (result.success) {
    return NextResponse.json({ success: true, message: 'Koneksi Telegram berhasil!' })
  }

  return NextResponse.json(
    { error: result.error || 'Gagal terhubung ke Telegram.' },
    { status: 400 }
  )
}

async function handleSave(body: {
  botToken?: string
  chatId?: string
  destinationType?: string
  enabled?: boolean
}) {
  const supabase = await createClient()

  const updateData: Record<string, unknown> = {}

  if (body.botToken) {
    updateData.bot_token_encrypted = encryptToken(body.botToken)
  }
  if (body.chatId !== undefined) {
    updateData.chat_id = body.chatId
  }
  if (body.destinationType) {
    updateData.destination_type = body.destinationType
  }
  if (body.enabled !== undefined) {
    updateData.enabled = body.enabled
  }

  // Upsert - there should be only one row
  const { data: existing } = await supabase
    .from('telegram_settings')
    .select('id')
    .single()

  if (existing) {
    const { error } = await (supabase as any)
      .from('telegram_settings')
      .update(updateData)
      .eq('id', (existing as any).id)

    if (error) {
      return NextResponse.json({ error: 'Gagal menyimpan pengaturan.' }, { status: 500 })
    }
  } else {
    const { error } = await (supabase as any)
      .from('telegram_settings')
      .insert(updateData)

    if (error) {
      return NextResponse.json({ error: 'Gagal menyimpan pengaturan.' }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true, message: 'Pengaturan Telegram berhasil disimpan.' })
}
