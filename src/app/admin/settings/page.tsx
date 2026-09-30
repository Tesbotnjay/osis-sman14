'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase.from('site_settings').select('*');
    if (data) {
      const obj: Record<string, string> = {};
      data.forEach(d => obj[d.key] = d.value as string);
      setSettings(obj);
    }
    setLoading(false);
  };

  const handleSave = async (key: string, value: string) => {
    await supabase.from('site_settings').upsert({ key, value });
    alert('Saved ' + key);
  };

  if (loading) return <div className="p-6 flex justify-center"><Spinner /></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Site Settings</h1>
        <p className="text-gray-500">Configure global website settings.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold">Site Identity</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Site Name</label>
            <div className="flex gap-2">
              <Input value={settings.site_name || ''} onChange={e => setSettings({...settings, site_name: e.target.value})} />
              <Button onClick={() => handleSave('site_name', settings.site_name)}>Save</Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Logo URL</label>
            <div className="flex gap-2">
              <Input value={settings.logo_url || ''} onChange={e => setSettings({...settings, logo_url: e.target.value})} />
              <Button onClick={() => handleSave('logo_url', settings.logo_url)}>Save</Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold">Hero Section</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Hero Title</label>
            <div className="flex gap-2">
              <Input value={settings.hero_title || ''} onChange={e => setSettings({...settings, hero_title: e.target.value})} />
              <Button onClick={() => handleSave('hero_title', settings.hero_title)}>Save</Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hero Subtitle</label>
            <div className="flex gap-2">
              <Input value={settings.hero_subtitle || ''} onChange={e => setSettings({...settings, hero_subtitle: e.target.value})} />
              <Button onClick={() => handleSave('hero_subtitle', settings.hero_subtitle)}>Save</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
