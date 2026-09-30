import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';

interface BackgroundSectionProps {
  activePeriodId?: string | null;
}

export async function BackgroundSection({ activePeriodId }: BackgroundSectionProps) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('background_content')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (!data || (!data.heading && !data.content && !data.image_url)) {
    return (
      <section className="py-24 md:py-32 bg-white relative overflow-hidden">
        <div className="container-editorial">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <ScrollReveal direction="left" className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">
                Latar Belakang OSIS
              </h2>
              <div className="prose prose-lg prose-p:text-primary/70 prose-p:leading-relaxed">
                <p>Belum ada latar belakang OSIS yang ditambahkan.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    );
  }

  // Split content by double newline for paragraphs if available, else just one paragraph
  const paragraphs = data.content ? data.content.split('\n\n') : [];

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="container-editorial">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          <ScrollReveal direction="right" className="order-2 lg:order-1 relative">
            <div className="aspect-[4/5] w-full max-w-md mx-auto lg:mx-0 relative rounded-2xl overflow-hidden bg-secondary">
              {data.image_url ? (
                <Image 
                  src={data.image_url} 
                  alt="Latar Belakang OSIS" 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-slate-200" />
              )}
              
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary rounded-full mix-blend-multiply opacity-10" />
              <div className="absolute -top-6 -right-6 w-48 h-48 bg-primary rounded-full mix-blend-multiply opacity-5" />
            </div>
            
            {/* Floating badge */}
            <div className="absolute bottom-10 -right-4 lg:-right-10 bg-white p-6 rounded-2xl shadow-xl shadow-primary/5 max-w-[200px]">
              <p className="font-heading font-bold text-4xl text-primary mb-1">14</p>
              <p className="text-sm text-primary/70 leading-tight">Mewujudkan generasi emas berprestasi.</p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" className="order-1 lg:order-2 flex flex-col justify-center">
            <div className="inline-flex items-center gap-4 mb-6">
              <span className="w-12 h-[2px] bg-primary"></span>
              <span className="font-heading font-bold tracking-widest text-primary uppercase text-sm">
                Tentang Kami
              </span>
            </div>
            
            <h2 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl text-primary mb-8 leading-[1.1] tracking-tight whitespace-pre-line">
              {data.heading || 'Latar Belakang OSIS'}
            </h2>
            
            <div className="space-y-6 text-lg text-primary/80 leading-relaxed font-body">
              {paragraphs.map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
