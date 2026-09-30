'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { testTelegramConnection } from './actions';
import { Loader2 } from 'lucide-react';

export default function TelegramPage() {
  const [settings, setSettings] = useState({ bot_token_encrypted: '', chat_id: '', enabled: false });
  const [loading, setLoading] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from('telegram_settings').select('*').single();
    if (data) {
      setSettings({
        bot_token_encrypted: data.bot_token_encrypted || '',
        chat_id: data.chat_id || '',
        enabled: data.enabled
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    await supabase.from('telegram_settings').upsert({
      bot_token_encrypted: settings.bot_token_encrypted,
      chat_id: settings.chat_id,
      enabled: settings.enabled,
      destination_type: 'group',
      id: '00000000-0000-0000-0000-000000000000'
    } as any);
    alert('Settings saved!');
  };

  const testConnection = async () => {
    setIsTesting(true);
    try {
      const result = await testTelegramConnection(settings.bot_token_encrypted, settings.chat_id);
      alert(result.message);
    } catch (error) {
      alert('Terjadi kesalahan yang tidak terduga.');
    } finally {
      setIsTesting(false);
    }
  };

  if (loading) return <div className="p-6 flex justify-center"><Spinner /></div>;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Telegram Integration</h1>
        <p className="text-gray-500">Configure Telegram bot for notifications (e.g., W-SPIRAS).</p>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Bot Token</label>
          <Input type="password" value={settings.bot_token_encrypted} onChange={e => setSettings({...settings, bot_token_encrypted: e.target.value})} placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Chat ID</label>
          <Input value={settings.chat_id} onChange={e => setSettings({...settings, chat_id: e.target.value})} placeholder="-1001234567890" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="enabled" checked={settings.enabled} onChange={e => setSettings({...settings, enabled: e.target.checked})} />
          <label htmlFor="enabled" className="text-sm font-medium">Enable Telegram Notifications</label>
        </div>
        
        <div className="pt-4 flex gap-2">
          <Button onClick={handleSave} className="bg-primary text-white">Save Configuration</Button>
          <Button onClick={testConnection} variant="outline" disabled={isTesting}>
            {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isTesting ? 'Menguji...' : 'Test Connection'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
