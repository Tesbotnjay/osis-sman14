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
                  
                  {ekskul.social_links && typeof ekskul.social_links === 'object' && Object.entries(ekskul.social_links).map(([platform, url]) => (
                    <div key={platform} className="flex items-center gap-3">
                      <ExternalLink className="w-5 h-5 text-primary/60" />
                      <div>
                        <p className="text-xs text-primary/60 capitalize">{platform}</p>
                        <Link href={url as string} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline line-clamp-1">
                          {String(url).replace(/^https?:\/\/(www\.)?/, '')}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
