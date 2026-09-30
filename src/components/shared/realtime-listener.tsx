'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function RealtimeListener() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    
    // Listen to changes on relevant public tables
    // To avoid massive re-renders, we use a single channel and listen to changes
    // Only refresh if we are on a public page (which we are, if this component is mounted in the public layout/page)
    const channel = supabase.channel('public-homepage-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (payload) => {
          // Exclude highly frequent/private tables to prevent unnecessary refreshes
          const excludedTables = ['activity_logs', 'notifications', 'w_spiras', 'setup_state'];
          if (payload.table && !excludedTables.includes(payload.table)) {
            // Re-fetch server components
            router.refresh();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
