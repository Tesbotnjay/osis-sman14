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
  if (!activePeriodId) return null;

  const supabase = await createClient();
  
  const { data: positions } = await supabase
    .from('organization_positions')
    .select(`
      id, title, division, parent_position_id, order_index,
      member:members(name, photo_url)
    `)
    .eq('period_id', activePeriodId)
    .order('order_index', { ascending: true });

  if (!positions || positions.length === 0) {
    return (
      <section className="py-24 md:py-32 bg-secondary/30 relative text-center">
        <p className="text-primary/50">Belum ada struktur kepengurusan.</p>
      </section>
    );
  }

  // Build tree
  const positionMap = new Map<string, Position>();
  const rootPositions: Position[] = [];

  // Initialize map
  const castedPositions = positions as any[];
  castedPositions.forEach(pos => {
    positionMap.set(pos.id, {
      ...pos,
      member: pos.member ? (Array.isArray(pos.member) ? pos.member[0] : pos.member) : null,
      children: []
    } as Position);
  });

  // Link children
  positionMap.forEach(pos => {
    if (pos.parent_position_id && positionMap.has(pos.parent_position_id)) {
      positionMap.get(pos.parent_position_id)!.children!.push(pos);
    } else {
      rootPositions.push(pos);
    }
  });

  // Sort children by order_index
  const sortChildren = (pos: Position) => {
    if (pos.children && pos.children.length > 0) {
      pos.children.sort((a, b) => a.order_index - b.order_index);
      pos.children.forEach(sortChildren);
    }
  };
  rootPositions.sort((a, b) => a.order_index - b.order_index);
  rootPositions.forEach(sortChildren);

  // We only render up to 3 levels deep on homepage to prevent massive overflow
  const renderDesktopNode = (node: Position, level: number = 0) => {
    if (level > 2) return null; // Limit depth for homepage

    return (
      <div key={node.id} className="flex flex-col items-center">
        <div className="flex flex-col items-center text-center group cursor-default relative z-10 bg-secondary/30 p-2 rounded-3xl">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-slate-300 border-4 border-white shadow-xl mb-3 overflow-hidden transition-transform duration-300 group-hover:scale-105 relative">
            {node.member?.photo_url ? (
              <Image src={node.member.photo_url} alt={node.member?.name || node.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary/30 text-xs">No Photo</div>
            )}
          </div>
          <h4 className="font-heading font-bold text-base md:text-lg text-primary leading-tight">
            {node.member?.name || 'Kosong'}
          </h4>
          <p className="text-[10px] md:text-xs font-medium text-primary/70 uppercase tracking-wider mt-1 max-w-[150px]">
            {node.title} {node.division ? ` - ${node.division}` : ''}
          </p>
        </div>

        {node.children && node.children.length > 0 && level < 2 && (
          <div className="flex flex-col items-center w-full mt-[-10px]">
            {/* Vertical line down from parent */}
            <div className="w-px h-8 bg-primary/30 -z-10" />
            
            {/* Horizontal line connecting children */}
            {node.children.length > 1 && (
              <div className="w-full h-px bg-primary/30 -z-10 relative" style={{ 
                width: `calc(100% - ${100 / node.children.length}%)` 
              }} />
            )}
            
            {/* Children container */}
            <div className="flex justify-center w-full mt-4 gap-4 md:gap-8 lg:gap-12">
              {node.children.map(child => (
                <div key={child.id} className="flex flex-col items-center relative">
                  {/* Vertical line down to child (only if multiple children, otherwise parent line is enough) */}
                  {node.children!.length > 1 && <div className="w-px h-4 bg-primary/30 absolute -top-4" />}
                  {renderDesktopNode(child, level + 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMobileNode = (node: Position, level: number = 0) => {
    if (level > 2) return null;
    return (
      <div key={`mob-${node.id}`} className="flex flex-col w-full">
        <ScrollReveal delay={level * 0.1}>
          <div className="flex items-center gap-4 bg-white p-3 md:p-4 rounded-2xl shadow-sm relative z-10" style={{ marginLeft: `${level * 1.5}rem` }}>
            {/* Indentation connector */}
            {level > 0 && (
              <div className="absolute -left-4 md:-left-6 top-1/2 w-4 md:w-6 h-px bg-primary/30" />
            )}
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-slate-200 shrink-0 relative overflow-hidden border-2 border-white shadow-sm">
              {node.member?.photo_url ? (
                <Image src={node.member.photo_url} alt={node.member?.name || node.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary/20 text-[10px]">No Photo</div>
              )}
            </div>
            <div className="flex-grow">
              <h4 className="font-heading font-bold text-primary text-sm md:text-base leading-tight">
                {node.member?.name || 'Kosong'}
              </h4>
              <p className="text-[10px] md:text-xs font-medium text-primary/60 uppercase tracking-wider mt-0.5 line-clamp-1">
                {node.title} {node.division ? `- ${node.division}` : ''}
              </p>
            </div>
          </div>
        </ScrollReveal>
        
        {/* Children line container */}
        {node.children && node.children.length > 0 && level < 2 && (
          <div className="relative">
            {/* Vertical line passing through children indentations */}
            <div className="absolute left-[0.75rem] md:left-[0.375rem] top-0 bottom-6 w-px bg-primary/30" style={{ marginLeft: `${level * 1.5}rem` }} />
            <div className="flex flex-col gap-3 mt-3 relative z-10">
              {node.children.map(child => renderMobileNode(child, level + 1))}
            </div>
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
        <div className="hidden lg:flex w-full max-w-6xl mx-auto mb-16 justify-center overflow-x-auto pb-8">
          <div className="min-w-max px-8">
            <ScrollReveal delay={0.1}>
              {rootPositions.map(root => renderDesktopNode(root, 0))}
            </ScrollReveal>
          </div>
        </div>

        {/* Mobile Vertical List */}
        <div className="lg:hidden flex flex-col gap-3 max-w-md mx-auto mb-12 relative px-4">
          {rootPositions.map(root => renderMobileNode(root, 0))}
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
