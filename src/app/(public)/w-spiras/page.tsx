'use client'

import { useState } from 'react'
import { MessageSquare, Send, CheckCircle, AlertTriangle } from 'lucide-react'
import type { WspirasCategory } from '@/types/database'

const categories: { value: WspirasCategory; label: string; description: string }[] = [
  { value: 'aspirasi', label: 'Aspirasi', description: 'Harapan dan keinginan untuk kemajuan sekolah' },
  { value: 'saran', label: 'Saran', description: 'Masukan konstruktif untuk perbaikan' },
  { value: 'kritik', label: 'Kritik', description: 'Tanggapan terhadap hal yang perlu diperbaiki' },
]

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function WspirasPage() {
  const [category, setCategory] = useState<WspirasCategory | null>(null)
  const [name, setName] = useState('')
  const [kelas, setKelas] = useState('')
  const [message, setMessage] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!category) {
      setErrorMessage('Pilih kategori terlebih dahulu.')
      return
    }

    if (!message.trim() || message.trim().length < 10) {
      setErrorMessage('Pesan minimal 10 karakter.')
      return
    }

    if (message.trim().length > 2000) {
      setErrorMessage('Pesan maksimal 2000 karakter.')
      return
    }

    setFormState('loading')
    setErrorMessage('')

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const honeypot = formData.get('website') as string

      const response = await fetch('/api/w-spiras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          name: name.trim() || null,
          class: kelas.trim() || null,
          message: message.trim(),
          honeypot: honeypot || '',
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setFormState('error')
        setErrorMessage(result.error || 'Gagal mengirim. Silakan coba lagi.')
        return
      }

      setFormState('success')
      // Reset form after success
      setTimeout(() => {
        setCategory(null)
        setName('')
        setKelas('')
        setMessage('')
        setFormState('idle')
      }, 5000)
    } catch {
      setFormState('error')
      setErrorMessage('Gagal mengirim. Periksa koneksi internet Anda.')
    }
  }

  if (formState === 'success') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="font-heading text-xl font-bold text-primary mb-2">
            Terima Kasih!
          </h2>
          <p className="text-primary/60">
            Aspirasi kamu telah berhasil dikirim. Kami akan meninjau dan memproses pesan kamu.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-primary text-white py-16 px-4">
        <div className="container-editorial text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/10 mx-auto mb-4 flex items-center justify-center">
            <MessageSquare size={28} className="text-white" />
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
            W-SPIRAS
          </h1>
          <p className="text-white/70 text-lg">
            Wadah Aspirasi, Saran & Kritik
          </p>
          <p className="text-white/50 text-sm mt-2 max-w-md mx-auto">
            Sampaikan aspirasi, saran, atau kritik kamu untuk kemajuan OSIS dan sekolah.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="container-editorial py-12">
        <div className="max-w-2xl mx-auto">
          {/* Privacy Notice */}
          <div className="bg-secondary/30 rounded-xl p-4 mb-8 border border-secondary">
            <p className="text-sm text-primary/70">
              Nama dan kelas bersifat opsional. Kamu dapat mengirimkan aspirasi secara anonim.
              Identitas pengirim hanya diketahui oleh pengurus OSIS yang berwenang.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot - hidden from users */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                type="text"
                name="website"
                id="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-primary mb-3">
                Kategori <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`
                      p-4 rounded-xl border-2 text-left transition-all
                      ${category === cat.value
                        ? 'border-primary bg-primary/5'
                        : 'border-secondary hover:border-primary/30'
                      }
                    `}
                  >
                    <p className="font-heading font-bold text-primary text-sm">
                      {cat.label}
                    </p>
                    <p className="text-xs text-primary/50 mt-1">
                      {cat.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Name (optional) */}
            <div>
              <label htmlFor="wspiras-name" className="block text-sm font-medium text-primary mb-1.5">
                Nama <span className="text-primary/40">(opsional)</span>
              </label>
              <input
                id="wspiras-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama kamu"
                maxLength={100}
                className="w-full px-4 py-2.5 rounded-lg border border-secondary bg-white text-primary placeholder:text-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {/* Class (optional) */}
            <div>
              <label htmlFor="wspiras-class" className="block text-sm font-medium text-primary mb-1.5">
                Kelas <span className="text-primary/40">(opsional)</span>
              </label>
              <input
                id="wspiras-class"
                type="text"
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                placeholder="Contoh: XII IPA 1"
                maxLength={20}
                className="w-full px-4 py-2.5 rounded-lg border border-secondary bg-white text-primary placeholder:text-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="wspiras-message" className="block text-sm font-medium text-primary mb-1.5">
                Pesan <span className="text-red-500">*</span>
              </label>
              <textarea
                id="wspiras-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan aspirasi, saran, atau kritik kamu di sini..."
                rows={6}
                minLength={10}
                maxLength={2000}
                required
                className="w-full px-4 py-3 rounded-lg border border-secondary bg-white text-primary placeholder:text-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y"
              />
              <p className="text-xs text-primary/40 mt-1 text-right">
                {message.length}/2000
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={formState === 'loading' || !category || !message.trim()}
              className="w-full px-6 py-3 rounded-xl bg-primary text-white font-heading font-bold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {formState === 'loading' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Kirim
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
