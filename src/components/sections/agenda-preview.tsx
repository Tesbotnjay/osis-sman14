import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface AgendaProps {
  activePeriodId?: string | null;
}

export async function AgendaPreview({ activePeriodId }: AgendaProps) {
  if (!activePeriodId) return null;

  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  const { data: agendas } = await supabase
    .from('events')
    .select('id, title, date, start_time, end_time, location')
    .eq('period_id', activePeriodId)
    .eq('published', true)
    .gte('date', today)
    .order('date', { ascending: true })
    .limit(3);

  if (!agendas || agendas.length === 0) {
    return (
      <section className="py-24 md:py-32 bg-white relative text-center">
        <p className="text-primary/50">Belum ada agenda terdekat.</p>
      </section>
    );
  }

  const formatTime = (start?: string | null, end?: string | null) => {
    if (!start) return 'Waktu belum ditentukan';
    const startFmt = start.substring(0, 5); // HH:mm
    if (!end) return `${startFmt} - Selesai`;
    const endFmt = end.substring(0, 5);
    return `${startFmt} - ${endFmt}`;
  };

  return (
    <section className="py-24 md:py-32 bg-white relative">
      <div className="container-editorial">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <ScrollReveal>
            <div className="inline-flex items-center gap-4 mb-4">
              <span className="w-12 h-[2px] bg-primary"></span>
              <span className="font-heading font-bold tracking-widest text-primary uppercase text-sm">
                Informasi
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-primary tracking-tight">
              Agenda Terdekat
            </h2>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <Button asChild variant="outline" className="rounded-full border-primary/20 text-primary hover:bg-primary hover:text-white px-6">
              <Link href="/kalender">
                Lihat Kalender <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>

        <div className="flex flex-col gap-6">
          {agendas.map((agenda, index) => {
            const dateObj = new Date(agenda.date);
            const day = format(dateObj, 'dd');
            const month = format(dateObj, 'MMMM', { locale: id });

            return (
              <ScrollReveal key={agenda.id} delay={index * 0.1}>
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 bg-secondary/10 hover:bg-secondary/30 rounded-3xl p-6 md:p-8 transition-colors duration-300 border border-primary/5 group cursor-default">
                  
                  {/* Date Display */}
                  <div className="flex flex-row md:flex-col items-center justify-center bg-white rounded-2xl p-4 md:p-6 min-w-[140px] shadow-sm group-hover:shadow-md transition-shadow">
                    <span className="font-heading font-extrabold text-4xl md:text-5xl text-primary mr-3 md:mr-0">{day}</span>
                    <span className="text-sm font-bold text-primary/70 uppercase tracking-widest">{month}</span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex flex-col justify-center flex-1">
                    <h3 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-4 group-hover:text-blue-700 transition-colors">
                      {agenda.title}
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-primary/70 font-medium">
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-primary/40 shrink-0" />
                        <span className="line-clamp-1">{agenda.location || 'Lokasi belum ditentukan'}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-primary/40 shrink-0" />
                        <span>{formatTime(agenda.start_time, agenda.end_time)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="hidden lg:flex items-center justify-center px-4">
                    <div className="w-12 h-12 rounded-full border-2 border-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white text-primary/30 transition-all duration-300">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  </div>
                  
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
