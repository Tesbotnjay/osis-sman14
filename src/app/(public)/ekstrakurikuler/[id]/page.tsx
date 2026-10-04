import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, User, Phone, MapPin, ExternalLink, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: ekskul } = await supabase
    .from('extracurriculars')
    .select('name, description')
    .eq('id', id)
    .single();

  if (!ekskul) {
    return {
      title: 'Ekstrakurikuler Tidak Ditemukan | OSIS SMA Negeri 14 Samarinda',
    };
  }

  return {
    title: `${ekskul.name} | Ekstrakurikuler OSIS SMA Negeri 14 Samarinda`,
    description: ekskul.description || `Detail ekstrakurikuler ${ekskul.name}`,
  };
}

export default async function EkstrakurikulerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: ekskul } = await supabase
    .from('extracurriculars')
    .select('*')
    .eq('id', id)
    .single();

  if (!ekskul) {
    notFound();
  }

  return (
    <div className="flex flex-col w-full pb-20">
      <div className="w-full h-[30vh] md:h-[40vh] bg-primary relative mt-20">
        {ekskul.photo_url && (
          <Image 
            src={ekskul.photo_url}
            alt={`Sampul ${ekskul.name}`}
            fill
            className="object-cover opacity-50"
          />
        )}
        <div className="absolute top-6 left-6 md:left-12 lg:left-24 z-10">
          <Link href="/ekstrakurikuler" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-colors text-sm font-medium border border-white/20">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
        </div>
      </div>

      <div className="container-editorial -mt-24 md:-mt-32 relative z-20">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-secondary/30">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl bg-white flex-shrink-0 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden relative">
                {ekskul.logo_url ? (
                  <Image 
                    src={ekskul.logo_url}
                    alt={`Logo ${ekskul.name}`}
                    fill
                    className="object-contain p-4"
                  />
                ) : (
                  <Activity className="w-16 h-16 text-primary/30" />
                )}
              </div>
              
              <div className="flex-1 w-full pt-4 md:pt-0">
                <Badge className={ekskul.active ? 'mb-3 bg-green-500' : 'mb-3 bg-red-500'}>
                  {ekskul.active ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
                
                <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4">{ekskul.name}</h1>
                
                {ekskul.description && (
                  <p className="text-lg text-primary/70 mb-8 max-w-2xl">
                    {ekskul.description}
                  </p>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-secondary/10 p-6 rounded-2xl border border-secondary/30">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-primary/60" />
                    <div>
                      <p className="text-xs text-primary/60">Pembina / Kontak</p>
                      <p className="font-semibold text-primary">{ekskul.pembina || 'Belum diisi'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary/60" />
                    <div>
                      <p className="text-xs text-primary/60">Nomor Telepon</p>
                      <p className="font-semibold text-primary">{ekskul.contact || 'Belum ada'}</p>
                    </div>
                  </div>
                  
                  {ekskul.social_links && typeof ekskul.social_links === 'object' && Object.keys(ekskul.social_links).length > 0 && (
                    <div className="flex items-center gap-3 mt-4 sm:mt-0 sm:col-span-2 lg:col-span-1">
                      {(() => {
                        const links = ekskul.social_links as any;
                        let url = '';
                        let label = 'Kunjungi Halaman';
                        
                        if (links.url) {
                          url = links.url;
                          label = links.label || 'Kunjungi Halaman';
                        } else if (links.instagram) {
                          url = links.instagram;
                          label = 'Instagram';
                        } else {
                          // Try to find any URL except gallery
                          const firstKey = Object.keys(links).filter(k => k !== 'gallery')[0];
                          if (firstKey) {
                            url = links[firstKey];
                            label = firstKey;
                          }
                        }

                        if (!url || typeof url !== 'string' || !url.startsWith('http')) return null;

                        return (
                          <Link 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-semibold text-sm shadow-sm hover:shadow"
                          >
                            <ExternalLink className="w-4 h-4" />
                            {label}
                          </Link>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* Gallery Section */}
                {ekskul.social_links && typeof ekskul.social_links === 'object' && Array.isArray((ekskul.social_links as any).gallery) && (ekskul.social_links as any).gallery.length > 0 && (
                  <div className="mt-12">
                    <h2 className="text-2xl font-bold text-primary mb-6">Gallery Kenangan</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {((ekskul.social_links as any).gallery as string[]).map((url, i) => (
                        <div key={i} className="relative aspect-square sm:aspect-video rounded-xl overflow-hidden group border border-secondary/30 shadow-sm bg-secondary/10">
                          <Image
                            src={url}
                            alt={`Gallery ${ekskul.name} ${i + 1}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            unoptimized={url.startsWith('http') && !url.includes(process.env.NEXT_PUBLIC_SUPABASE_URL || 'supabase')}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
