import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface ProgramsPreviewProps {
  activePeriodId?: string | null;
}

export async function ProgramsPreview({ activePeriodId }: ProgramsPreviewProps) {
  const supabase = await createClient();
  
  let programs: any[] = [];
  
  if (activePeriodId) {
    const { data: rawPrograms } = await supabase
      .from('programs')
      .select('id, title, caption, date, status, image_url, featured, order_index')
      .eq('period_id', activePeriodId)
      .eq('published', true)
      .eq('featured', true)
      .order('order_index', { ascending: true })
      .order('date', { ascending: true })
      .limit(4);
    if (rawPrograms) programs = rawPrograms;
  }

  if (programs.length === 0) {
    return (
      <section className="py-24 md:py-32 bg-white">
        <div className="container-editorial">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <ScrollReveal>
              <h2 className="text-4xl md:text-5xl font-bold text-primary">Program Kerja Unggulan</h2>
              <p className="mt-4 text-primary/70 text-lg max-w-xl">
                Belum ada program kerja unggulan yang ditambahkan.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'selesai': return 'bg-green-100 text-green-700';
      case 'berlangsung': return 'bg-orange-100 text-orange-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'selesai': return 'Selesai';
      case 'berlangsung': return 'Berlangsung';
      default: return 'Akan Datang';
    }
  };

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container-editorial">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <ScrollReveal>
            <div className="inline-flex items-center gap-4 mb-4">
              <span className="w-12 h-[2px] bg-primary"></span>
              <span className="font-heading font-bold tracking-widest text-primary uppercase text-sm">
                Inisiatif
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-primary tracking-tight">
              Program Kerja Unggulan
            </h2>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <Button asChild variant="outline" className="rounded-full border-primary/20 text-primary hover:bg-primary hover:text-white px-6">
              <Link href="/program-kerja">
                Lihat Semua Program <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
          {programs.map((program, index) => (
            <ScrollReveal 
              key={program.id} 
              delay={index * 0.1}
              className="h-full"
            >
              <Link href={`/program-kerja/${program.id}`} className="block h-full group">
                <Card className="h-full overflow-hidden border-0 bg-secondary/20 hover:bg-secondary/40 transition-all duration-300 group-hover:shadow-lg flex flex-col">
                  <CardHeader className="p-0 flex-shrink-0">
                    <div className="w-full bg-slate-200 relative overflow-hidden aspect-[4/3]">
                      {program.image_url ? (
                        <Image 
                          src={program.image_url} 
                          alt={program.title} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500 flex flex-col items-center justify-center">
                          <FolderOpen className="w-12 h-12 text-primary/20 mb-2" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 flex flex-col flex-grow">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant="default" className={`${getStatusColor(program.status)} hover:${getStatusColor(program.status)} border-0 shadow-none font-medium text-xs px-2 py-0.5`}>
                        {getStatusLabel(program.status)}
                      </Badge>
                    </div>
                    <h3 className="font-heading font-bold text-primary group-hover:text-blue-700 transition-colors mb-2 text-lg line-clamp-2">
                      {program.title}
                    </h3>
                    
                    <div className="mt-auto pt-4 border-t border-primary/5 flex items-center justify-between">
                      {program.date ? (
                        <div className="flex items-center text-xs text-primary/60 font-medium">
                          <Calendar className="w-3.5 h-3.5 mr-1.5" />
                          {format(new Date(program.date), 'dd MMM yyyy', { locale: id })}
                        </div>
                      ) : (
                        <div className="flex items-center text-xs text-primary/60 font-medium">
                          <Calendar className="w-3.5 h-3.5 mr-1.5" />
                          Belum ditentukan
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
