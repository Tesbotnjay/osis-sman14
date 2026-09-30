import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, User, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

export const metadata: Metadata = {
  title: 'Detail Program Kerja | OSIS SMA Negeri 14 Samarinda',
};

export default function ProgramKerjaDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col w-full pb-20">
      {/* Hero Image / Banner */}
      <div className="w-full h-[40vh] md:h-[50vh] bg-secondary relative mt-20">
        <div className="absolute inset-0 bg-primary/20"></div>
        <div className="absolute top-6 left-6 md:left-12 lg:left-24 z-10">
          <Link href="/program-kerja" className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-colors text-sm font-medium border border-white/20">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
        </div>
      </div>

      <div className="container-editorial -mt-20 relative z-20">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-secondary/30">
          <ScrollReveal>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge>Olahraga & Seni</Badge>
              <Badge variant="outline" className="text-primary border-primary">Selesai</Badge>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-primary mb-8 leading-tight">
              Class Meeting Semester Ganjil 2026
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-6 border-y border-secondary/50 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary flex-shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-primary/60 mb-1">Tanggal</p>
                  <p className="font-medium text-primary">12 - 15 Des 2026</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-primary/60 mb-1">Lokasi</p>
                  <p className="font-medium text-primary">Lapangan SMAN 14</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary flex-shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-primary/60 mb-1">Penanggung Jawab</p>
                  <p className="font-medium text-primary">Divisi Olahraga</p>
                </div>
              </div>
            </div>

            <div className="prose prose-lg prose-blue max-w-none text-primary/80">
              <p>
                Class Meeting adalah kegiatan rutin yang dilaksanakan setiap akhir semester setelah pelaksanaan Ujian Akhir Semester (UAS). Kegiatan ini bertujuan untuk menyegarkan pikiran siswa setelah menjalani masa ujian, sekaligus menjadi ajang pencarian bakat dan silaturahmi antar kelas.
              </p>
              <h3>Cabang Perlombaan</h3>
              <ul>
                <li>Futsal Putra & Putri</li>
                <li>Bola Voli Campuran</li>
                <li>E-Sports (Mobile Legends & PUBG Mobile)</li>
                <li>Tarik Tambang</li>
                <li>Kebersihan Kelas</li>
              </ul>
              <p>
                Seluruh kelas diwajibkan untuk mengirimkan perwakilannya pada setiap cabang perlombaan. Pemenang akan mendapatkan piala bergilir dan hadiah menarik dari sekolah dan sponsor.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
