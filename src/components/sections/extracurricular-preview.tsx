import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';

interface EkstrakurikulerProps {
  activePeriodId?: string | null;
}

export async function ExtracurricularPreview({ activePeriodId }: EkstrakurikulerProps) {
  const supabase = await createClient();
  
  let ekskuls: any[] = [];
  if (activePeriodId) {
    const { data } = await supabase
      .from('extracurriculars')
      .select('id, name, description, logo_url')
      .or(`period_id.eq.${activePeriodId},period_id.is.null`)
      .eq('active', true)
      .order('order_index', { ascending: true })
      .limit(6);
    if (data) ekskuls = data;
  }

  if (ekskuls.length === 0) {
    return (
      <section className="py-24 md:py-32 bg-primary text-white overflow-hidden relative">
        <div className="container-editorial relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <ScrollReveal>
              <h2 className="text-4xl md:text-5xl font-bold">Ekstrakurikuler</h2>
              <p className="mt-4 text-white/80 text-lg max-w-xl">
                Belum ada data ekstrakurikuler yang ditambahkan.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>
    );
  }

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
            <div className={`grid gap-4 md:gap-6 ${
              ekskuls.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
              ekskuls.length === 2 ? 'grid-cols-2' :
              ekskuls.length <= 4 ? 'grid-cols-2' :
              'grid-cols-2 md:grid-cols-3'
            }`}>
              {ekskuls.map((ekskul, index) => (
                <ScrollReveal 
                  key={ekskul.id} 
                  delay={index * 0.1}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col items-center text-center transition-colors duration-300 backdrop-blur-sm cursor-pointer group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                    {ekskul.logo_url ? (
                      <Image src={ekskul.logo_url} alt={ekskul.name} fill className="object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/20" />
                    )}
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-2">{ekskul.name}</h3>
                  <p className="text-xs text-white/50 uppercase tracking-wider line-clamp-2">
                    {ekskul.description || 'Kegiatan Ekstrakurikuler'}
                  </p>
                </ScrollReveal>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
