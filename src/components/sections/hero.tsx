import { createClient } from '@/lib/supabase/server';
import { HeroClient } from './client/hero-client';

export async function Hero() {
  const supabase = await createClient();
  
  // Fetch active period name
  const { data: periodData } = await supabase
    .from('periods')
    .select('name')
    .eq('is_active', true)
    .single();

  // Fetch site settings
  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['hero_title', 'hero_subtitle', 'hero_image_url']);

  let title = 'OSIS';
  let subtitle = 'SMA NEGERI 14 SAMARINDA';
  let imageUrl = null;

  if (settingsData) {
    const titleSetting = settingsData.find(s => s.key === 'hero_title');
    if (titleSetting && titleSetting.value) title = titleSetting.value as string;

    const subtitleSetting = settingsData.find(s => s.key === 'hero_subtitle');
    if (subtitleSetting && subtitleSetting.value) subtitle = subtitleSetting.value as string;

    const imageSetting = settingsData.find(s => s.key === 'hero_image_url');
    if (imageSetting && imageSetting.value) imageUrl = imageSetting.value as string;
  }

  return (
    <HeroClient 
      periodName={periodData?.name || null}
      title={title}
      subtitle={subtitle}
      imageUrl={imageUrl}
    />
  );
}
