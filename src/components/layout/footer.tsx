import Link from 'next/link';
import { Globe, Send, Play, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-primary text-white pt-24 pb-12 overflow-hidden">
      {/* Wavy separator top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none transform rotate-180">
        <svg
          className="relative block w-full h-[50px] md:h-[80px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-white"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          <div className="lg:col-span-5 flex flex-col items-start">
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl tracking-tight mb-2">
              OSIS SMA NEGERI 14 SAMARINDA
            </h2>
            <p className="text-secondary/70 font-medium tracking-widest uppercase mb-6 text-sm">
              Periode 2026/2027
            </p>
            <p className="text-white/70 max-w-md mb-8 leading-relaxed">
              Mewujudkan siswa-siswi yang berkarakter, kreatif, dan inovatif melalui berbagai program kerja dan kegiatan ekstrakurikuler.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Instagram">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Youtube">
                <Play className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Twitter">
                <Send className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Facebook">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 lg:col-start-8">
            <h3 className="font-heading font-bold text-lg mb-6">Navigasi</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/" className="text-white/70 hover:text-white transition-colors">Beranda</Link></li>
              <li><Link href="/tentang" className="text-white/70 hover:text-white transition-colors">Tentang Kami</Link></li>
              <li><Link href="/program-kerja" className="text-white/70 hover:text-white transition-colors">Program Kerja</Link></li>
              <li><Link href="/kepengurusan" className="text-white/70 hover:text-white transition-colors">Kepengurusan</Link></li>
              <li><Link href="/kalender" className="text-white/70 hover:text-white transition-colors">Kalender</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-heading font-bold text-lg mb-6">Aspirasi & Layanan</h3>
            <ul className="flex flex-col gap-3 mb-8">
              <li><Link href="/w-spiras" className="text-white/70 hover:text-white transition-colors font-medium">W-SPIRAS (Wadah Aspirasi)</Link></li>
              <li><Link href="/ekstrakurikuler" className="text-white/70 hover:text-white transition-colors">Ekstrakurikuler</Link></li>
              <li><Link href="/dokumentasi" className="text-white/70 hover:text-white transition-colors">Dokumentasi</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm text-center md:text-left">
            © 2026 OSIS SMA Negeri 14 Samarinda. All rights reserved.
          </p>
          <div className="text-white/50 text-sm">
            Dibuat dengan ❤️ oleh Tim IT OSIS
          </div>
        </div>
      </div>
    </footer>
  );
}
