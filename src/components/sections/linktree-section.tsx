import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { ExternalLink, Globe, Music, Play } from 'lucide-react';

export function LinktreeSection() {
  const links = [
    { name: 'Instagram Resmi OSIS', icon: Globe, url: '#' },
    { name: 'Channel Youtube SPABELLA', icon: Play, url: '#' },
    { name: 'Tiktok OSIS SMAN 14', icon: Music, url: '#' },
    { name: 'Portal Siswa', icon: ExternalLink, url: '#' },
  ];

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container max-w-2xl mx-auto px-4 md:px-6">
        <ScrollReveal className="text-center mb-12">
          <div className="w-24 h-24 rounded-full bg-primary mx-auto mb-6 flex items-center justify-center text-white font-heading font-bold text-2xl shadow-xl">
            OSIS
          </div>
          <h2 className="font-heading font-extrabold text-3xl text-primary mb-2">
            @osis.sman14smd
          </h2>
          <p className="text-primary/60 font-medium">
            Ikuti media sosial kami untuk update terbaru
          </p>
        </ScrollReveal>

        <div className="flex flex-col gap-4">
          {links.map((link, index) => {
            const Icon = link.icon;
            return (
              <ScrollReveal key={index} delay={index * 0.1}>
                <a 
                  href={link.url}
                  className="flex items-center justify-between p-5 bg-white hover:bg-primary hover:text-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group border border-primary/5"
                >
                  <div className="flex items-center gap-4">
                    <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                    <span className="font-heading font-bold text-lg text-primary group-hover:text-white transition-colors">
                      {link.name}
                    </span>
                  </div>
                  <ExternalLink className="w-5 h-5 text-primary/30 group-hover:text-white/70 transition-colors" />
                </a>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
