import { Metadata } from 'next';
import Link from 'next/link';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Trophy, Activity, Music, Palette, Users, Monitor, Star, Globe, ShieldAlert } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Ekstrakurikuler | OSIS SMA Negeri 14 Samarinda',
};

export const dynamic = 'force-dynamic';

// Helper function to map category string to an icon (simple heuristic)
function getIconForCategory(category: string) {
  const cat = (category || '').toLowerCase();
  if (cat.includes('olahraga')) return Trophy;
  if (cat.includes('kesehatan') || cat.includes('pmr')) return Activity;
  if (cat.includes('seni') || cat.includes('tari') || cat.includes('musik')) return Music;
  if (cat.includes('paskibra') || cat.includes('wajib')) return Star;
  if (cat.includes('bahasa')) return Globe;
  if (cat.includes('komputer') || cat.includes('it')) return Monitor;
  return Users;
}

export default async function EkstrakurikulerPage() {
  const supabase = await createClient();

  // Fetch active period
  const { data: periodData } = await supabase
    .from('periods')
    .select('id, name')
    .eq('is_active', true)
    .single();

  const activePeriodId = periodData?.id;

  let extracurriculars: any[] = [];
  
  if (activePeriodId) {
    const { data } = await supabase
      .from('extracurriculars')
      .select('*')
      .eq('period_id', activePeriodId)
      .eq('active', true)
      .order('order_index', { ascending: true });

    if (data) {
      extracurriculars = data;
    }
  }

  return (
    <div className="flex flex-col w-full pb-20">
      <section className="bg-primary pt-32 pb-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')] mix-blend-overlay"></div>
        <div className="container-editorial relative z-10">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Ekstrakurikuler</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Wadah pengembangan minat, bakat, dan potensi siswa di luar jam pelajaran akademik.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding bg-secondary/10">
        <div className="container-editorial">
          {extracurriculars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {extracurriculars.map((ekskul, i) => {
                const Icon = getIconForCategory(ekskul.description || ekskul.name);
                return (
                  <ScrollReveal key={ekskul.id} delay={i * 0.1}>
                    <Link href={`/ekstrakurikuler/${ekskul.id}`} className="group relative block bg-white p-6 rounded-2xl border border-secondary/50 hover:shadow-xl hover:border-primary/20 transition-all overflow-hidden h-full">
                      {/* Optional: Add background logo if available */}
                      {ekskul.logo_url && (
                        <div className="absolute right-4 bottom-4 opacity-5 w-24 h-24 transition-opacity group-hover:opacity-10">
                          <img src={ekskul.logo_url} alt="" className="w-full h-full object-contain" />
                        </div>
                      )}
                      
                      <div className="relative z-10">
                        <div className="w-14 h-14 bg-secondary/50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary overflow-hidden">
                          {ekskul.logo_url ? (
                            <img src={ekskul.logo_url} alt={ekskul.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          ) : (
                            <Icon className="w-7 h-7" />
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-primary/80">{ekskul.name}</h3>
                        
                        <div className="mt-6 flex items-center text-sm font-semibold text-primary group-hover:text-blue-600 transition-colors">
                          Lihat Selengkapnya 
                          <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          ) : (
             <div className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-secondary/30 shadow-sm">
                <ShieldAlert className="w-16 h-16 text-primary/30 mb-4" />
                <h3 className="text-xl font-bold text-primary mb-2">Belum Ada Ekstrakurikuler</h3>
                <p className="text-primary/60 max-w-md">
                  Daftar ekstrakurikuler untuk periode ini belum ditambahkan oleh administrator.
                </p>
             </div>
          )}
        </div>
      </section>
    </div>
  );
}
