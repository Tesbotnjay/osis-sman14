import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Button } from '@/components/ui/button';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export function GalleryPreview() {
  const images = [
    { id: 1, title: 'LDKS 2026', date: '25 Sep', size: 'large' },
    { id: 2, title: 'PORAK', date: '18 Agu', size: 'small' },
    { id: 3, title: 'HUT RI ke-81', date: '17 Agu', size: 'small' },
    { id: 4, title: 'Baksos', date: '15 Apr', size: 'medium' },
    { id: 5, title: 'Rapat Kerja', date: '10 Jan', size: 'medium' },
  ];

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
            if (img.size === 'large') spanClass = "col-span-2 row-span-2 aspect-square md:aspect-auto";
            if (img.size === 'medium') spanClass = "col-span-2 md:col-span-1 row-span-1 aspect-[2/1] md:aspect-square";
            
            return (
              <ScrollReveal 
                key={img.id} 
                delay={index * 0.1} 
                className={`${spanClass} relative rounded-3xl overflow-hidden group cursor-pointer bg-secondary/30`}
              >
                {/* Image Placeholder */}
                <div className="absolute inset-0 bg-slate-200 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform duration-700 ease-in-out">
                  <ImageIcon className="w-8 h-8 opacity-50" />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold tracking-widest mb-2">
                    {img.date}
                  </span>
                  <h3 className="font-heading font-bold text-xl md:text-2xl text-white">
                    {img.title}
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
