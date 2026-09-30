'use client';

import { useState } from 'react';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Badge } from '@/components/ui/badge';

const DUMMY_GALLERY = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  title: `Kegiatan Dokumentasi ${i + 1}`,
  category: i % 2 === 0 ? 'Program Kerja' : i % 3 === 0 ? 'Upacara' : 'Rapat',
  height: i % 3 === 0 ? 'h-64' : i % 2 === 0 ? 'h-80' : 'h-48'
}));

export default function DokumentasiPage() {
  const [filter, setFilter] = useState('Semua');
  const categories = ['Semua', 'Program Kerja', 'Upacara', 'Rapat'];

  return (
    <div className="flex flex-col w-full pb-20">
      <section className="bg-secondary/30 pt-32 pb-20">
        <div className="container-editorial">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Dokumentasi</h1>
            <p className="text-lg text-primary/70 max-w-2xl">
              Galeri foto dan video dari berbagai kegiatan yang diselenggarakan oleh OSIS.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-editorial">
          <div className="flex flex-wrap gap-3 mb-10">
            {categories.map((cat) => (
              <Badge 
                key={cat} 
                variant={filter === cat ? 'default' : 'outline'}
                className="cursor-pointer text-sm px-4 py-2"
                onClick={() => setFilter(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>

          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {DUMMY_GALLERY.filter(item => filter === 'Semua' || item.category === filter).map((item, i) => (
              <ScrollReveal key={item.id} delay={(i % 10) * 0.1}>
                <div className={`relative w-full ${item.height} bg-secondary rounded-xl overflow-hidden group cursor-pointer`}>
                  <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500"></div>
                  <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Badge className="w-fit mb-2 bg-white/20 backdrop-blur-md text-white border-none">{item.category}</Badge>
                    <p className="text-white font-medium text-sm line-clamp-2">{item.title}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
