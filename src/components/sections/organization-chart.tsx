import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { OrgChartClient, type Position } from './organization-chart-client';

interface OrgChartProps {
  activePeriodId?: string | null;
  isFullPage?: boolean;
}

export async function OrganizationChart({ activePeriodId, isFullPage = false }: OrgChartProps) {
  const supabase = await createClient();
  
  let positions: any[] = [];
  
  if (activePeriodId) {
    const { data } = await supabase
      .from('organization_positions')
      .select(`
        id, title, division, parent_position_id, order_index,
        member:members(name, photo_url)
      `)
      .eq('period_id', activePeriodId)
      .order('order_index', { ascending: true });
    if (data) positions = data;
  }

  if (positions.length === 0) {
    return (
      <section className="py-24 md:py-32 bg-secondary/30 relative">
        <div className="container-editorial">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-bold text-primary">Kepengurusan</h2>
            <p className="mt-4 text-primary/70 text-lg max-w-xl">
              Belum ada struktur kepengurusan yang ditambahkan.
            </p>
          </ScrollReveal>
        </div>
      </section>
    );
  }

  // Build tree
  const positionMap = new Map<string, Position>();
  const rootPositions: Position[] = [];

  (positions as any[]).forEach(pos => {
    positionMap.set(pos.id, {
      ...pos,
      member: pos.member ? (Array.isArray(pos.member) ? pos.member[0] : pos.member) : null,
      children: []
    } as Position);
  });

  positionMap.forEach(pos => {
    if (pos.parent_position_id && positionMap.has(pos.parent_position_id)) {
      positionMap.get(pos.parent_position_id)!.children!.push(pos);
    } else {
      rootPositions.push(pos);
    }
  });

  const sortChildren = (pos: Position) => {
    if (pos.children && pos.children.length > 0) {
      pos.children.sort((a, b) => a.order_index - b.order_index);
      pos.children.forEach(sortChildren);
    }
  };
  rootPositions.sort((a, b) => a.order_index - b.order_index);
  rootPositions.forEach(sortChildren);

  return (
    <section className={`relative overflow-hidden ${isFullPage ? 'py-12 md:py-16 bg-white' : 'py-24 md:py-32 bg-secondary/30'}`}>
      <div className="container-editorial relative z-10">
        {!isFullPage && (
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <div className="inline-flex items-center gap-4 mb-6">
              <span className="w-8 h-[2px] bg-primary"></span>
              <span className="font-heading font-bold tracking-widest text-primary uppercase text-sm">Struktur</span>
              <span className="w-8 h-[2px] bg-primary"></span>
            </div>
            <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-primary tracking-tight mb-6">
              Susunan Kepengurusan
            </h2>
            <p className="text-lg text-primary/70">
              Mengenal lebih dekat para pengurus OSIS SMA Negeri 14 Samarinda.
            </p>
          </ScrollReveal>
        )}

        <ScrollReveal delay={0.1}>
          <OrgChartClient rootPositions={rootPositions} />
        </ScrollReveal>

        {!isFullPage && (
          <ScrollReveal delay={0.4} className="text-center">
            <Button asChild size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white font-bold">
              <Link href="/kepengurusan">
                Lihat Struktur Lengkap <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
