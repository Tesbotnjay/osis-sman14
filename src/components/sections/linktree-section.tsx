import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { ExternalLink, Link as LinkIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export async function LinktreeSection() {
  const supabase = await createClient();
  
  const { data: links } = await supabase
    .from('linktree_items')
    .select('id, label, url')
    .eq('enabled', true)
    .order('order_index', { ascending: true });

  if (!links || links.length === 0) {
    return null; // Don't show linktree if empty
  }

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container max-w-2xl mx-auto px-4 md:px-6">
        <ScrollReveal className="text-center mb-12">
          <div className="w-24 h-24 rounded-full bg-primary mx-auto mb-6 flex items-center justify-center text-white font-heading font-bold text-2xl shadow-xl">
            OSIS
          </div>
          <h2 className="font-heading font-extrabold text-3xl text-primary mb-2">
            Tautan Penting
          </h2>
          <p className="text-primary/60 font-medium">
            Jelajahi informasi lebih lanjut
          </p>
        </ScrollReveal>

        <div className="flex flex-col gap-4">
          {links.map((link, index) => (
            <ScrollReveal key={link.id} delay={index * 0.1}>
              <a 
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-5 bg-white hover:bg-primary hover:text-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group border border-primary/5"
              >
                <div className="flex items-center gap-4">
                  <LinkIcon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                  <span className="font-heading font-bold text-lg text-primary group-hover:text-white transition-colors">
                    {link.label}
                  </span>
                </div>
                <ExternalLink className="w-5 h-5 text-primary/30 group-hover:text-white/70 transition-colors" />
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
