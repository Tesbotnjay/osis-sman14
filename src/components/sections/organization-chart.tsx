import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';

interface OrgChartProps {
  activePeriodId?: string | null;
  /** When true, hides the section header and "Lihat Struktur Lengkap" button */
  isFullPage?: boolean;
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

  // ============ Render a single node card ============
  const renderNodeCard = (node: Position, level: number) => {
    // Size based on level
    const photoSize = level === 0
      ? 'w-24 h-24 md:w-28 md:h-28'
      : level <= 2
        ? 'w-16 h-16 md:w-20 md:h-20'
        : 'w-12 h-12 md:w-14 md:h-14';

    const nameSize = level === 0
      ? 'text-base md:text-lg'
      : level <= 2
        ? 'text-sm'
        : 'text-xs';

    return (
      <div className="flex flex-col items-center text-center group cursor-default relative z-10 px-1">
        <div className={`rounded-full border-3 border-white shadow-lg overflow-hidden transition-transform duration-300 group-hover:scale-105 relative ${photoSize}`}>
          {node.member?.photo_url ? (
            <Image src={node.member.photo_url} alt={node.member?.name || node.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary/30 text-[9px]">Foto</div>
          )}
        </div>
        <h4 className={`font-heading font-bold text-primary leading-tight mt-1.5 max-w-[140px] ${nameSize}`}>
          {node.member?.name || 'Kosong'}
        </h4>
        <p className="text-[9px] md:text-[10px] font-semibold text-primary/60 uppercase tracking-wider mt-0.5 max-w-[140px] leading-tight">
          {node.title}
        </p>
        {node.division && (
          <p className="text-[8px] md:text-[9px] text-primary/40 mt-0.5 max-w-[140px]">
            {node.division}
          </p>
        )}
      </div>
    );
  };

  // ============ DESKTOP: Recursive tree with proper SVG-like connectors ============
  const renderDesktopTree = (node: Position, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const childCount = node.children?.length || 0;

    return (
      <div key={node.id} className="flex flex-col items-center">
        {/* The node card itself */}
        {renderNodeCard(node, level)}

        {/* Children section */}
        {hasChildren && (
          <div className="flex flex-col items-center w-full">
            {/* Vertical line going down from parent */}
            <div className="w-px h-6 bg-primary/20" />

            {childCount === 1 ? (
              /* Single child: just a straight vertical line */
              <div className="flex flex-col items-center">
                {renderDesktopTree(node.children![0], level + 1)}
              </div>
            ) : (
              /* Multiple children: horizontal branch */
              <div className="flex flex-col items-center w-full">
                {/* Container for horizontal line + children */}
                <div className="relative flex justify-center w-full">
                  {/* The children row */}
                  <div className="flex justify-center">
                    {node.children!.map((child, index) => (
                      <div key={child.id} className="flex flex-col items-center relative" style={{ minWidth: '120px' }}>
                        {/* Vertical line from horizontal bar to child */}
                        <div className="w-px h-5 bg-primary/20" />
                        
                        {/* Horizontal connector segment */}
                        {/* Left half */}
                        {index > 0 && (
                          <div className="absolute top-0 right-1/2 h-px bg-primary/20" style={{ width: '100%' }} />
                        )}
                        {/* Right half */}
                        {index < childCount - 1 && (
                          <div className="absolute top-0 left-1/2 h-px bg-primary/20" style={{ width: '100%' }} />
                        )}

                        {/* Recursively render child */}
                        {renderDesktopTree(child, level + 1)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ============ MOBILE: Vertical indented list with branch lines ============
  const renderMobileNode = (node: Position, level: number = 0, isLast: boolean = false) => {
    const hasChildren = node.children && node.children.length > 0;
    const indent = level * 1.5;

    return (
      <div key={`mob-${node.id}`} className="relative">
        {/* Connectors from parent */}
        {level > 0 && (
          <>
            {/* Horizontal branch line */}
            <div 
              className="absolute top-5 h-px bg-primary/15" 
              style={{ left: `${indent - 1.5}rem`, width: '1.5rem' }} 
            />
            {/* Vertical line continuing to next sibling */}
            {!isLast && (
              <div 
                className="absolute top-0 w-px bg-primary/15" 
                style={{ left: `${indent - 1.5}rem`, height: '100%' }} 
              />
            )}
            {/* Vertical line stopping at this node (last child) */}
            {isLast && (
              <div 
                className="absolute top-0 w-px bg-primary/15" 
                style={{ left: `${indent - 1.5}rem`, height: '1.25rem' }} 
              />
            )}
          </>
        )}

        {/* Node content */}
        <div 
          className={`flex items-center gap-3 p-2.5 rounded-xl relative z-10 transition-colors ${
            level === 0 ? 'bg-primary/5 border border-primary/10 shadow-sm' : 'bg-white/60'
          }`} 
          style={{ marginLeft: `${indent}rem` }}
        >
          <div className={`rounded-full bg-slate-200 shrink-0 relative overflow-hidden border-2 border-white shadow-sm ${
            level === 0 ? 'w-12 h-12' : 'w-9 h-9'
          }`}>
            {node.member?.photo_url ? (
              <Image src={node.member.photo_url} alt={node.member?.name || node.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary/20 text-[7px]">Foto</div>
            )}
          </div>
          <div className="flex-grow min-w-0">
            <h4 className={`font-heading font-bold text-primary leading-tight truncate ${
              level === 0 ? 'text-sm' : 'text-xs'
            }`}>
              {node.member?.name || 'Kosong'}
            </h4>
            <p className="text-[9px] font-medium text-primary/50 uppercase tracking-wider mt-0.5 truncate">
              {node.title} {node.division ? `• ${node.division}` : ''}
            </p>
          </div>
        </div>
        
        {/* Children */}
        {hasChildren && (
          <div className="flex flex-col gap-1.5 mt-1.5 relative">
            {/* Vertical line through all children */}
            <div 
              className="absolute top-0 w-px bg-primary/15" 
              style={{ left: `${indent}rem`, bottom: 0 }} 
            />
            {node.children!.map((child, i) => renderMobileNode(child, level + 1, i === node.children!.length - 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className={`relative overflow-hidden ${isFullPage ? 'py-12 md:py-16 bg-white' : 'py-24 md:py-32 bg-secondary/30'}`}>
      <div className="container-editorial relative z-10">
        {/* Only show header when NOT full page (i.e. on homepage) */}
        {!isFullPage && (
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
        )}

        {/* Desktop Tree Chart */}
        <div className="hidden lg:flex w-full justify-center overflow-x-auto pb-8 mb-8">
          <div className="min-w-max px-4">
            <ScrollReveal delay={0.1}>
              <div className="flex flex-col items-center">
                {rootPositions.map(root => renderDesktopTree(root, 0))}
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Mobile Vertical List */}
        <div className="lg:hidden flex flex-col gap-1.5 max-w-lg mx-auto mb-8 relative px-2">
          {rootPositions.map((root, i) => renderMobileNode(root, 0, i === rootPositions.length - 1))}
        </div>

        {/* Only show button when NOT full page */}
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
