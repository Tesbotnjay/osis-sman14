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
  const supabase = await createClient();
  
  let images: any[] = [];
  
  if (activePeriodId) {
    const { data } = await supabase
      .from('gallery')
      .select('id, title, date, image_url')
      .or(`period_id.eq.${activePeriodId},period_id.is.null`)
      .eq('published', true)
      .order('date', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(5);
    if (data) images = data;
  }

  if (images.length === 0) {
    return (
      <section className="py-24 md:py-32 bg-white">
        <div className="container-editorial">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <ScrollReveal>
              <div className="inline-flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <h2 className="text-4xl font-bold text-primary">Dokumentasi</h2>
              </div>
              <p className="text-lg text-primary/70 max-w-2xl">
                Belum ada dokumentasi kegiatan yang dipublikasikan.
              </p>
            </ScrollReveal>
          </div>
        </div>
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

        {/* Auto-adjusting Gallery Grid */}
        <div className={`grid gap-4 md:gap-6 ${
          images.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' :
          images.length === 2 ? 'grid-cols-2' :
          images.length === 3 ? 'grid-cols-2 md:grid-cols-3' :
          'grid-cols-2 md:grid-cols-4'
        }`}>
          {images.map((img, index) => {
            // Dynamic span classes based on total count and position
            let spanClass = 'aspect-square';
            if (images.length >= 4) {
              if (index === 0) spanClass = 'col-span-2 row-span-2 aspect-square md:aspect-auto md:min-h-[320px]';
              else spanClass = 'aspect-square';
            } else if (images.length === 3) {
              if (index === 0) spanClass = 'col-span-2 md:col-span-1 aspect-[4/3]';
              else spanClass = 'aspect-[4/3]';
            } else if (images.length === 1) {
              spanClass = 'aspect-[16/9] max-h-[400px]';
            }
            
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
