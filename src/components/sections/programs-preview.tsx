import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';

export function ProgramsPreview() {
  const programs = [
    {
      id: 1,
      title: "Pekan Olahraga Antar Kelas (PORAK)",
      date: "12 - 18 Agustus 2026",
      status: "Akan Datang",
      statusColor: "bg-blue-100 text-blue-700",
      featured: true,
    },
    {
      id: 2,
      title: "Latihan Dasar Kepemimpinan (LDKS)",
      date: "25 September 2026",
      status: "Akan Datang",
      statusColor: "bg-blue-100 text-blue-700",
      featured: false,
    },
    {
      id: 3,
      title: "Bakti Sosial Ramadhan",
      date: "15 April 2026",
      status: "Selesai",
      statusColor: "bg-green-100 text-green-700",
      featured: false,
    },
    {
      id: 4,
      title: "Festival Seni Budaya (FESBUD)",
      date: "10 November 2026",
      status: "Perencanaan",
      statusColor: "bg-orange-100 text-orange-700",
      featured: false,
    }
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <ScrollReveal 
              key={program.id} 
              delay={index * 0.1}
              className={program.featured ? "md:col-span-2 lg:col-span-2" : ""}
            >
              <Card className="h-full overflow-hidden border-0 bg-secondary/20 hover:bg-secondary/40 transition-colors duration-300 group cursor-pointer">
                <CardHeader className="p-0">
                  <div className={`w-full bg-slate-200 relative overflow-hidden ${program.featured ? "aspect-[21/9]" : "aspect-[4/3]"}`}>
                    {/* Image placeholder */}
                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant="default" className={`${program.statusColor} hover:${program.statusColor} border-0 shadow-none font-medium`}>
                      {program.status}
                    </Badge>
                    <div className="flex items-center text-sm text-primary/60 font-medium">
                      <Calendar className="w-4 h-4 mr-2" />
                      {program.date}
                    </div>
                  </div>
                  <h3 className={`font-heading font-bold text-primary group-hover:text-blue-700 transition-colors ${program.featured ? "text-2xl md:text-3xl lg:text-4xl" : "text-xl md:text-2xl"}`}>
                    {program.title}
                  </h3>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
