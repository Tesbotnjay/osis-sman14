import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function ExtracurricularPreview() {
  const ekskuls = [
    { name: 'Pramuka', desc: 'Praja Muda Karana' },
    { name: 'PMR', desc: 'Palang Merah Remaja' },
    { name: 'Paskibra', desc: 'Pasukan Pengibar Bendera' },
    { name: 'Rohis', desc: 'Kerohanian Islam' },
    { name: 'Futsal', desc: 'Olahraga Futsal' },
    { name: 'KIR', desc: 'Karya Ilmiah Remaja' }
  ];

  return (
    <section className="py-24 md:py-32 bg-primary text-white overflow-hidden relative">
      {/* Decorative SVG */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-current">
          <polygon points="100,0 100,100 0,100" />
        </svg>
      </div>

      <div className="container-editorial relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <ScrollReveal className="lg:col-span-5">
            <div className="inline-flex items-center gap-4 mb-6">
              <span className="w-12 h-[2px] bg-white/50"></span>
              <span className="font-heading font-bold tracking-widest text-white/70 uppercase text-sm">
                Pengembangan Diri
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
              Ekstrakurikuler
            </h2>
            <p className="text-lg text-white/70 mb-10 leading-relaxed font-medium">
              Temukan minat dan bakatmu melalui berbagai pilihan kegiatan ekstrakurikuler yang tersedia di SMA Negeri 14 Samarinda. Jadilah bagian dari komunitas yang inspiratif!
            </p>
            <Button asChild size="lg" variant="secondary" className="rounded-full px-8 bg-white text-primary hover:bg-white/90 font-bold">
              <Link href="/ekstrakurikuler">
                Lihat Semua Ekskul <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </ScrollReveal>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {ekskuls.map((ekskul, index) => (
                <ScrollReveal 
                  key={index} 
                  delay={index * 0.1}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col items-center text-center transition-colors duration-300 backdrop-blur-sm cursor-pointer group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {/* Placeholder icon/logo */}
                    <div className="w-8 h-8 rounded-full bg-white/20" />
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-2">{ekskul.name}</h3>
                  <p className="text-xs text-white/50 uppercase tracking-wider">{ekskul.desc}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
