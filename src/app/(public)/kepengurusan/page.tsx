import { Metadata } from 'next';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Users, User, ShieldAlert } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Kepengurusan | OSIS SMA Negeri 14 Samarinda',
};

export default async function KepengurusanPage() {
  const supabase = await createClient();

  // Fetch active period
  const { data: periodData } = await supabase
    .from('periods')
    .select('id, name')
    .eq('is_active', true)
    .single();

  const activePeriodId = periodData?.id;

  let positions: any[] = [];
  
  if (activePeriodId) {
    const { data } = await supabase
      .from('organization_positions')
      .select(`
        id, title, division, parent_position_id, order_index,
        members ( id, name, photo_url, active )
      `)
      .eq('period_id', activePeriodId)
      .order('order_index', { ascending: true });

    if (data) {
      positions = data;
    }
  }

  // Organize into tree
  const roots = positions.filter(p => !p.parent_position_id);
  const getChildren = (parentId: string) => positions.filter(p => p.parent_position_id === parentId);

  return (
    <div className="flex flex-col w-full pb-20">
      <section className="bg-secondary/30 pt-32 pb-20 text-center">
        <div className="container-editorial">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Struktur Kepengurusan</h1>
            <p className="text-lg text-primary/70 max-w-2xl mx-auto">
              Mengenal para penggerak OSIS SMA Negeri 14 Samarinda Periode {periodData?.name || '2026/2027'}.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-editorial">
          <div className="flex flex-col items-center gap-12">
            {positions.length > 0 ? (
              <div className="flex flex-col items-center w-full max-w-5xl mx-auto">
                <ScrollReveal>
                  <h2 className="text-2xl font-bold text-primary mb-12 border-b-2 border-primary/20 pb-2 text-center">Bagan Organisasi</h2>
                </ScrollReveal>
                
                {roots.map(root => (
                  <div key={root.id} className="flex flex-col items-center w-full mb-12">
                    {/* Root Node */}
                    <ScrollReveal>
                      <div className="flex flex-col items-center text-center relative z-10 bg-white p-4 rounded-xl border border-secondary/40 shadow-sm">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-secondary flex items-center justify-center mb-4 border-4 border-white shadow-lg overflow-hidden">
                          {root.members?.photo_url ? (
                            <img src={root.members.photo_url} alt={root.members.name} className="w-full h-full object-cover" />
                          ) : (
                            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-primary/40" />
                          )}
                        </div>
                        <h3 className="font-bold text-primary text-base sm:text-lg">{root.members?.name || 'Belum diisi'}</h3>
                        <p className="text-xs sm:text-sm text-primary/70 font-semibold">{root.title}</p>
                      </div>
                    </ScrollReveal>

                    {/* Children Connectors & Nodes */}
                    {getChildren(root.id).length > 0 && (
                      <div className="flex flex-col items-center w-full mt-8 relative">
                        {/* Vertical line from root */}
                        <div className="w-px h-8 bg-primary/20 absolute -top-8"></div>
                        
                        {/* Horizontal connector line if > 1 child */}
                        {getChildren(root.id).length > 1 && (
                          <div className="h-px bg-primary/20 absolute top-0 w-full" style={{
                            width: `calc(100% - (100% / ${getChildren(root.id).length}))`
                          }}></div>
                        )}

                        <div className="flex flex-wrap justify-center w-full gap-x-4 sm:gap-x-8 gap-y-12 pt-8">
                          {getChildren(root.id).map(child => (
                            <div key={child.id} className="flex flex-col items-center relative w-[140px] sm:w-[180px]">
                              {/* Vertical line to child */}
                              <div className="w-px h-8 bg-primary/20 absolute -top-8"></div>
                              
                              <ScrollReveal delay={0.1}>
                                <div className="flex flex-col items-center text-center bg-white p-3 rounded-xl border border-secondary/40 hover:shadow-md transition-shadow w-full">
                                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-secondary/50 flex items-center justify-center mb-3 border-2 border-white shadow-sm overflow-hidden">
                                    {child.members?.photo_url ? (
                                      <img src={child.members.photo_url} alt={child.members.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <User className="w-8 h-8 text-primary/40" />
                                    )}
                                  </div>
                                  <h3 className="font-bold text-primary text-sm sm:text-base line-clamp-1" title={child.members?.name}>
                                    {child.members?.name || '-'}
                                  </h3>
                                  <p className="text-xs text-primary/70 font-semibold">{child.title}</p>
                                  {child.division && (
                                    <span className="mt-1 text-[10px] uppercase tracking-wider text-primary/50 bg-secondary/30 px-2 py-0.5 rounded-full line-clamp-1 w-full">
                                      {child.division}
                                    </span>
                                  )}
                                </div>
                              </ScrollReveal>
                              
                              {/* Recursively render next level (Divisions) if needed, simplified for now */}
                              {getChildren(child.id).length > 0 && (
                                <div className="flex flex-col items-center w-full mt-6 relative">
                                  <div className="w-px h-6 bg-primary/20 absolute -top-6"></div>
                                  <div className="flex flex-col gap-4 pt-4 w-full">
                                    {getChildren(child.id).map(grandchild => (
                                      <div key={grandchild.id} className="bg-secondary/10 p-3 rounded-lg border border-secondary/50 text-center text-xs">
                                        <p className="font-bold text-primary truncate" title={grandchild.division || grandchild.title}>
                                          {grandchild.division || grandchild.title}
                                        </p>
                                        <p className="text-primary/70 mt-1 truncate" title={grandchild.members?.name}>
                                          {grandchild.members?.name || '-'}
                                        </p>
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
                ))}
              </div>
            ) : (
              <div className="py-16 w-full flex flex-col items-center justify-center bg-secondary/10 rounded-3xl border border-secondary/30 text-center">
                <ShieldAlert className="w-16 h-16 text-primary/30 mb-4" />
                <h3 className="text-xl font-bold text-primary mb-2">Struktur Belum Tersedia</h3>
                <p className="text-primary/60 max-w-md">
                  Data kepengurusan untuk periode {periodData?.name || 'aktif'} belum ditambahkan.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
