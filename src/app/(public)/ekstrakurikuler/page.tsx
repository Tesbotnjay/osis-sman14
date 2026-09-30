import { Metadata } from 'next';
import Link from 'next/link';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Trophy, Activity, Music, Palette } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Ekstrakurikuler | OSIS SMA Negeri 14 Samarinda',
};

const DUMMY_EKSKUL = [
  { id: '1', name: 'Pramuka', category: 'Wajib', icon: Trophy },
  { id: '2', name: 'PMR', category: 'Kesehatan', icon: Activity },
  { id: '3', name: 'Paduan Suara', category: 'Seni', icon: Music },
  { id: '4', name: 'Tari Tradisional', category: 'Seni', icon: Palette },
  { id: '5', name: 'Futsal', category: 'Olahraga', icon: Trophy },
  { id: '6', name: 'Basket', category: 'Olahraga', icon: Trophy },
];

export default function EkstrakurikulerPage() {
  return (
    <div className="flex flex-col w-full pb-20">
      <section className="bg-primary pt-32 pb-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')] mix-blend-overlay"></div>
        <div className="container-editorial relative z-10">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Ekstrakurikuler</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Wadah pengembangan minat, bakat, dan potensi siswa di luar jam pelajaran akademik.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding bg-secondary/10">
        <div className="container-editorial">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DUMMY_EKSKUL.map((ekskul, i) => {
              const Icon = ekskul.icon;
              return (
                <ScrollReveal key={ekskul.id} delay={i * 0.1}>
                  <Link href={`/ekstrakurikuler/${ekskul.id}`} className="group block bg-white p-6 rounded-2xl border border-secondary/50 hover:shadow-xl hover:border-primary/20 transition-all">
                    <div className="w-14 h-14 bg-secondary/50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-primary/80">{ekskul.name}</h3>
                    <p className="text-sm text-primary/60 mb-4">Kategori: {ekskul.category}</p>
                    <p className="text-primary/80 line-clamp-2">
                      Ekstrakurikuler yang bertujuan untuk mengembangkan potensi dan bakat siswa di bidang {ekskul.category.toLowerCase()}.
                    </p>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
