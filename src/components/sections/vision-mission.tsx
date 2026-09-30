import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Quote } from 'lucide-react';

export function VisionMission() {
  const missions = [
    "Meningkatkan keimanan dan ketaqwaan siswa terhadap Tuhan Yang Maha Esa.",
    "Menumbuhkan rasa kekeluargaan dan kepedulian sosial antar siswa.",
    "Mengembangkan potensi akademik maupun non-akademik siswa melalui program yang inovatif.",
    "Menciptakan lingkungan sekolah yang bersih, sehat, dan kondusif."
  ];

  return (
    <section className="py-24 md:py-32 bg-secondary/30 relative">
      <div className="container-editorial">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start">
          
          {/* Vision */}
          <ScrollReveal direction="up" className="lg:col-span-5 flex flex-col">
            <div className="inline-flex items-center gap-4 mb-6">
              <span className="w-12 h-[2px] bg-primary"></span>
              <span className="font-heading font-bold tracking-widest text-primary uppercase text-sm">
                Arah & Tujuan
              </span>
            </div>
            
            <h2 className="font-heading font-extrabold text-5xl lg:text-6xl text-primary mb-12 tracking-tight">
              Visi Kami
            </h2>
            
            <div className="relative">
              <Quote className="absolute -top-8 -left-6 w-16 h-16 text-primary/10 rotate-180" />
              <p className="font-heading text-2xl md:text-3xl lg:text-4xl text-primary leading-tight font-medium z-10 relative">
                "Menjadikan OSIS SMA Negeri 14 Samarinda sebagai organisasi yang progresif, inklusif, dan berdedikasi dalam mencetak generasi unggul."
              </p>
            </div>
          </ScrollReveal>

          {/* Spacer for desktop */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Mission */}
          <ScrollReveal direction="up" delay={0.2} className="lg:col-span-6 bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-primary/5">
            <h2 className="font-heading font-extrabold text-4xl text-primary mb-10 tracking-tight">
              Misi Kami
            </h2>
            
            <ul className="space-y-8">
              {missions.map((mission, index) => (
                <li key={index} className="flex gap-6 items-start group">
                  <span className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-heading font-bold text-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    {index + 1}
                  </span>
                  <p className="text-lg text-primary/80 leading-relaxed font-medium pt-2">
                    {mission}
                  </p>
                </li>
              ))}
            </ul>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
