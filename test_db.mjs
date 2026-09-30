import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'] || '';
const supabaseKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Fetching active period...');
  const { data: periods } = await supabase.from('periods').select('id').eq('is_active', true);
  const activePeriodId = periods?.[0]?.id;
  console.log('Active period ID:', activePeriodId);

  const { data, error } = await supabase
    .from('organization_positions')
    .select(`
      id, title, division, parent_position_id, order_index,
      member:members(name, photo_url)
    `)
    .eq('period_id', activePeriodId)
    .order('order_index', { ascending: true });

  if (error) console.error(error);
  console.log(`Found ${data?.length} positions`);
  
  if (data) {
    const wakil = data.find(d => d.title === 'Wakil Ketua OSIS');
    console.log('Wakil ID:', wakil?.id);
    
    const childrenOfWakil = data.filter(d => d.parent_position_id === wakil?.id);
    console.log('Children of Wakil:', childrenOfWakil.length);
    if (childrenOfWakil.length > 0) {
        console.log(childrenOfWakil.map(c => c.title));
    }
  }
}

test();
