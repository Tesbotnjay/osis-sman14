import { createClient } from '@/lib/supabase/server';
import { StatItem } from './client/stat-item';

interface StatisticsProps {
  activePeriodId: string | null;
}

export async function Statistics({ activePeriodId }: StatisticsProps) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_statistics');

  const statsData = data || {
    members: 0,
    extracurriculars: 0,
    programs: 0,
    events: 0
  };

  const stats = [
    { label: 'Anggota Pengurus', value: statsData.members || 0 },
    { label: 'Ekstrakurikuler', value: statsData.extracurriculars || 0 },
    { label: 'Program Kerja', value: statsData.programs || 0 },
    { label: 'Kegiatan Tahunan', value: statsData.events || 0 },
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
