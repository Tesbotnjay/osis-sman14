import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Users, Target, Rocket } from 'lucide-react';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Tentang | OSIS SMA Negeri 14 Samarinda',
  description: 'Mengenal lebih dekat Organisasi Siswa Intra Sekolah SMA Negeri 14 Samarinda.',
};

export default function TentangPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full bg-secondary/30 pt-32 pb-20 overflow-hidden">
        <div className="container-editorial relative z-10">
          <ScrollReveal>
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
                Tentang OSIS SMAN 14 Samarinda
              </h1>
              <p className="text-lg md:text-xl text-primary/70 mb-8">
                Wadah kreativitas, kepemimpinan, dan kolaborasi untuk seluruh siswa SMA Negeri 14 Samarinda demi mewujudkan sekolah yang berprestasi dan berkarakter.
              </p>
            </div>
          </ScrollReveal>
        </div>
        
        {/* Decorative Wave/Shape */}
        <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#ffffff"></path>
          </svg>
        </div>
      </section>

      {/* What is OSIS */}
      <section className="section-padding bg-white">
        <div className="container-editorial">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <div className="relative h-[400px] rounded-2xl overflow-hidden bg-secondary">
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                  <Users className="w-24 h-24 text-primary/30" />
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <h2 className="text-3xl font-bold text-primary mb-6">Apa itu OSIS?</h2>
              <div className="space-y-4 text-primary/80">
                <p>
                  Organisasi Siswa Intra Sekolah (OSIS) adalah suatu organisasi yang berada di tingkat sekolah di Indonesia yang dimulai dari Sekolah Menengah Pertama (SMP) dan Sekolah Menengah Atas (SMA).
                </p>
                <p>
                  OSIS dikelola dan dikembangkan oleh siswa-siswa yang terpilih untuk menjadi pengurus OSIS. Organisasi ini memiliki seorang pembimbing dari guru yang dipilih oleh pihak sekolah.
                </p>
                <p>
                  Di SMAN 14 Samarinda, OSIS berperan sebagai motor penggerak berbagai kegiatan kesiswaan, mulai dari ekstrakurikuler, acara tahunan, hingga program sosial kemasyarakatan.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="section-padding bg-secondary/20">
        <div className="container-editorial">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">Visi & Misi</h2>
              <p className="mt-4 text-primary/70">Periode Kepengurusan 2026/2027</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5">
              <ScrollReveal direction="up" delay={0.1}>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-secondary/50 h-full flex flex-col">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-4">Visi</h3>
                  <p className="text-primary/80 text-lg leading-relaxed italic font-medium">
                    "Menjadikan OSIS SMAN 14 Samarinda sebagai organisasi yang proaktif, inovatif, dan berlandaskan iman serta takwa guna mewujudkan siswa-siswi yang berkarakter unggul, kreatif, dan peduli terhadap lingkungan."
                  </p>
                </div>
              </ScrollReveal>
            </div>

            <div className="md:col-span-7">
              <ScrollReveal direction="up" delay={0.2}>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-secondary/50 h-full">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Rocket className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-4">Misi</h3>
                  <ul className="space-y-4">
                    {[
                      'Meningkatkan keimanan dan ketakwaan terhadap Tuhan Yang Maha Esa melalui kegiatan keagamaan.',
                      'Menumbuhkan kedisiplinan dan tanggung jawab siswa melalui berbagai program kegiatan.',
                      'Mengoptimalkan peran serta siswa dalam kegiatan ekstrakurikuler untuk mengembangkan minat dan bakat.',
                      'Menyelenggarakan kegiatan sosial sebagai bentuk kepedulian terhadap lingkungan dan masyarakat sekitar.',
                      'Membangun sinergi yang baik antara siswa, guru, dan pihak sekolah dalam menciptakan lingkungan belajar yang kondusif.'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-primary font-bold text-sm mt-1">
                          {index + 1}
                        </span>
                        <p className="text-primary/80 pt-1">{item}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Links */}
      <section className="section-padding bg-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container-editorial relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            <ScrollReveal direction="up" delay={0.1}>
              <div className="bg-white/10 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-white/20 flex flex-col h-full">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Kepengurusan</h3>
                <p className="text-white/80 mb-8 flex-1">
                  Kenali lebih dekat para pengurus OSIS SMAN 14 Samarinda periode 2026/2027 yang berdedikasi membangun sekolah.
                </p>
                <Button asChild variant="outline" className="w-fit bg-transparent border-white text-white hover:bg-white hover:text-primary">
                  <Link href="/kepengurusan">
                    Lihat Struktur <ChevronRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={0.2}>
              <div className="bg-white/10 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-white/20 flex flex-col h-full">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Program Kerja</h3>
                <p className="text-white/80 mb-8 flex-1">
                  Jelajahi berbagai program kerja dan inisiatif yang kami rencanakan dan laksanakan selama satu periode ke depan.
                </p>
                <Button asChild variant="outline" className="w-fit bg-transparent border-white text-white hover:bg-white hover:text-primary">
                  <Link href="/program-kerja">
                    Lihat Program <ChevronRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
