import 'server-only'

import CryptoJS from 'crypto-js'

const ENCRYPTION_KEY = process.env.TELEGRAM_ENCRYPTION_KEY || 'default-key-change-in-production'

/**
 * Encrypt the Telegram bot token for safe database storage.
 */
export function encryptToken(token: string): string {
  return CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString()
}

/**
 * Decrypt the Telegram bot token from database.
 */
export function decryptToken(encrypted: string): string {
  const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}

interface TelegramMessage {
  category: string
  sender: string
  class: string
  message: string
  time: string
  status: string
}

/**
 * Format W-SPIRAS notification for Telegram.
 */
function formatTelegramMessage(data: TelegramMessage): string {
  return [
    '📨 *W\\-SPIRAS BARU*',
    '',
    `*Kategori:* ${escapeMarkdown(data.category)}`,
    `*Pengirim:* ${escapeMarkdown(data.sender)}`,
    `*Kelas:* ${escapeMarkdown(data.class)}`,
    '',
    `*Pesan:*`,
    escapeMarkdown(data.message),
    '',
    `*Waktu:* ${escapeMarkdown(data.time)}`,
    `*Status:* ${escapeMarkdown(data.status)}`,
  ].join('\n')
}

/**
 * Escape MarkdownV2 special characters.
 */
function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')
}

/**
 * Send W-SPIRAS notification to Telegram.
 */
export async function sendTelegramNotification(
  botToken: string,
  chatId: string,
  data: TelegramMessage
): Promise<{ success: boolean; error?: string }> {
  try {
    const text = formatTelegramMessage(data)

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'MarkdownV2',
        }),
      }
    )

    const result = await response.json()

    if (!result.ok) {
      return {
        success: false,
        error: result.description || 'Gagal mengirim pesan Telegram.',
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Telegram error.',
    }
  }
}

/**
 * Test Telegram bot connection.
 */
export async function testTelegramConnection(
  botToken: string,
  chatId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: '✅ Koneksi Telegram berhasil\\! Ini adalah pesan uji coba dari *OSIS SMA Negeri 14 Samarinda*\\.',
          parse_mode: 'MarkdownV2',
        }),
      }
    )

    const result = await response.json()

    if (!result.ok) {
      return {
        success: false,
        error: result.description || 'Gagal terhubung ke Telegram.',
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Telegram connection error.',
    }
  }
}
