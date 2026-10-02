import Link from 'next/link';
import { Globe, Send, Play, MessageCircle, Link as LinkIcon, Camera, MessageSquare } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export async function Footer() {
  const supabase = await createClient();
  
  // Fetch active period
  const { data: periodData } = await supabase
    .from('periods')
    .select('name')
    .eq('is_active', true)
    .single();

  // Fetch site settings
  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['site_name', 'site_description']);

  let siteName = 'OSIS SMA NEGERI 14 SAMARINDA';
  let siteDesc = 'Mewujudkan siswa-siswi yang berkarakter, kreatif, dan inovatif melalui berbagai program kerja dan kegiatan ekstrakurikuler.';

  if (settingsData) {
    const nameSetting = settingsData.find(s => s.key === 'site_name');
    if (nameSetting && nameSetting.value) siteName = nameSetting.value as string;

    const descSetting = settingsData.find(s => s.key === 'site_description');
    if (descSetting && descSetting.value) siteDesc = descSetting.value as string;
  }

  // Fetch social links
  const { data: socials } = await supabase
    .from('social_links')
    .select('platform, url')
    .eq('enabled', true)
    .order('order_index', { ascending: true });

  const getIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('instagram')) return <Camera className="w-5 h-5" />;
    if (p.includes('youtube')) return <Play className="w-5 h-5" />;
    if (p.includes('twitter') || p.includes('x')) return <MessageSquare className="w-5 h-5" />;
    if (p.includes('facebook')) return <Globe className="w-5 h-5" />;
    if (p.includes('telegram')) return <Send className="w-5 h-5" />;
    return <LinkIcon className="w-5 h-5" />;
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-primary text-white pt-24 pb-12 overflow-hidden">
      {/* Wavy separator top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none transform rotate-180">
        <svg
          className="relative block w-full h-[50px] md:h-[80px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-white"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 relative rounded-full overflow-hidden shadow-md flex-shrink-0 border-2 border-white/20 bg-white">
                <img 
                  src="/logo-osis.jpg" 
                  alt="Logo OSIS SMAN 14" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h2 className="font-heading font-extrabold text-3xl md:text-4xl tracking-tight">
                {siteName}
              </h2>
            </div>
            <p className="text-secondary/70 font-medium tracking-widest uppercase mb-6 text-sm">
              {periodData?.name ? `Periode ${periodData.name}` : 'Website Resmi OSIS'}
            </p>
            <p className="text-white/70 max-w-md mb-8 leading-relaxed whitespace-pre-line">
              {siteDesc}
            </p>
            
            {socials && socials.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {socials.map((social, idx) => (
                  <a 
                    key={idx} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" 
                    aria-label={social.platform}
                  >
                    {getIcon(social.platform)}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 lg:col-start-8">
            <h3 className="font-heading font-bold text-lg mb-6">Navigasi</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/" className="text-white/70 hover:text-white transition-colors">Beranda</Link></li>
              <li><Link href="/tentang" className="text-white/70 hover:text-white transition-colors">Tentang Kami</Link></li>
              <li><Link href="/program-kerja" className="text-white/70 hover:text-white transition-colors">Program Kerja</Link></li>
              <li><Link href="/kepengurusan" className="text-white/70 hover:text-white transition-colors">Kepengurusan</Link></li>
              <li><Link href="/kalender" className="text-white/70 hover:text-white transition-colors">Kalender</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-heading font-bold text-lg mb-6">Aspirasi & Layanan</h3>
            <ul className="flex flex-col gap-3 mb-8">
              <li><Link href="/w-spiras" className="text-white/70 hover:text-white transition-colors font-medium">W-SPIRAS (Wadah Aspirasi)</Link></li>
              <li><Link href="/ekstrakurikuler" className="text-white/70 hover:text-white transition-colors">Ekstrakurikuler</Link></li>
              <li><Link href="/dokumentasi" className="text-white/70 hover:text-white transition-colors">Dokumentasi</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm text-center md:text-left">
            &copy; {currentYear} {siteName}. All rights reserved.
          </p>
          <div className="text-white/50 text-sm">
            Dibuat dengan {'\u2764\uFE0F'} oleh Tim MEDKOM OSIS
          </div>
        </div>
      </div>
    </footer>
  );
}
