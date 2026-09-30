import { Metadata } from 'next';
import Link from 'next/link';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight, FolderOpen } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Program Kerja | OSIS SMA Negeri 14 Samarinda',
  description: 'Daftar program kerja OSIS SMA Negeri 14 Samarinda.',
};

export default async function ProgramKerjaPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const supabase = await createClient();
  const currentStatus = searchParams?.status || 'semua';

  // Fetch active period
  const { data: periodData } = await supabase
    .from('periods')
    .select('id, name')
    .eq('is_active', true)
    .single();

  const activePeriodId = periodData?.id;

  let query = supabase
    .from('programs')
    .select('id, title, category, status, date, image_url')
    .eq('published', true)
    .order('order_index', { ascending: true })
    .order('date', { ascending: true });

  if (activePeriodId) {
    query = query.eq('period_id', activePeriodId);
  }

  if (currentStatus !== 'semua') {
    query = query.eq('status', currentStatus as any);
  }

  const { data: programs = [] } = await query;

  const filters = [
    { label: 'Semua', value: 'semua' },
    { label: 'Akan Datang', value: 'akan_datang' },
    { label: 'Berlangsung', value: 'berlangsung' },
    { label: 'Selesai', value: 'selesai' },
  ];

  return (
    <div className="flex flex-col w-full pb-20">
      <section className="bg-secondary/30 pt-32 pb-20">
        <div className="container-editorial">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Program Kerja</h1>
            <p className="text-lg text-primary/70 max-w-2xl">
              Inisiatif dan kegiatan yang kami selenggarakan untuk seluruh siswa SMAN 14 Samarinda.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-editorial">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-12">
            {filters.map((filter) => (
              <Link key={filter.value} href={`/program-kerja${filter.value === 'semua' ? '' : `?status=${filter.value}`}`}>
                <Badge 
                  variant={currentStatus === filter.value ? 'default' : 'outline'} 
                  className="text-sm px-4 py-1.5 cursor-pointer hover:bg-primary/90"
                >
                  {filter.label}
                </Badge>
              </Link>
            ))}
          </div>

          {programs && programs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
              {programs.map((program, i) => (
                <ScrollReveal key={program.id} delay={i * 0.1}>
                  <Link href={`/program-kerja/${program.id}`} className="group relative block w-full h-full rounded-2xl overflow-hidden bg-secondary border border-secondary group-hover:shadow-lg transition-all">
                    {program.image_url && (
                      <img src={program.image_url} alt={program.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    )}
                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/30 transition-colors"></div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-primary/90 via-primary/40 to-transparent">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md">
                          {program.category || 'Umum'}
                        </Badge>
                        <Badge variant="outline" className="border-white/40 text-white backdrop-blur-md capitalize">
                          {program.status?.replace('_', ' ')}
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-secondary transition-colors line-clamp-2">
                        {program.title}
                      </h3>
                      <div className="flex items-center justify-between text-white/80">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{program.date ? formatDate(program.date) : 'TBA'}</span>
                        </div>
                        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center bg-secondary/10 rounded-3xl border border-secondary/30">
              <FolderOpen className="w-16 h-16 text-primary/30 mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">Belum Ada Program Kerja</h3>
              <p className="text-primary/60 max-w-md">
                {currentStatus === 'semua' 
                  ? 'Program kerja untuk periode ini sedang dalam tahap penyusunan atau belum dipublikasikan.' 
                  : `Belum ada program kerja dengan status "${currentStatus.replace('_', ' ')}".`}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
