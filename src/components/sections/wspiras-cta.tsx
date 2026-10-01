import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Button } from '@/components/ui/button';
import { MessageSquare, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export async function WSpirasCTA() {
  const supabase = await createClient();
  
  // Fetch site settings
  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['wspiras_title', 'wspiras_subtitle', 'wspiras_description']);

  let title = 'Sampaikan Aspirasimu!';
  let subtitle = 'Wadah Aspirasi, Saran & Kritik (W-SPIRAS)';
  let desc = 'Kami mendengar suara kalian! Sampaikan ide, keluhan, atau saran untuk kemajuan sekolah kita. Sistem pelaporan bersifat anonim dan aman.';

  if (settingsData) {
    const titleSetting = settingsData.find(s => s.key === 'wspiras_title');
    if (titleSetting && titleSetting.value) title = titleSetting.value as string;

    const subtitleSetting = settingsData.find(s => s.key === 'wspiras_subtitle');
    if (subtitleSetting && subtitleSetting.value) subtitle = subtitleSetting.value as string;

    const descSetting = settingsData.find(s => s.key === 'wspiras_description');
    if (descSetting && descSetting.value) desc = descSetting.value as string;
  }

  // Split title if it contains a space to make the first part regular and second part colored (optional style)
  const titleParts = title.split(' ');
  const titleFirst = titleParts.length > 1 ? titleParts[0] : title;
  const titleRest = titleParts.length > 1 ? titleParts.slice(1).join(' ') : '';

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background Image / Pattern */}
      <div className="absolute inset-0 bg-primary" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
      
      {/* Organic Top Separator */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none transform rotate-180">
        <svg className="relative block w-full h-[50px] md:h-[100px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" className="fill-secondary/20" />
        </svg>
      </div>

      <div className="container-editorial relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <ScrollReveal>
            <h2 className="font-heading font-extrabold text-5xl md:text-6xl lg:text-7xl text-white tracking-tight mb-4">
              {titleFirst} <br />
              {titleRest && <span className="text-secondary">{titleRest}</span>}
            </h2>
            <p className="text-xl md:text-2xl text-white/80 font-medium mb-8 max-w-lg">
              {subtitle}
            </p>
            <p className="text-white/70 text-lg mb-10 leading-relaxed max-w-xl">
              {desc}
            </p>
            <Button 
              asChild 
              size="lg" 
              className="group rounded-full px-10 py-8 text-xl font-extrabold bg-white text-primary hover:bg-secondary/20 border-2 border-transparent hover:border-white/50 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:-translate-y-1"
            >
              <Link href="/w-spiras" className="flex items-center justify-center">
                <MessageSquare className="mr-3 w-6 h-6 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" />
                <span className="relative z-10">Mulai Suarakan</span>
                <ArrowRight className="w-6 h-6 max-w-0 opacity-0 overflow-hidden transition-all duration-300 ease-out group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-3 group-hover:translate-x-1" />
              </Link>
            </Button>
          </ScrollReveal>

          <div className="flex flex-col gap-6">
            <ScrollReveal delay={0.2} direction="left">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 md:p-8 rounded-3xl flex items-start gap-6">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center shrink-0 text-primary">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-2xl text-white mb-2">100% Anonim</h3>
                  <p className="text-white/70">Identitasmu dirahasiakan. Jangan ragu untuk jujur demi kebaikan bersama.</p>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.3} direction="left">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 md:p-8 rounded-3xl flex items-start gap-6 ml-0 md:ml-12">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center shrink-0 text-primary">
                  <Zap className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-2xl text-white mb-2">Tindak Lanjut Cepat</h3>
                  <p className="text-white/70">Laporan akan langsung diteruskan ke divisi terkait untuk segera dicarikan solusi.</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
