import { createClient } from '@/lib/supabase/server';
import { StatItem } from './client/stat-item';

interface StatisticsProps {
  activePeriodId: string | null;
}

export async function Statistics({ activePeriodId }: StatisticsProps) {
  const supabase = await createClient();

  // Query all data and count via .length for maximum reliability
  const membersRes = await supabase.from('members').select('id').eq('active', true);
  const ekskulRes = await supabase.from('extracurriculars').select('id').eq('active', true);
  const programsRes = await supabase.from('programs').select('id').eq('published', true);
  const eventsRes = await supabase.from('events').select('id').eq('published', true);

  // Debug: check if there are errors
  const debugInfo = {
    members: { count: membersRes.data?.length ?? 'null', error: membersRes.error?.message ?? null },
    ekskul: { count: ekskulRes.data?.length ?? 'null', error: ekskulRes.error?.message ?? null },
    programs: { count: programsRes.data?.length ?? 'null', error: programsRes.error?.message ?? null },
    events: { count: eventsRes.data?.length ?? 'null', error: eventsRes.error?.message ?? null },
  };

  const stats = [
    { label: 'Anggota Pengurus', value: membersRes.data?.length || 0 },
    { label: 'Ekstrakurikuler', value: ekskulRes.data?.length || 0 },
    { label: 'Program Kerja', value: programsRes.data?.length || 0 },
    { label: 'Kegiatan Tahunan', value: eventsRes.data?.length || 0 },
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
