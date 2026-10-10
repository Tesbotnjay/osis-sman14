import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    // Vercel Cron mengirimkan header Authorization dengan format Bearer <CRON_SECRET>
    // Ini memastikan endpoint ini hanya bisa dipanggil oleh Vercel secara otomatis
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    
    // Melakukan query ringan ke tabel site_settings untuk mencatat aktivitas di Supabase
    const { data, error } = await supabase.from('site_settings').select('id').limit(1);

    if (error) {
      console.error('Keepalive error:', error);
      return NextResponse.json({ error: 'Failed to ping database', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Supabase keepalive ping successful. Database is awake!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Keepalive exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
