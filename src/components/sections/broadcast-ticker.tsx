'use client';

import { useEffect, useState } from 'react';
import { Megaphone } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Broadcast {
  id: string;
  message: string;
  link?: string | null;
}

// Global CSS animate-ticker should be added in globals.css
// @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
// .animate-ticker { animation: ticker 20s linear infinite; }
// .animate-ticker:hover { animation-play-state: paused; }

export function BroadcastTicker() {
  // Placeholder data for now
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([
    { id: '1', message: 'Selamat Datang di Website Resmi OSIS SMA Negeri 14 Samarinda!' },
    { id: '2', message: 'Pendaftaran Ekstrakurikuler telah dibuka, segera daftar!', link: '/ekstrakurikuler' },
    { id: '3', message: 'Jangan lupa sampaikan aspirasi kalian melalui W-SPIRAS.', link: '/w-spiras' }
  ]);

  if (broadcasts.length === 0) return null;

  const content = broadcasts.map((b) => (
    <span key={b.id} className="inline-flex items-center mx-4 md:mx-8">
      <Megaphone className="w-4 h-4 mr-2 text-primary/70" />
      {b.link ? (
        <Link href={b.link} className="hover:underline font-medium">
          {b.message}
        </Link>
      ) : (
        <span className="font-medium">{b.message}</span>
      )}
      <span className="mx-4 md:mx-8 text-primary/30">•</span>
    </span>
  ));

  return (
    <div className="bg-secondary text-primary py-3 overflow-hidden whitespace-nowrap relative border-b border-primary/10 flex items-center">
      <div className="w-full inline-block motion-reduce:hidden">
        {/* 
          We duplicate the content to create a seamless infinite scroll effect.
          The width of inner container needs to be twice, and we animate it moving left by 50%
        */}
        <div className="inline-block animate-[ticker_30s_linear_infinite] hover:[animation-play-state:paused]">
          {content}
          {content}
        </div>
      </div>
      
      {/* Fallback for prefers-reduced-motion */}
      <div className="hidden motion-reduce:flex items-center justify-center w-full truncate px-4">
        <Megaphone className="w-4 h-4 mr-2 shrink-0 text-primary/70" />
        <span className="truncate font-medium">{broadcasts[0]?.message}</span>
      </div>
    </div>
  );
}
