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
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBroadcasts() {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        
        const now = new Date().toISOString();
        const { data, error } = await supabase
          .from('broadcasts')
          .select('id, content')
          .eq('published', true)
          .or(`start_at.is.null,start_at.lte.${now}`)
          .or(`expires_at.is.null,expires_at.gt.${now}`)
          .order('priority', { ascending: false })
          .order('created_at', { ascending: false });
          
        if (data && !error) {
          setBroadcasts(data.map(d => ({
            id: d.id,
            message: d.content,
            link: null // Can be enhanced later if links are added to schema
          })));
        }
      } catch (e) {
        console.error('Failed to fetch broadcasts', e);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchBroadcasts();
  }, []);

  if (isLoading || broadcasts.length === 0) return null;

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
        <div className="inline-block ticker-animate">
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
