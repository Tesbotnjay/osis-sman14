import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Button } from '@/components/ui/button';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface GalleryProps {
  activePeriodId?: string | null;
}

export async function GalleryPreview({ activePeriodId }: GalleryProps) {
  if (!activePeriodId) return null;

  const supabase = await createClient();
  
  const { data: images } = await supabase
    .from('gallery')
    .select('id, title, date, image_url')
    .eq('period_id', activePeriodId)
    .eq('published', true)
    .order('date', { ascending: false })
    .limit(5);

  if (!images || images.length === 0) {
    return (
      <section className="py-24 md:py-32 bg-white relative text-center">
        <p className="text-primary/50">Belum ada dokumentasi kegiatan.</p>
      </section>
    );
  }

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container-editorial">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <ScrollReveal>
            <div className="inline-flex items-center gap-4 mb-4">
              <span className="w-12 h-[2px] bg-primary"></span>
              <span className="font-heading font-bold tracking-widest text-primary uppercase text-sm">
                Galeri
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-primary tracking-tight">
              Dokumentasi Kegiatan
            </h2>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <Button asChild variant="outline" className="rounded-full border-primary/20 text-primary hover:bg-primary hover:text-white px-6">
              <Link href="/dokumentasi">
                Lihat Semua Galeri <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>

        {/* Masonry-like Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {images.map((img, index) => {
            let spanClass = "col-span-1 row-span-1 aspect-square";
            if (index === 0) spanClass = "col-span-2 row-span-2 aspect-square md:aspect-auto";
            if (index === 3 || index === 4) spanClass = "col-span-2 md:col-span-1 row-span-1 aspect-[2/1] md:aspect-square";
            
            return (
              <ScrollReveal 
                key={img.id} 
                delay={index * 0.1} 
                className={`${spanClass} relative rounded-3xl overflow-hidden group cursor-pointer bg-secondary/30`}
              >
                {img.image_url ? (
                  <Image src={img.image_url} alt={img.title || 'Dokumentasi'} fill className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                ) : (
                  <div className="absolute inset-0 bg-slate-200 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform duration-700 ease-in-out">
                    <ImageIcon className="w-8 h-8 opacity-50" />
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {img.date && (
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold tracking-widest mb-2">
                      {format(new Date(img.date), 'dd MMM', { locale: id })}
                    </span>
                  )}
                  <h3 className="font-heading font-bold text-xl md:text-2xl text-white">
                    {img.title || 'Kegiatan'}
                  </h3>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
