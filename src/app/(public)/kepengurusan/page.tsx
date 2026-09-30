import { Metadata } from 'next';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kepengurusan | OSIS SMA Negeri 14 Samarinda',
};

export default function KepengurusanPage() {
  return (
    <div className="flex flex-col w-full pb-20">
      <section className="bg-secondary/30 pt-32 pb-20 text-center">
        <div className="container-editorial">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Struktur Kepengurusan</h1>
            <p className="text-lg text-primary/70 max-w-2xl mx-auto">
              Mengenal para penggerak OSIS SMA Negeri 14 Samarinda Periode 2026/2027.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-editorial">
          <div className="flex flex-col items-center gap-12">
            {/* Inti */}
            <ScrollReveal>
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold text-primary mb-8 border-b-2 border-primary/20 pb-2">Pengurus Inti</h2>
                <div className="flex flex-wrap justify-center gap-8">
                  {/* Ketua */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center mb-4 border-4 border-white shadow-lg">
                      <Users className="w-12 h-12 text-primary/40" />
                    </div>
                    <h3 className="font-bold text-primary text-lg">Budi Santoso</h3>
                    <p className="text-sm text-primary/70">Ketua OSIS</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-center gap-8 mt-8">
                  {['Wakil Ketua I', 'Wakil Ketua II', 'Sekretaris I', 'Bendahara I'].map((pos, i) => (
                    <div key={i} className="flex flex-col items-center text-center">
                      <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center mb-4 border-4 border-white shadow-md">
                        <Users className="w-8 h-8 text-primary/40" />
                      </div>
                      <h3 className="font-bold text-primary">Nama Pengurus</h3>
                      <p className="text-xs text-primary/70">{pos}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Divisi */}
            <ScrollReveal>
              <div className="w-full mt-16">
                <h2 className="text-2xl font-bold text-primary mb-8 text-center border-b-2 border-primary/20 pb-2 inline-block">Divisi / Sekbid</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    'Ketakwaan Terhadap Tuhan YME',
                    'Kehidupan Berbangsa & Bernegara',
                    'Pendidikan Pendahuluan Bela Negara',
                    'Kepribadian & Budi Pekerti',
                    'Berorganisasi & Kepemimpinan',
                    'Keterampilan & Kewirausahaan'
                  ].map((divisi, i) => (
                    <div key={i} className="bg-secondary/10 p-6 rounded-2xl border border-secondary/50 text-center hover:shadow-md transition-shadow">
                      <h4 className="font-bold text-primary mb-6 text-sm h-10 flex items-center justify-center">{divisi}</h4>
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-3">
                          <Users className="w-6 h-6 text-primary/40" />
                        </div>
                        <p className="font-semibold text-primary text-sm">Koordinator</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
