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

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Sections rendering in order */}
      <Hero />
      <BroadcastTicker />
      <BackgroundSection />
      <Statistics />
      <VisionMission />
      <ProgramsPreview />
      <OrganizationChart />
      <ExtracurricularPreview />
      <AgendaPreview />
      <TimelineSection />
      <WSpirasCTA />
      <GalleryPreview />
      <LinktreeSection />
      
      <Footer />
    </main>
  );
}
