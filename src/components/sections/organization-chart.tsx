import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';

interface OrgChartProps {
  activePeriodId?: string | null;
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

  // ==========================================
  //  Flatten the linear top chain:
  //  e.g. Pembina → Ketua → Wakil (each has only 1 child)
  //  Then the first node with multiple children becomes the "branch point"
  // ==========================================
  const flattenLinearChain = (root: Position): { chain: Position[]; branchNode: Position | null } => {
    const chain: Position[] = [];
    let current: Position | null = root;

    while (current) {
      chain.push(current);
      if (current.children && current.children.length === 1) {
        current = current.children[0];
      } else {
        break;
      }
    }

    const lastNode = chain[chain.length - 1];
    return {
      chain,
      branchNode: (lastNode.children && lastNode.children.length > 1) ? lastNode : null
    };
  };

  // ==========================================
  //  RENDER: Person card (reusable)
  // ==========================================
  const PersonCard = ({ node, size = 'md' }: { node: Position; size?: 'lg' | 'md' | 'sm' }) => {
    const sizeClasses = {
      lg: { photo: 'w-24 h-24 md:w-28 md:h-28', name: 'text-base md:text-lg', title: 'text-xs', border: 'border-4' },
      md: { photo: 'w-16 h-16 md:w-20 md:h-20', name: 'text-sm md:text-base', title: 'text-[10px]', border: 'border-3' },
      sm: { photo: 'w-11 h-11 md:w-13 md:h-13', name: 'text-xs md:text-sm', title: 'text-[9px]', border: 'border-2' },
    };
    const s = sizeClasses[size];

    return (
      <div className="flex flex-col items-center text-center group cursor-default">
        <div className={`rounded-full ${s.border} border-white shadow-lg overflow-hidden transition-transform duration-300 group-hover:scale-105 relative ${s.photo}`}>
          {node.member?.photo_url ? (
            <Image src={node.member.photo_url} alt={node.member?.name || node.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary/30 text-[9px]">Foto</div>
          )}
        </div>
        <h4 className={`font-heading font-bold text-primary leading-tight mt-1.5 max-w-[150px] ${s.name}`}>
          {node.member?.name || 'Kosong'}
        </h4>
        <p className={`font-semibold text-primary/60 uppercase tracking-wider mt-0.5 max-w-[150px] leading-tight ${s.title}`}>
          {node.title}
        </p>
        {node.division && (
          <p className="text-[8px] md:text-[9px] text-primary/40 mt-0.5 max-w-[150px]">
            {node.division}
          </p>
        )}
      </div>
    );
  };

  // ==========================================
  //  Vertical connector line
  // ==========================================
  const VerticalLine = ({ height = 'h-6' }: { height?: string }) => (
    <div className={`w-px ${height} bg-primary/20 mx-auto`} />
  );

  // ==========================================
  //  DESKTOP RENDER
  // ==========================================
  const renderDesktop = (root: Position) => {
    const { chain, branchNode } = flattenLinearChain(root);

    return (
      <div className="flex flex-col items-center w-full">
        {/* === LINEAR CHAIN (Pembina → Ketua → Wakil) === */}
        {chain.map((node, i) => {
          const isLast = i === chain.length - 1;
          const size = i === 0 ? 'lg' as const : i === 1 ? 'md' as const : 'md' as const;
          return (
            <div key={node.id} className="flex flex-col items-center">
              {i > 0 && <VerticalLine />}
              <PersonCard node={node} size={size} />
            </div>
          );
        })}

        {/* === BRANCH POINT: multiple children === */}
        {branchNode && branchNode.children && branchNode.children.length > 0 && (
          <div className="flex flex-col items-center w-full mt-0">
            <VerticalLine height="h-8" />

            {/* Separate Pengurus Inti vs Seksi Bidang */}
            {(() => {
              const pengurusInti = branchNode.children.filter(c => c.division === 'Pengurus Inti');
              const seksiBidang = branchNode.children.filter(c => c.division !== 'Pengurus Inti');

              return (
                <div className="flex flex-col items-center w-full gap-10">
                  {/* PENGURUS INTI row */}
                  {pengurusInti.length > 0 && (
                    <div className="flex flex-col items-center w-full">
                      <div className="bg-primary/5 border border-primary/10 rounded-2xl px-6 py-2 mb-4">
                        <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">Pengurus Inti</span>
                      </div>
                      <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                        {pengurusInti.map(child => (
                          <div key={child.id} className="flex flex-col items-center">
                            <PersonCard node={child} size="md" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SEKSI BIDANG grid */}
                  {seksiBidang.length > 0 && (
                    <div className="flex flex-col items-center w-full">
                      <div className="bg-primary/5 border border-primary/10 rounded-2xl px-6 py-2 mb-6">
                        <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">Seksi Bidang</span>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 w-full max-w-5xl">
                        {seksiBidang.map(coordinator => (
                          <div key={coordinator.id} className="flex flex-col items-center bg-secondary/20 border border-secondary/40 rounded-2xl p-5 hover:shadow-md transition-shadow">
                            {/* Coordinator */}
                            <PersonCard node={coordinator} size="md" />

                            {/* Members of this division */}
                            {coordinator.children && coordinator.children.length > 0 && (
                              <div className="flex flex-col items-center w-full mt-4 pt-4 border-t border-primary/10">
                                <div className="flex flex-wrap justify-center gap-4">
                                  {coordinator.children.map(member => (
                                    <div key={member.id} className="flex flex-col items-center">
                                      <PersonCard node={member} size="sm" />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    );
  };

  // ==========================================
  //  MOBILE RENDER: Indented tree list
  // ==========================================
  const renderMobileNode = (node: Position, level: number = 0, isLast: boolean = false) => {
    const hasChildren = node.children && node.children.length > 0;
    const indent = level * 1.5;

    return (
      <div key={`mob-${node.id}`} className="relative">
        {level > 0 && (
          <>
            <div 
              className="absolute top-5 h-px bg-primary/15" 
              style={{ left: `${indent - 1.5}rem`, width: '1.5rem' }} 
            />
            {!isLast && (
              <div 
                className="absolute top-0 w-px bg-primary/15" 
                style={{ left: `${indent - 1.5}rem`, height: '100%' }} 
              />
            )}
            {isLast && (
              <div 
                className="absolute top-0 w-px bg-primary/15" 
                style={{ left: `${indent - 1.5}rem`, height: '1.25rem' }} 
              />
            )}
          </>
        )}

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
        
        {hasChildren && (
          <div className="flex flex-col gap-1.5 mt-1.5 relative">
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

        {/* Desktop: Smart layout */}
        <div className="hidden md:block mb-8">
          <ScrollReveal delay={0.1}>
            {rootPositions.map(root => (
              <div key={root.id}>{renderDesktop(root)}</div>
            ))}
          </ScrollReveal>
        </div>

        {/* Mobile: Indented tree list */}
        <div className="md:hidden flex flex-col gap-1.5 max-w-lg mx-auto mb-8 relative px-2">
          {rootPositions.map((root, i) => renderMobileNode(root, 0, i === rootPositions.length - 1))}
        </div>

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
