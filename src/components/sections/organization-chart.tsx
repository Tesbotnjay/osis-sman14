import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';

interface OrgChartProps {
  activePeriodId?: string | null;
}

interface Position {
  id: string;
  title: string;
  division: string | null;
  parent_position_id: string | null;
  order_index: number;
  member: {
    name: string;
    photo_url: string | null;
  } | null;
  children?: Position[];
}

export async function OrganizationChart({ activePeriodId }: OrgChartProps) {
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
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <ScrollReveal>
              <h2 className="text-4xl md:text-5xl font-bold text-primary">Kepengurusan</h2>
              <p className="mt-4 text-primary/70 text-lg max-w-xl">
                Belum ada struktur kepengurusan yang ditambahkan.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>
    );
  }

  // Build tree
  const positionMap = new Map<string, Position>();
  const rootPositions: Position[] = [];

  const castedPositions = positions as any[];
  castedPositions.forEach(pos => {
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

  // ============ DESKTOP: True tree with connector lines ============
  const renderDesktopNode = (node: Position, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="flex flex-col items-center">
        {/* Node card */}
        <div className="flex flex-col items-center text-center group cursor-default relative z-10">
          <div className={`rounded-full border-4 border-white shadow-xl overflow-hidden transition-transform duration-300 group-hover:scale-105 relative ${
            level === 0 ? 'w-28 h-28 md:w-32 md:h-32' : level === 1 ? 'w-22 h-22 md:w-24 md:h-24' : 'w-16 h-16 md:w-20 md:h-20'
          }`}>
            {node.member?.photo_url ? (
              <Image src={node.member.photo_url} alt={node.member?.name || node.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary/30 text-xs">Foto</div>
            )}
          </div>
          <h4 className={`font-heading font-bold text-primary leading-tight mt-2 ${
            level === 0 ? 'text-lg md:text-xl' : level === 1 ? 'text-base' : 'text-sm'
          }`}>
            {node.member?.name || 'Kosong'}
          </h4>
          <p className="text-[10px] md:text-xs font-semibold text-primary/60 uppercase tracking-wider mt-0.5 max-w-[160px] leading-tight">
            {node.title}
          </p>
          {node.division && (
            <p className="text-[9px] md:text-[10px] text-primary/40 mt-0.5 max-w-[160px]">
              {node.division}
            </p>
          )}
        </div>

        {/* Children with connector lines */}
        {hasChildren && (
          <div className="flex flex-col items-center w-full">
            {/* Vertical line down from parent */}
            <div className="w-0.5 h-8 bg-primary/25" />
            
            {/* Horizontal branch line (only if more than 1 child) */}
            {node.children!.length > 1 && (
              <div className="relative w-full flex justify-center">
                <div className="h-0.5 bg-primary/25" style={{
                  width: `calc(100% - ${100 / node.children!.length}%)`
                }} />
              </div>
            )}

            {/* Children nodes */}
            <div className={`flex justify-center gap-3 md:gap-6 lg:gap-10 ${
              node.children!.length > 1 ? '' : 'mt-0'
            }`}>
              {node.children!.map(child => (
                <div key={child.id} className="flex flex-col items-center">
                  {/* Vertical connector line to child */}
                  <div className="w-0.5 h-6 bg-primary/25" />
                  {renderDesktopNode(child, level + 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============ MOBILE: Vertical tree with branch indicators ============
  const renderMobileNode = (node: Position, level: number = 0, isLast: boolean = false) => {
    const hasChildren = node.children && node.children.length > 0;
    const indent = level * 1.25;

    return (
      <div key={`mob-${node.id}`} className="relative">
        {/* Vertical line from parent */}
        {level > 0 && (
          <>
            {/* Horizontal branch connector */}
            <div 
              className="absolute top-6 h-0.5 bg-primary/20" 
              style={{ left: `${indent - 1.25}rem`, width: '1.25rem' }} 
            />
            {/* Vertical line continuing down */}
            {!isLast && (
              <div 
                className="absolute top-0 w-0.5 bg-primary/20" 
                style={{ left: `${indent - 1.25}rem`, height: '100%' }} 
              />
            )}
            {isLast && (
              <div 
                className="absolute top-0 w-0.5 bg-primary/20" 
                style={{ left: `${indent - 1.25}rem`, height: '1.5rem' }} 
              />
            )}
          </>
        )}

        <ScrollReveal delay={level * 0.05}>
          <div 
            className={`flex items-center gap-3 p-3 rounded-2xl relative z-10 transition-colors ${
              level === 0 ? 'bg-primary/5 border border-primary/10 shadow-sm' : 'bg-white/80'
            }`} 
            style={{ marginLeft: `${indent}rem` }}
          >
            <div className={`rounded-full bg-slate-200 shrink-0 relative overflow-hidden border-2 border-white shadow-sm ${
              level === 0 ? 'w-14 h-14' : 'w-10 h-10'
            }`}>
              {node.member?.photo_url ? (
                <Image src={node.member.photo_url} alt={node.member?.name || node.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary/20 text-[8px]">Foto</div>
              )}
            </div>
            <div className="flex-grow min-w-0">
              <h4 className={`font-heading font-bold text-primary leading-tight truncate ${
                level === 0 ? 'text-sm' : 'text-xs'
              }`}>
                {node.member?.name || 'Kosong'}
              </h4>
              <p className="text-[10px] font-medium text-primary/50 uppercase tracking-wider mt-0.5 truncate">
                {node.title} {node.division ? `• ${node.division}` : ''}
              </p>
            </div>
          </div>
        </ScrollReveal>
        
        {/* Children */}
        {hasChildren && (
          <div className="flex flex-col gap-2 mt-2 relative">
            {/* Vertical line through children */}
            <div 
              className="absolute top-0 w-0.5 bg-primary/20" 
              style={{ left: `${indent}rem`, bottom: 0 }} 
            />
            {node.children!.map((child, i) => renderMobileNode(child, level + 1, i === node.children!.length - 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
      <div className="container-editorial relative z-10">
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <div className="inline-flex items-center gap-4 mb-6">
            <span className="w-8 h-[2px] bg-primary"></span>
            <span className="font-heading font-bold tracking-widest text-primary uppercase text-sm">
              Struktur
            </span>
            <span className="w-8 h-[2px] bg-primary"></span>
          </div>
          <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-primary tracking-tight mb-6">
            Susunan Kepengurusan
          </h2>
          <p className="text-lg text-primary/70">
            Mengenal lebih dekat para pengurus OSIS SMA Negeri 14 Samarinda.
          </p>
        </ScrollReveal>

        {/* Desktop Tree Chart */}
        <div className="hidden lg:flex w-full justify-center overflow-x-auto pb-8 mb-16">
          <div className="min-w-max px-8">
            <ScrollReveal delay={0.1}>
              <div className="flex flex-col items-center gap-0">
                {rootPositions.map(root => renderDesktopNode(root, 0))}
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Mobile Vertical List */}
        <div className="lg:hidden flex flex-col gap-2 max-w-lg mx-auto mb-12 relative px-2">
          {rootPositions.map((root, i) => renderMobileNode(root, 0, i === rootPositions.length - 1))}
        </div>

        <ScrollReveal delay={0.4} className="text-center">
          <Button asChild size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white font-bold">
            <Link href="/kepengurusan">
              Lihat Struktur Lengkap <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
