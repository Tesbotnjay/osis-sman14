import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/sections/hero';
import { BroadcastTicker } from '@/components/sections/broadcast-ticker';
import { BackgroundSection } from '@/components/sections/background-section';
import { Statistics } from '@/components/sections/statistics';
import { VisionMission } from '@/components/sections/vision-mission';
import { ProgramsPreview } from '@/components/sections/programs-preview';
import { OrganizationChart } from '@/components/sections/organization-chart';
import { ExtracurricularPreview } from '@/components/sections/extracurricular-preview';
import { AgendaPreview } from '@/components/sections/agenda-preview';
import { TimelineSection } from '@/components/sections/timeline-section';
import { WSpirasCTA } from '@/components/sections/wspiras-cta';
import { GalleryPreview } from '@/components/sections/gallery-preview';
import { LinktreeSection } from '@/components/sections/linktree-section';
import { RealtimeListener } from '@/components/shared/realtime-listener';
import { createClient } from '@/lib/supabase/server';

// Always fetch fresh data from database
export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createClient();

  // Fetch active period
  const { data: periodData } = await supabase
    .from('periods')
    .select('id, name')
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();

  const activePeriodId = periodData?.id || null;

  // Fetch homepage sections configuration
  const { data: sectionsData } = await supabase
    .from('homepage_sections')
    .select('*')
    .order('order_index', { ascending: true });

  // Default ordering if db is empty (for fallback)
  const defaultSections = [
    'hero',
    'broadcast',
    'background',
    'statistics',
    'vision_mission',
    'programs',
    'organization',
    'extracurriculars',
    'agenda',
    'timeline',
    'wspiras',
    'gallery',
    'linktree'
  ];

  const orderedSections = sectionsData && sectionsData.length > 0 
    ? sectionsData.filter(s => s.visible).map(s => s.section_key)
    : defaultSections;

  return (
    <main className="min-h-screen bg-white">
      <RealtimeListener />
      <Navbar />
      
      {/* Dynamic Sections Based on Configured Order */}
      {orderedSections.map((key) => {
        switch (key) {
          case 'hero':
            return <Hero key={key} />;
          case 'broadcast':
            return <BroadcastTicker key={key} />;
          case 'background':
            return <BackgroundSection key={key} activePeriodId={activePeriodId} />;
          case 'statistics':
            return <Statistics key={key} activePeriodId={activePeriodId} />;
          case 'vision_mission':
            return <VisionMission key={key} activePeriodId={activePeriodId} />;
          case 'programs':
            return <ProgramsPreview key={key} activePeriodId={activePeriodId} />;
          case 'organization':
            return <OrganizationChart key={key} activePeriodId={activePeriodId} />;
          case 'extracurriculars':
            return <ExtracurricularPreview key={key} activePeriodId={activePeriodId} />;
          case 'agenda':
            return <AgendaPreview key={key} activePeriodId={activePeriodId} />;
          case 'timeline':
            return <TimelineSection key={key} activePeriodId={activePeriodId} />;
          case 'wspiras':
            return <WSpirasCTA key={key} />;
          case 'gallery':
            return <GalleryPreview key={key} activePeriodId={activePeriodId} />;
          case 'linktree':
            return <LinktreeSection key={key} />;
          default:
            return null;
        }
      })}
      
      <Footer />
    </main>
  );
}
