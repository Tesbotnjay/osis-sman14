'use server';

export async function testTelegramConnection(botToken: string, chatId: string) {
  if (!botToken || !chatId) {
    return { success: false, message: 'Bot Token dan Chat ID harus diisi.' };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: '👋 *Test Connection*\n\nIni adalah pesan percobaan dari sistem OSIS SMA Negeri 14 Samarinda. Jika Anda menerima pesan ini, artinya integrasi Telegram berhasil!',
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json();

    if (response.ok && data.ok) {
      return { success: true, message: 'Pesan berhasil dikirim! Silakan periksa Telegram Anda.' };
    } else {
      return { 
        success: false, 
        message: data.description || 'Gagal mengirim pesan. Pastikan Bot Token dan Chat ID sudah benar.' 
      };
    }
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || 'Terjadi kesalahan saat menghubungi API Telegram.' 
    };
  }
}
