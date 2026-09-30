import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, User, Phone, MapPin, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

export const metadata: Metadata = {
  title: 'Detail Ekstrakurikuler | OSIS SMA Negeri 14 Samarinda',
};

export default function EkstrakurikulerDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col w-full pb-20">
      <div className="w-full h-[30vh] bg-primary relative mt-20">
        <div className="absolute top-6 left-6 md:left-12 lg:left-24 z-10">
          <Link href="/ekstrakurikuler" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-colors text-sm font-medium border border-white/20">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
        </div>
      </div>

      <div className="container-editorial -mt-24 relative z-20">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-secondary/30">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl bg-secondary flex-shrink-0 flex items-center justify-center border-4 border-white shadow-lg -mt-16 md:-mt-24">
                <span className="text-4xl text-primary/30 font-bold">LOGO</span>
              </div>
              
              <div className="flex-1">
                <Badge className="mb-3">Wajib</Badge>
                <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4">Pramuka Gudep SMAN 14</h1>
                <p className="text-lg text-primary/70 mb-8 max-w-2xl">
                  Membentuk karakter disiplin, mandiri, dan bertanggung jawab melalui kegiatan kepramukaan yang menyenangkan dan edukatif.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-secondary/10 p-6 rounded-2xl border border-secondary/30">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-primary/60" />
                    <div>
                      <p className="text-xs text-primary/60">Pembina</p>
                      <p className="font-semibold text-primary">Drs. Ahmad Yani</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary/60" />
                    <div>
                      <p className="text-xs text-primary/60">Jadwal Latihan</p>
                      <p className="font-semibold text-primary">Jumat, 14:00 - 16:00</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary/60" />
                    <div>
                      <p className="text-xs text-primary/60">Kontak (Ketua)</p>
                      <p className="font-semibold text-primary">0812-3456-7890</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ExternalLink className="w-5 h-5 text-primary/60" />
                    <div>
                      <p className="text-xs text-primary/60">Instagram</p>
                      <Link href="#" className="font-semibold text-blue-600 hover:underline">@pramukasman14smd</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 prose prose-lg max-w-none text-primary/80">
              <h3>Tentang Ekskul</h3>
              <p>
                Pramuka Gugus Depan SMA Negeri 14 Samarinda adalah ekstrakurikuler wajib bagi siswa kelas X dan ekstrakurikuler pilihan bagi kelas XI dan XII. Kami aktif dalam berbagai kegiatan kepramukaan baik di tingkat ranting, cabang, hingga daerah.
              </p>
              <h3>Program Unggulan</h3>
              <ul>
                <li>Perkemahan Jumat Sabtu Minggu (Perjusami)</li>
                <li>Latihan Gabungan Antar Sekolah</li>
                <li>Bakti Sosial dan Lingkungan</li>
                <li>Pengembaraan dan Survival Dasar</li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
