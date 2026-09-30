import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function OrganizationChart() {
  return (
    <section className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
      <div className="container-editorial relative z-10">
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <div className="inline-flex items-center gap-4 mb-6">
            <span className="w-8 h-[2px] bg-primary"></span>
            <span className="font-heading font-bold tracking-widest text-primary uppercase text-sm">
              Struktur
            </span>
            <span className="w-8 h-[2px] bg-primary"></span>
          </div>
          <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-primary tracking-tight mb-6">
            Susunan Kepengurusan
          </h2>
          <p className="text-lg text-primary/70">
            Mengenal lebih dekat para pengurus OSIS SMA Negeri 14 Samarinda Periode 2026/2027.
          </p>
        </ScrollReveal>

        {/* Desktop Pyramid Chart Placeholder */}
        <div className="hidden lg:block w-full max-w-5xl mx-auto mb-16">
          <div className="flex flex-col items-center gap-12">
            {/* Level 1 */}
            <ScrollReveal delay={0.1}>
              <div className="flex flex-col items-center text-center group cursor-pointer">
                <div className="w-32 h-32 rounded-full bg-slate-300 border-4 border-white shadow-xl mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-300" />
                <h4 className="font-heading font-bold text-xl text-primary">Budi Santoso</h4>
                <p className="text-sm font-medium text-primary/60 uppercase tracking-wider">Ketua OSIS</p>
              </div>
            </ScrollReveal>

            {/* Connecting line */}
            <div className="w-px h-8 bg-primary/20 -my-8" />

            {/* Level 2 */}
            <ScrollReveal delay={0.2} className="flex justify-center gap-32 w-full">
              <div className="flex flex-col items-center text-center group cursor-pointer relative">
                {/* Horizontal connector half */}
                <div className="absolute top-1/2 left-1/2 w-[calc(100%+8rem)] h-px bg-primary/20 -z-10" />
                <div className="w-24 h-24 rounded-full bg-slate-300 border-4 border-white shadow-xl mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-300" />
                <h4 className="font-heading font-bold text-lg text-primary">Siti Aminah</h4>
                <p className="text-xs font-medium text-primary/60 uppercase tracking-wider">Wakil Ketua I</p>
              </div>
              <div className="flex flex-col items-center text-center group cursor-pointer relative">
                <div className="absolute top-1/2 right-1/2 w-[calc(100%+8rem)] h-px bg-primary/20 -z-10" />
                <div className="w-24 h-24 rounded-full bg-slate-300 border-4 border-white shadow-xl mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-300" />
                <h4 className="font-heading font-bold text-lg text-primary">Ahmad Fauzi</h4>
                <p className="text-xs font-medium text-primary/60 uppercase tracking-wider">Wakil Ketua II</p>
              </div>
            </ScrollReveal>

            {/* Connecting lines */}
            <div className="flex justify-between w-1/2 -my-8">
              <div className="w-px h-8 bg-primary/20" />
              <div className="w-px h-8 bg-primary/20" />
            </div>

            {/* Level 3 */}
            <ScrollReveal delay={0.3} className="flex justify-between gap-8 w-full px-12">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex flex-col items-center text-center group cursor-pointer">
                  <div className="w-20 h-20 rounded-full bg-slate-300 border-4 border-white shadow-lg mb-3 overflow-hidden group-hover:scale-105 transition-transform duration-300" />
                  <h4 className="font-heading font-bold text-base text-primary">Koordinator {item}</h4>
                  <p className="text-[10px] font-medium text-primary/60 uppercase tracking-wider">Divisi {item}</p>
                </div>
              ))}
            </ScrollReveal>
          </div>
        </div>

        {/* Mobile Vertical List Placeholder */}
        <div className="lg:hidden flex flex-col gap-6 max-w-sm mx-auto mb-12">
          {['Ketua OSIS', 'Wakil Ketua I', 'Wakil Ketua II', 'Sekretaris', 'Bendahara'].map((role, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm">
                <div className="w-16 h-16 rounded-full bg-slate-200 shrink-0" />
                <div>
                  <h4 className="font-heading font-bold text-primary">Nama Pengurus</h4>
                  <p className="text-xs font-medium text-primary/60 uppercase tracking-wider">{role}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4} className="text-center">
          <Button asChild size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white font-bold">
            <Link href="/kepengurusan">
              Lihat Struktur Lengkap <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
