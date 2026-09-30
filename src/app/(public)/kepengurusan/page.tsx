import { Metadata } from 'next';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { createClient } from '@/lib/supabase/server';
import { OrganizationChart } from '@/components/sections/organization-chart';

export const metadata: Metadata = {
  title: 'Kepengurusan | OSIS SMA Negeri 14 Samarinda',
};

export default async function KepengurusanPage() {
  const supabase = await createClient();

  // Fetch active period
  const { data: periodData } = await supabase
    .from('periods')
    .select('id, name')
    .eq('is_active', true)
    .single();

  const activePeriodId = periodData?.id;

  return (
    <div className="flex flex-col w-full pb-20 bg-white">
      <section className="bg-secondary/30 pt-32 pb-10 text-center">
        <div className="container-editorial">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Struktur Kepengurusan</h1>
            <p className="text-lg text-primary/70 max-w-2xl mx-auto">
              Mengenal para penggerak OSIS SMA Negeri 14 Samarinda Periode {periodData?.name || '2026/2027'}.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Gunakan komponen OrganizationChart yang sudah mendukung tree tak terbatas */}
      <OrganizationChart activePeriodId={activePeriodId} />
    </div>
  );
}
