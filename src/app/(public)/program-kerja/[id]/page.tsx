import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, User, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: program } = await supabase
    .from('programs')
    .select('title, caption')
    .eq('id', id)
    .single();

  if (!program) {
    return {
      title: 'Program Tidak Ditemukan | OSIS SMA Negeri 14 Samarinda',
    };
  }

  return {
    title: `${program.title} | Program Kerja OSIS SMA Negeri 14 Samarinda`,
    description: program.caption || 'Detail program kerja OSIS SMA Negeri 14 Samarinda.',
  };
}

export default async function ProgramKerjaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: program } = await supabase
    .from('programs')
    .select('*')
    .eq('id', id)
    .single();

  if (!program) {
    notFound();
  }

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Hero Image / Banner */}
      <div className="w-full h-[40vh] md:h-[50vh] bg-secondary relative mt-20">
        {program.image_url ? (
          <Image 
            src={program.image_url} 
            alt={program.title} 
            fill 
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-primary/20"></div>
        )}
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute top-6 left-6 md:left-12 lg:left-24 z-10">
          <Link href="/program-kerja" className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-colors text-sm font-medium border border-white/20">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
        </div>
      </div>

      <div className="container-editorial -mt-20 relative z-20">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-secondary/30">
          <ScrollReveal>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {program.category && (
                <Badge>{program.category}</Badge>
              )}
              {program.status && (
                <Badge variant="outline" className="text-primary border-primary capitalize">
                  {program.status.replace('_', ' ')}
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-primary mb-8 leading-tight">
              {program.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6 border-y border-secondary/50 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary flex-shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-primary/60 mb-1">Tanggal</p>
                  <p className="font-medium text-primary">
                    {program.date ? formatDate(program.date) : 'Belum Ditentukan'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-primary/60 mb-1">Lokasi</p>
                  <p className="font-medium text-primary">
                    {program.location || 'Menyusul'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary flex-shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-primary/60 mb-1">Penanggung Jawab</p>
                  <p className="font-medium text-primary">
                    {program.responsible_person || 'Pengurus OSIS'}
                  </p>
                </div>
              </div>
            </div>

            {program.description && (
              <div className="prose prose-lg prose-blue max-w-none text-primary/80">
                <div dangerouslySetInnerHTML={{ __html: program.description.replace(/\n/g, '<br />') }} />
              </div>
            )}
            
            {!program.description && program.caption && (
              <div className="prose prose-lg prose-blue max-w-none text-primary/80">
                <p>{program.caption}</p>
              </div>
            )}
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
