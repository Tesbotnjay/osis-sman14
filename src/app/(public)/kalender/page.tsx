'use client';

import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { useState } from 'react';

const DUMMY_EVENTS = [
  { id: 1, title: 'Rapat Evaluasi Program Kerja', date: '15 Okt 2026', time: '14:00 - Selesai', location: 'Ruang OSIS', category: 'Internal' },
  { id: 2, title: 'Peringatan Hari Sumpah Pemuda', date: '28 Okt 2026', time: '07:30 - 12:00', location: 'Lapangan Utama', category: 'Acara Besar' },
  { id: 3, title: 'LDKS Calon Pengurus Baru', date: '12-14 Nov 2026', time: 'Selama 3 Hari', location: 'Bumi Perkemahan', category: 'Kaderisasi' },
  { id: 4, title: 'Class Meeting Ganjil', date: '15-18 Des 2026', time: '08:00 - 15:00', location: 'Area Sekolah', category: 'Kegiatan' },
];

export default function KalenderPage() {
  const [filter, setFilter] = useState('Semua');
  const categories = ['Semua', 'Internal', 'Acara Besar', 'Kaderisasi', 'Kegiatan'];

  return (
    <div className="flex flex-col w-full pb-20">
      <section className="bg-primary text-white pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="container-editorial relative z-10">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Kalender Kegiatan</h1>
            <p className="text-lg text-white/80 max-w-2xl">
              Agenda dan jadwal kegiatan OSIS SMAN 14 Samarinda selama satu tahun kepengurusan.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-editorial">
          <div className="flex flex-wrap gap-3 mb-10">
            {categories.map((cat) => (
              <Badge 
                key={cat} 
                variant={filter === cat ? 'default' : 'outline'}
                className="cursor-pointer px-4 py-2 text-sm"
                onClick={() => setFilter(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 lg:col-span-3">
              <div className="bg-secondary/20 p-6 rounded-2xl border border-secondary/50 sticky top-24">
                <h3 className="font-bold text-primary text-lg mb-4 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" /> Filter Bulan
                </h3>
                <div className="space-y-2">
                  {['Oktober 2026', 'November 2026', 'Desember 2026', 'Januari 2027'].map((month, i) => (
                    <button key={i} className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${i === 0 ? 'bg-primary text-white' : 'hover:bg-secondary/50 text-primary/70'}`}>
                      {month}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-8 lg:col-span-9">
              <div className="space-y-6">
                {DUMMY_EVENTS.filter(e => filter === 'Semua' || e.category === filter).map((event, i) => (
                  <ScrollReveal key={event.id} delay={i * 0.1}>
                    <div className="flex flex-col sm:flex-row gap-6 bg-white p-6 rounded-2xl border border-secondary/40 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                      <div className="absolute left-0 top-0 bottom-0 w-2 bg-secondary group-hover:bg-primary transition-colors"></div>
                      
                      <div className="sm:w-32 flex-shrink-0 flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-secondary/40 pb-4 sm:pb-0 sm:pr-6">
                        <span className="text-sm text-primary/60 font-medium">Tanggal</span>
                        <span className="text-lg font-bold text-primary">{event.date}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-xl font-bold text-primary">{event.title}</h4>
                          <Badge variant="outline" className="bg-secondary/10">{event.category}</Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 mt-4">
                          <div className="flex items-center gap-2 text-sm text-primary/70">
                            <Clock className="w-4 h-4" /> {event.time}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-primary/70">
                            <MapPin className="w-4 h-4" /> {event.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
                
                {DUMMY_EVENTS.filter(e => filter === 'Semua' || e.category === filter).length === 0 && (
                  <div className="text-center py-12 bg-secondary/10 rounded-2xl border border-secondary/30">
                    <CalendarIcon className="w-12 h-12 text-primary/20 mx-auto mb-4" />
                    <p className="text-primary/60">Tidak ada agenda untuk kategori ini.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
