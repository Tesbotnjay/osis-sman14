import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface TimelineProps {
  activePeriodId?: string | null;
}

export async function TimelineSection({ activePeriodId }: TimelineProps) {
  const supabase = await createClient();
  
  let events: any[] = [];
  
  if (activePeriodId) {
    const { data } = await supabase
      .from('timeline_items')
      .select('id, title, description, date')
      .eq('period_id', activePeriodId)
      .eq('published', true)
      .order('order_index', { ascending: true })
      .order('date', { ascending: true });
    if (data) events = data;
  }

  if (events.length === 0) {
    return (
      <section className="py-24 md:py-32 bg-secondary/20 relative">
        <div className="container-editorial">
          <ScrollReveal className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Perjalanan OSIS</h2>
            <p className="text-primary/70 text-lg max-w-2xl mx-auto">
              Belum ada timeline kegiatan yang ditambahkan.
            </p>
          </ScrollReveal>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 md:py-32 bg-secondary/20 relative">
      <div className="container-editorial">
        <ScrollReveal className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-4 mb-4">
            <span className="w-8 h-[2px] bg-primary"></span>
            <span className="font-heading font-bold tracking-widest text-primary uppercase text-sm">
              Perjalanan
            </span>
            <span className="w-8 h-[2px] bg-primary"></span>
          </div>
          <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-primary tracking-tight">
            Timeline Periode
          </h2>
        </ScrollReveal>

        <div className="relative max-w-4xl mx-auto">
          {/* Central Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-primary/10 -translate-x-1/2 rounded-full" />

          <div className="space-y-12 md:space-y-24">
            {events.map((event, index) => {
              const isEven = index % 2 === 0;
              let dateFormatted = '';
              if (event.date) {
                dateFormatted = format(new Date(event.date), 'MMMM yyyy', { locale: id });
              }

              return (
                <div key={event.id} className="relative flex flex-col md:flex-row items-center">
                  
                  {/* Left Content */}
                  <div className={`md:w-1/2 w-full pl-12 md:pl-0 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16 md:order-2'}`}>
                    <ScrollReveal direction={isEven ? 'right' : 'left'}>
                      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-primary/5 hover:shadow-md transition-shadow">
                        {dateFormatted && (
                          <span className="inline-block py-1 px-3 rounded-full bg-secondary text-primary text-xs font-bold uppercase tracking-widest mb-4">
                            {dateFormatted}
                          </span>
                        )}
                        <h3 className="font-heading font-bold text-2xl text-primary mb-3">
                          {event.title}
                        </h3>
                        <p className="text-primary/70 font-medium whitespace-pre-line">
                          {event.description}
                        </p>
                      </div>
                    </ScrollReveal>
                  </div>

                  {/* Node */}
                  <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-white border-4 border-primary -translate-x-1/2 z-10 shadow-sm" />

                  {/* Spacer for uneven layout */}
                  <div className={`hidden md:block w-1/2 ${isEven ? 'order-2' : 'order-1'}`} />
                  
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
