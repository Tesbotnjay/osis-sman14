import { Metadata } from 'next';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Kalender Kegiatan | OSIS SMA Negeri 14 Samarinda',
};

export default async function KalenderPage({
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
    .from('events')
    .select('id, title, date, start_time, end_time, location, category')
    .eq('published', true)
    .order('date', { ascending: true });

  if (activePeriodId) {
    query = query.eq('period_id', activePeriodId);
  }

  // Categories based on enum (rapat, event, program_kerja, lomba, sosial, sekolah, lainnya)
  // We will map these DB categories to the UI filters
  // We can fetch all events and filter them in the render, or filter in DB.
  // For flexibility let's fetch all and filter in JS, since we want to know what categories exist.
  const { data: eventsData = [] } = await query;
  
  const events = eventsData || [];
  
  // Extract unique categories for the filter
  const uniqueCategories = Array.from(new Set(events.map(e => e.category))).filter(Boolean);
  const categories = ['Semua', ...uniqueCategories.map(c => c.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()))];
  
  // Format filter for matching
  const normalizedFilter = currentFilter.toLowerCase().replace(' ', '_');

  const filteredEvents = currentFilter === 'Semua' 
    ? events 
    : events.filter(e => e.category === normalizedFilter);

  // Group events by month for the month filter (Mocking the UI layout)
  // Get unique months from events
  const uniqueMonths = Array.from(new Set(events.map(e => {
    if (!e.date) return '';
    const d = new Date(e.date);
    return d.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
  }))).filter(Boolean);

  return (
    <div className="flex flex-col w-full pb-20">
      <section className="bg-primary text-white pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="container-editorial relative z-10">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Kalender Kegiatan</h1>
            <p className="text-lg text-white/80 max-w-2xl">
              Agenda dan jadwal kegiatan OSIS SMAN 14 Samarinda selama periode {periodData?.name || 'satu tahun kepengurusan'}.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-editorial">
          <div className="flex flex-wrap gap-3 mb-10">
            {categories.map((cat) => (
              <Link key={cat} href={`/kalender${cat === 'Semua' ? '' : `?filter=${cat}`}`}>
                <Badge 
                  variant={currentFilter === cat ? 'default' : 'outline'}
                  className="cursor-pointer px-4 py-2 text-sm hover:bg-primary/90"
                >
                  {cat}
                </Badge>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 lg:col-span-3">
              <div className="bg-secondary/20 p-6 rounded-2xl border border-secondary/50 sticky top-24">
                <h3 className="font-bold text-primary text-lg mb-4 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" /> Filter Bulan
                </h3>
                <div className="space-y-2">
                  {uniqueMonths.length > 0 ? uniqueMonths.map((month, i) => (
                    <button key={i} className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${i === 0 ? 'bg-primary text-white' : 'hover:bg-secondary/50 text-primary/70'}`}>
                      {month}
                    </button>
                  )) : (
                    <p className="text-sm text-primary/60 italic">Belum ada bulan aktif</p>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-8 lg:col-span-9">
              <div className="space-y-6">
                {filteredEvents.map((event, i) => (
                  <ScrollReveal key={event.id} delay={i * 0.1}>
                    <div className="flex flex-col sm:flex-row gap-6 bg-white p-6 rounded-2xl border border-secondary/40 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                      <div className="absolute left-0 top-0 bottom-0 w-2 bg-secondary group-hover:bg-primary transition-colors"></div>
                      
                      <div className="sm:w-32 flex-shrink-0 flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-secondary/40 pb-4 sm:pb-0 sm:pr-6">
                        <span className="text-sm text-primary/60 font-medium">Tanggal</span>
                        <span className="text-lg font-bold text-primary">{event.date ? formatDate(event.date) : 'TBA'}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-xl font-bold text-primary">{event.title}</h4>
                          <Badge variant="outline" className="bg-secondary/10 capitalize">
                            {event.category?.replace('_', ' ') || 'Lainnya'}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 mt-4">
                          <div className="flex items-center gap-2 text-sm text-primary/70">
                            <Clock className="w-4 h-4" /> {event.start_time ? event.start_time.substring(0, 5) : ''} {event.end_time ? `- ${event.end_time.substring(0, 5)}` : (event.start_time ? '- Selesai' : 'TBA')}
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-2 text-sm text-primary/70">
                              <MapPin className="w-4 h-4" /> {event.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
                
                {filteredEvents.length === 0 && (
                  <div className="text-center py-12 bg-secondary/10 rounded-2xl border border-secondary/30">
                    <CalendarIcon className="w-12 h-12 text-primary/20 mx-auto mb-4" />
                    <p className="text-primary/60">Tidak ada agenda kegiatan yang ditemukan.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
