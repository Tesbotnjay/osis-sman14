import { Metadata } from 'next';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Archive as ArchiveIcon, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Arsip Kepengurusan | OSIS SMA Negeri 14 Samarinda',
};

const DUMMY_PERIODS = [
  { id: '25-26', name: 'Periode 2025/2026', status: 'Demisioner', ketua: 'Andi Saputra' },
  { id: '24-25', name: 'Periode 2024/2025', status: 'Demisioner', ketua: 'Siti Aminah' },
  { id: '23-24', name: 'Periode 2023/2024', status: 'Demisioner', ketua: 'Rizky Pratama' },
];

export default function ArsipPage() {
  return (
    <div className="flex flex-col w-full pb-20">
      <section className="bg-secondary/30 pt-32 pb-20">
        <div className="container-editorial">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <ArchiveIcon className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary">Arsip OSIS</h1>
            </div>
            <p className="text-lg text-primary/70 max-w-2xl mt-4">
              Rekam jejak dan sejarah kepengurusan OSIS SMA Negeri 14 Samarinda dari masa ke masa.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-editorial">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DUMMY_PERIODS.map((period, i) => (
              <ScrollReveal key={period.id} delay={i * 0.1}>
                <div className="bg-white p-6 rounded-2xl border border-secondary/50 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all group relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-secondary/30 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="w-4 h-4 text-primary/60" />
                      <span className="text-sm font-medium text-primary/60">{period.id}</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-primary mb-2">{period.name}</h3>
                    <p className="text-primary/70 mb-6">Ketua: {period.ketua}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-secondary/50 text-primary text-xs rounded-full font-medium">
                        {period.status}
                      </span>
                      
                      <Link href={`#`} className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-blue-600 transition-colors">
                        Lihat Detail <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          
          <div className="mt-12 p-8 bg-secondary/10 rounded-2xl border border-secondary/30 text-center">
            <p className="text-primary/60 italic">Data arsip kepengurusan sebelumnya sedang dalam proses digitalisasi.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
