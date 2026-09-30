import { createClient } from '@/lib/supabase/server';
import { Megaphone } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export async function BroadcastTicker() {
  const supabase = await createClient();
  const now = new Date().toISOString();
  
  const { data: broadcasts, error } = await supabase
    .from('broadcasts')
    .select('id, content')
    .eq('published', true)
    .or(`start_at.is.null,start_at.lte.${now}`)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false });

  if (!broadcasts || broadcasts.length === 0) {
    return (
      <section className="w-full bg-secondary border-b-2 border-primary/20 py-4 z-30 relative shadow-sm">
        <div className="container mx-auto px-4 flex items-center">
          <div className="flex-shrink-0 bg-primary text-white font-bold px-4 py-1.5 rounded-full text-xs md:text-sm mr-4 tracking-widest uppercase shadow-md flex items-center gap-2">
            <Megaphone className="w-4 h-4" />
            <span>Broadcast</span>
          </div>
          <p className="text-primary/70 font-medium italic text-sm">Belum ada broadcast aktif.</p>
        </div>
      </section>
    );
  }

  // Create the continuous content stream
  const contentItems = broadcasts.map((b) => (
    <span key={b.id} className="inline-flex items-center mx-4 md:mx-8">
      <span className="font-semibold tracking-wide text-primary whitespace-nowrap">{b.content}</span>
      <span className="mx-4 md:mx-8 text-primary/30">•</span>
    </span>
  ));

  return (
    <section className="w-full bg-secondary border-b-2 border-primary/20 py-3 md:py-4 z-30 relative shadow-md overflow-hidden flex items-center">
      
      {/* Static Label for Broadcast to make it clear */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-r from-secondary via-secondary to-transparent px-4 md:px-8 w-32 md:w-48">
        <div className="bg-primary text-white font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm tracking-widest uppercase shadow-lg flex items-center gap-2">
          <Megaphone className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden md:inline">Broadcast</span>
        </div>
      </div>

      <div className="w-full inline-block motion-reduce:hidden ml-24 md:ml-40 overflow-hidden relative">
        {/* 
          We duplicate the content to create a seamless infinite scroll effect.
          The animation is defined in globals.css (.ticker-animate)
        */}
        <div className="inline-flex items-center ticker-animate hover:[animation-play-state:paused] cursor-default">
          {contentItems}
          {contentItems}
          {contentItems}
        </div>
      </div>
      
      {/* Fallback for prefers-reduced-motion */}
      <div className="hidden motion-reduce:flex items-center w-full truncate ml-24 md:ml-40 pr-4">
        <span className="truncate font-semibold text-primary">{broadcasts[0]?.content}</span>
      </div>
    </section>
  );
}
