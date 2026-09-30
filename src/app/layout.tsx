import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { PwaRegistrar } from '@/components/shared/pwa-registrar'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'OSIS SMA Negeri 14 Samarinda',
    template: '%s | OSIS SMA Negeri 14 Samarinda',
  },
  description: 'Website resmi OSIS SMA Negeri 14 Samarinda Periode 2026/2027. Pusat informasi, program kerja, kegiatan, dan aspirasi siswa.',
  keywords: ['OSIS', 'SMA Negeri 14', 'Samarinda', 'organisasi siswa', 'sekolah'],
  authors: [{ name: 'OSIS SMA Negeri 14 Samarinda' }],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'OSIS SMA Negeri 14 Samarinda',
    title: 'OSIS SMA Negeri 14 Samarinda',
    description: 'Website resmi OSIS SMA Negeri 14 Samarinda Periode 2026/2027',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#31487A',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${plusJakarta.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-body antialiased">
        <PwaRegistrar />
        {children}
      </body>
    </html>
  )
}
