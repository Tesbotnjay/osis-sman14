import { Metadata } from 'next';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Image as ImageIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dokumentasi | OSIS SMA Negeri 14 Samarinda',
};

export const dynamic = 'force-dynamic';

export default async function DokumentasiPage({
  searchParams,
}: {
  searchParams: { filter?: string };
}) {
  const supabase = await createClient();
  const currentFilter = searchParams?.filter || 'Semua';

  // Fetch active period
  const { data: periodData } = await supabase
    .from('periods')
    .select('id, name')
    .eq('is_active', true)
    .single();

  const activePeriodId = periodData?.id;

  let query = supabase
    .from('gallery')
    .select('id, title, category, image_url, date')
    .eq('published', true)
    .order('date', { ascending: false });

  if (activePeriodId) {
    query = query.eq('period_id', activePeriodId);
  }

  const { data: galleryData = [] } = await query;
  const gallery = galleryData || [];

  // Extract unique categories
  const uniqueCategories = Array.from(new Set(gallery.map(g => g.category))).filter(Boolean);
  const categories = ['Semua', ...uniqueCategories];

  const filteredGallery = currentFilter === 'Semua'
    ? gallery
    : gallery.filter(g => g.category === currentFilter);

  return (
    <div className="flex flex-col w-full pb-20">
      <section className="bg-secondary/30 pt-32 pb-20">
        <div className="container-editorial">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Dokumentasi</h1>
            <p className="text-lg text-primary/70 max-w-2xl">
              Galeri foto dan video dari berbagai kegiatan yang diselenggarakan oleh OSIS periode {periodData?.name || 'aktif'}.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-editorial">
          <div className="flex flex-wrap gap-3 mb-10">
            {categories.map((cat) => (
              <Link key={cat} href={`/dokumentasi${cat === 'Semua' ? '' : `?filter=${cat}`}`}>
                <Badge 
                  variant={currentFilter === cat ? 'default' : 'outline'}
                  className="cursor-pointer text-sm px-4 py-2 hover:bg-primary/90"
                >
                  {cat}
                </Badge>
              </Link>
            ))}
          </div>

          {filteredGallery.length > 0 ? (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {filteredGallery.map((item, i) => (
                <ScrollReveal key={item.id} delay={(i % 10) * 0.1}>
                  <div className={`relative w-full ${i % 3 === 0 ? 'h-64' : i % 2 === 0 ? 'h-80' : 'h-48'} bg-secondary rounded-xl overflow-hidden group cursor-pointer border border-secondary/50`}>
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title || ''} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/50 text-primary/20">
                        <ImageIcon className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500"></div>
                    <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Badge className="w-fit mb-2 bg-white/20 backdrop-blur-md text-white border-none">{item.category || 'Umum'}</Badge>
                      <p className="text-white font-medium text-sm line-clamp-2 shadow-sm">{item.title}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center bg-secondary/10 rounded-3xl border border-secondary/30 text-center">
              <ImageIcon className="w-16 h-16 text-primary/30 mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">Belum Ada Dokumentasi</h3>
              <p className="text-primary/60 max-w-md">
                Koleksi dokumentasi untuk kategori ini belum tersedia.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
