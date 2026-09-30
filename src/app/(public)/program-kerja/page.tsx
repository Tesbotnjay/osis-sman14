import { Metadata } from 'next';
import Link from 'next/link';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Program Kerja | OSIS SMA Negeri 14 Samarinda',
  description: 'Daftar program kerja OSIS SMA Negeri 14 Samarinda.',
};

const DUMMY_PROGRAMS = [
  { id: '1', title: 'Class Meeting Semester Ganjil', category: 'Olahraga & Seni', status: 'Selesai', date: 'Des 2026', size: 'large' },
  { id: '2', title: 'Latihan Dasar Kepemimpinan', category: 'Organisasi', status: 'Berlangsung', date: 'Okt 2026', size: 'small' },
  { id: '3', title: 'Peringatan Hari Guru', category: 'Acara Besar', status: 'Akan Datang', date: 'Nov 2026', size: 'small' },
  { id: '4', title: 'Bakti Sosial Ramadhan', category: 'Sosial', status: 'Akan Datang', date: 'Mar 2027', size: 'large' },
];

export default function ProgramKerjaPage() {
  return (
    <div className="flex flex-col w-full pb-20">
      <section className="bg-secondary/30 pt-32 pb-20">
        <div className="container-editorial">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Program Kerja</h1>
            <p className="text-lg text-primary/70 max-w-2xl">
              Inisiatif dan kegiatan yang kami selenggarakan untuk seluruh siswa SMAN 14 Samarinda.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-editorial">
          {/* Filters Placeholder */}
          <div className="flex flex-wrap gap-4 mb-12">
            {['Semua', 'Akan Datang', 'Berlangsung', 'Selesai'].map((filter, i) => (
              <Badge key={i} variant={i === 0 ? 'default' : 'outline'} className="text-sm px-4 py-1.5 cursor-pointer">
                {filter}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
            {DUMMY_PROGRAMS.map((program, i) => (
              <ScrollReveal key={program.id} delay={i * 0.1} className={program.size === 'large' ? 'md:col-span-2 lg:col-span-2' : ''}>
                <Link href={`/program-kerja/${program.id}`} className="group relative block w-full h-full rounded-2xl overflow-hidden bg-secondary border border-secondary group-hover:shadow-lg transition-all">
                  <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
                  <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-primary/90 via-primary/40 to-transparent">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md">
                        {program.category}
                      </Badge>
                      <Badge variant="outline" className="border-white/40 text-white backdrop-blur-md">
                        {program.status}
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-secondary transition-colors">
                      {program.title}
                    </h3>
                    <div className="flex items-center justify-between text-white/80">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{program.date}</span>
                      </div>
                      <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
