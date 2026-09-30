import { createClient } from '@/lib/supabase/server';
import { StatItem } from './client/stat-item';

interface StatisticsProps {
  activePeriodId: string | null;
}

export async function Statistics({ activePeriodId }: StatisticsProps) {
  const supabase = await createClient();

  // Query directly from tables instead of RPC for reliability
  const [membersRes, ekskulRes, programsRes, eventsRes] = await Promise.all([
    supabase
      .from('members')
      .select('id', { count: 'exact', head: true })
      .eq('active', true),
    supabase
      .from('extracurriculars')
      .select('id', { count: 'exact', head: true })
      .eq('active', true),
    supabase
      .from('programs')
      .select('id', { count: 'exact', head: true })
      .eq('published', true),
    supabase
      .from('events')
      .select('id', { count: 'exact', head: true })
      .eq('published', true),
  ]);

  const stats = [
    { label: 'Anggota Pengurus', value: membersRes.count || 0 },
    { label: 'Ekstrakurikuler', value: ekskulRes.count || 0 },
    { label: 'Program Kerja', value: programsRes.count || 0 },
    { label: 'Kegiatan Tahunan', value: eventsRes.count || 0 },
  ];

  return (
    <section className="py-20 md:py-28 bg-primary relative">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      
      <div className="container-editorial relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-white/10">
          {stats.map((stat, index) => (
            <StatItem 
              key={stat.label} 
              value={stat.value} 
              label={stat.label} 
              delay={index * 0.1} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
