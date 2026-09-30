import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

export function AgendaPreview() {
  const agendas = [
    {
      id: 1,
      day: '17',
      month: 'Agustus',
      title: 'Upacara Kemerdekaan RI ke-81',
      location: 'Lapangan Utama SMA Negeri 14',
      time: '07:00 - Selesai'
    },
    {
      id: 2,
      day: '25',
      month: 'Agustus',
      title: 'Pekan Olahraga Antar Kelas (Final)',
      location: 'Lapangan Basket',
      time: '08:00 - 15:00'
    },
    {
      id: 3,
      day: '02',
      month: 'September',
      title: 'Pemilihan Ketua OSIS',
      location: 'Aula Serbaguna',
      time: '08:00 - 12:00'
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-white relative">
      <div className="container-editorial">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <ScrollReveal>
            <div className="inline-flex items-center gap-4 mb-4">
              <span className="w-12 h-[2px] bg-primary"></span>
              <span className="font-heading font-bold tracking-widest text-primary uppercase text-sm">
                Informasi
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-primary tracking-tight">
              Agenda Terdekat
            </h2>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <Button asChild variant="outline" className="rounded-full border-primary/20 text-primary hover:bg-primary hover:text-white px-6">
              <Link href="/kalender">
                Lihat Kalender <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>

        <div className="flex flex-col gap-6">
          {agendas.map((agenda, index) => (
            <ScrollReveal key={agenda.id} delay={index * 0.1}>
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 bg-secondary/10 hover:bg-secondary/30 rounded-3xl p-6 md:p-8 transition-colors duration-300 border border-primary/5 group">
                
                {/* Date Display */}
                <div className="flex flex-row md:flex-col items-center justify-center bg-white rounded-2xl p-4 md:p-6 min-w-[140px] shadow-sm group-hover:shadow-md transition-shadow">
                  <span className="font-heading font-extrabold text-4xl md:text-5xl text-primary mr-3 md:mr-0">{agenda.day}</span>
                  <span className="text-sm font-bold text-primary/70 uppercase tracking-widest">{agenda.month}</span>
                </div>
                
                {/* Content */}
                <div className="flex flex-col justify-center flex-1">
                  <h3 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-4 group-hover:text-blue-700 transition-colors">
                    {agenda.title}
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-primary/70 font-medium">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-primary/40" />
                      {agenda.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-primary/40" />
                      {agenda.time}
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden lg:flex items-center justify-center px-4">
                  <div className="w-12 h-12 rounded-full border-2 border-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white text-primary/30 transition-all duration-300">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                </div>
                
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
