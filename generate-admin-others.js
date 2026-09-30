const fs = require('fs');
const path = require('path');

const generatePage = (pageName, content) => {
  const dir = path.join(__dirname, 'src/app/admin', pageName);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(path.join(dir, 'page.tsx'), content);
  console.log('Generated', pageName);
};

// 8. Visi Misi
generatePage('visi-misi', `'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Trash2, Plus } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

export default function VisiMisiPage() {
  const [vision, setVision] = useState('');
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: vData } = await supabase.from('settings').select('*').eq('key', 'vision').single();
    if (vData) setVision(vData.value || '');
    
    const { data: mData } = await supabase.from('missions').select('*').order('order', { ascending: true });
    if (mData) setMissions(mData);
    setLoading(false);
  };

  const handleSaveVision = async () => {
    await supabase.from('settings').upsert({ key: 'vision', value: vision });
    alert('Vision saved!');
  };

  const handleAddMission = async () => {
    const newItem = { content: '', order: missions.length + 1 };
    const { data } = await supabase.from('missions').insert([newItem]).select().single();
    if (data) setMissions([...missions, data]);
  };

  const handleUpdateMission = async (id, content, order) => {
    await supabase.from('missions').update({ content, order }).eq('id', id);
    alert('Mission item updated!');
  };

  const handleDeleteMission = async (id) => {
    await supabase.from('missions').delete().eq('id', id);
    setMissions(missions.filter(m => m.id !== id));
  };

  if (loading) return <div className="p-6 flex justify-center"><Spinner /></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary mb-2">Visi & Misi</h1>
        <p className="text-gray-500">Manage the vision and mission statements.</p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Visi (Vision)</h2>
        <Textarea 
          value={vision} 
          onChange={(e) => setVision(e.target.value)} 
          className="min-h-[100px] mb-4" 
        />
        <Button onClick={handleSaveVision} className="bg-primary text-white">Save Vision</Button>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Misi (Mission)</h2>
          <Button onClick={handleAddMission} size="sm" variant="outline"><Plus className="w-4 h-4 mr-1"/> Add Item</Button>
        </div>
        
        <div className="space-y-4">
          {missions.map((m) => (
            <div key={m.id} className="flex gap-3 items-start p-4 border border-secondary rounded-lg">
              <Input 
                type="number" 
                value={m.order} 
                onChange={(e) => {
                  const updated = [...missions];
                  const idx = updated.findIndex(x => x.id === m.id);
                  updated[idx].order = Number(e.target.value);
                  setMissions(updated);
                }} 
                className="w-20" 
              />
              <Textarea 
                value={m.content} 
                onChange={(e) => {
                  const updated = [...missions];
                  const idx = updated.findIndex(x => x.id === m.id);
                  updated[idx].content = e.target.value;
                  setMissions(updated);
                }}
                className="flex-1"
              />
              <div className="flex flex-col gap-2">
                <Button size="sm" onClick={() => handleUpdateMission(m.id, m.content, m.order)}>Save</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDeleteMission(m.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
          {missions.length === 0 && <p className="text-gray-500 text-sm">No mission items found.</p>}
        </div>
      </Card>
    </div>
  );
}
`);

// 9. Latar Belakang
generatePage('latar-belakang', `'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

export default function LatarBelakangPage() {
  const [heading, setHeading] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await supabase.from('settings').select('*').in('key', ['background_heading', 'background_content', 'background_image']);
    if (data) {
      const hd = data.find(d => d.key === 'background_heading');
      const ct = data.find(d => d.key === 'background_content');
      const img = data.find(d => d.key === 'background_image');
      if (hd) setHeading(hd.value);
      if (ct) setContent(ct.value);
      if (img) setImageUrl(img.value);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    await supabase.from('settings').upsert([
      { key: 'background_heading', value: heading },
      { key: 'background_content', value: content },
      { key: 'background_image', value: imageUrl }
    ]);
    alert('Saved successfully!');
  };

  if (loading) return <div className="p-6 flex justify-center"><Spinner /></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary mb-2">Latar Belakang</h1>
        <p className="text-gray-500">Edit the background section of the website.</p>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Heading</label>
          <Input value={heading} onChange={(e) => setHeading(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <Textarea className="min-h-[200px]" value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
          {imageUrl && <img src={imageUrl} alt="Preview" className="mt-4 w-64 h-auto rounded border" />}
        </div>
        <Button onClick={handleSave} className="bg-primary text-white w-full">Save Changes</Button>
      </Card>
    </div>
  );
}
`);

// 10. W-SPIRAS
generatePage('w-spiras', `'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Spinner } from '@/components/ui/spinner';
import { EmptyState } from '@/components/ui/empty-state';

export default function WSpirasPage() {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('Semua');
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const supabase = createClient();

  const tabs = ['Semua', 'Baru', 'Dibaca', 'Diproses', 'Selesai', 'Spam'];

  useEffect(() => {
    fetchMessages();
    
    const channel = supabase
      .channel('w-spiras-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'w_spiras' }, (payload) => {
        setMessages((prev) => [payload.new, ...prev]);
      })
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const { data } = await supabase.from('w_spiras').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
    setLoading(false);
  };

  const handleUpdateStatus = async (id, status) => {
    await supabase.from('w_spiras').update({ status }).eq('id', id);
    setMessages(messages.map(m => m.id === id ? { ...m, status } : m));
    setSelectedMsg(null);
  };

  const filtered = filter === 'Semua' ? messages : messages.filter(m => {
    if (filter === 'Baru') return m.status === 'new';
    if (filter === 'Dibaca') return m.status === 'read';
    if (filter === 'Diproses') return m.status === 'processing';
    if (filter === 'Selesai') return m.status === 'completed';
    if (filter === 'Spam') return m.status === 'spam';
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary mb-2">W-SPIRAS</h1>
        <p className="text-gray-500">Wadah Aspirasi Siswa - Manage student feedbacks and suggestions.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <Button 
            key={tab} 
            variant={filter === tab ? 'default' : 'outline'} 
            onClick={() => setFilter(tab)}
            className={filter === tab ? 'bg-primary text-white' : ''}
          >
            {tab}
          </Button>
        ))}
      </div>

      <Card className="p-4 border-secondary bg-white">
        {loading ? <div className="py-12 flex justify-center"><Spinner /></div> : 
         filtered.length === 0 ? <EmptyState title="No messages found" description="Try another filter." /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/30 text-primary">
                <tr>
                  <th className="px-4 py-3 font-semibold">Sender</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Message</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary">
                {filtered.map(item => (
                  <tr key={item.id} onClick={() => setSelectedMsg(item)} className="hover:bg-secondary/10 cursor-pointer">
                    <td className="px-4 py-3">{item.sender_name || 'Anonymous'} {item.sender_class ? \`(\${item.sender_class})\` : ''}</td>
                    <td className="px-4 py-3"><Badge variant="outline">{item.category}</Badge></td>
                    <td className="px-4 py-3 truncate max-w-xs">{item.message}</td>
                    <td className="px-4 py-3"><Badge>{item.status || 'new'}</Badge></td>
                    <td className="px-4 py-3">{new Date(item.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal isOpen={!!selectedMsg} onClose={() => setSelectedMsg(null)} title="Message Details">
        {selectedMsg && (
          <div className="space-y-4">
            <div><strong>Sender:</strong> {selectedMsg.sender_name || 'Anonymous'}</div>
            <div><strong>Class:</strong> {selectedMsg.sender_class || '-'}</div>
            <div><strong>Category:</strong> {selectedMsg.category}</div>
            <div><strong>Date:</strong> {new Date(selectedMsg.created_at).toLocaleString()}</div>
            <div>
              <strong>Message:</strong>
              <div className="mt-2 p-3 bg-secondary/20 rounded-md border border-secondary text-sm">
                {selectedMsg.message}
              </div>
            </div>
            
            <div className="pt-4 border-t flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(selectedMsg.id, 'read')}>Mark Read</Button>
              <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(selectedMsg.id, 'processing')}>Process</Button>
              <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(selectedMsg.id, 'completed')}>Complete</Button>
              <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(selectedMsg.id, 'spam')}>Spam</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
`);

// 11. Gallery
generatePage('gallery', `'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (formData.id) {
      await supabase.from('gallery').update(formData).eq('id', formData.id);
    } else {
      await supabase.from('gallery').insert([formData]);
    }
    setIsModalOpen(false);
    fetchItems();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Gallery</h1>
          <p className="text-gray-500">Manage photos and images.</p>
        </div>
        <Button onClick={() => { setFormData({}); setIsModalOpen(true); }} className="bg-primary text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Image
        </Button>
      </div>

      {loading ? <div className="flex justify-center py-12"><Spinner /></div> : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map(item => (
            <Card key={item.id} className="overflow-hidden cursor-pointer hover:ring-2 ring-primary/50" onClick={() => { setFormData(item); setIsModalOpen(true); }}>
              <div className="aspect-square bg-secondary/30 relative">
                {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" alt={item.title} /> : <div className="p-4 flex items-center justify-center h-full text-xs text-gray-400">No Image URL</div>}
              </div>
              <div className="p-2 text-sm truncate font-medium">{item.title || 'Untitled'}</div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Gallery Item">
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Title</label><Input value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
          <div><label className="block text-sm font-medium mb-1">Image URL</label><Input value={formData.image_url || ''} onChange={e => setFormData({...formData, image_url: e.target.value})} /></div>
          <div><label className="block text-sm font-medium mb-1">Category</label><Input value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} /></div>
          <div className="flex justify-end pt-4"><Button type="submit">Save</Button></div>
        </form>
      </Modal>
    </div>
  );
}
`);

// 13. Settings
generatePage('settings', `'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

export default function SettingsPage() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase.from('settings').select('*');
    if (data) {
      const obj = {};
      data.forEach(d => obj[d.key] = d.value);
      setSettings(obj);
    }
    setLoading(false);
  };

  const handleSave = async (key, value) => {
    await supabase.from('settings').upsert({ key, value });
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
`);

// 14. Telegram
generatePage('telegram', `'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

export default function TelegramPage() {
  const [settings, setSettings] = useState({ bot_token: '', chat_id: '', enabled: false });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from('settings').select('*').in('key', ['telegram_bot_token', 'telegram_chat_id', 'telegram_enabled']);
    if (data) {
      const obj = { ...settings };
      data.forEach(d => {
        if (d.key === 'telegram_bot_token') obj.bot_token = d.value;
        if (d.key === 'telegram_chat_id') obj.chat_id = d.value;
        if (d.key === 'telegram_enabled') obj.enabled = d.value === 'true';
      });
      setSettings(obj);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    await supabase.from('settings').upsert([
      { key: 'telegram_bot_token', value: settings.bot_token },
      { key: 'telegram_chat_id', value: settings.chat_id },
      { key: 'telegram_enabled', value: String(settings.enabled) }
    ]);
    alert('Settings saved!');
  };

  const testConnection = () => {
    alert('Test connection placeholder. Needs server API implementation.');
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
          <Input type="password" value={settings.bot_token} onChange={e => setSettings({...settings, bot_token: e.target.value})} placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11" />
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
          <Button onClick={testConnection} variant="outline">Test Connection</Button>
        </div>
      </Card>
    </div>
  );
}
`);

// 16. Activity Log
generatePage('activity-log', `'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

export default function ActivityLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    const { data } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(100);
    if (data) setLogs(data);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Activity Logs</h1>
        <p className="text-gray-500">View recent system activities.</p>
      </div>

      <Card className="p-4 border-secondary bg-white">
        {loading ? <div className="py-12 flex justify-center"><Spinner /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/30 text-primary">
                <tr>
                  <th className="px-4 py-3 font-semibold">Action</th>
                  <th className="px-4 py-3 font-semibold">Entity</th>
                  <th className="px-4 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-secondary/10">
                    <td className="px-4 py-3 capitalize">{log.action}</td>
                    <td className="px-4 py-3">{log.entity_type}</td>
                    <td className="px-4 py-3">{log.user_id || 'System'}</td>
                    <td className="px-4 py-3">{new Date(log.created_at).toLocaleString()}</td>
                  </tr>
                ))}
                {logs.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-gray-500">No logs found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
`);

// 17. Archive
generatePage('archive', `'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

export default function ArchivePage() {
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPeriod, setNewPeriod] = useState({ name: '', start_date: '', end_date: '' });
  const supabase = createClient();

  useEffect(() => {
    fetchPeriods();
  }, []);

  const fetchPeriods = async () => {
    setLoading(true);
    const { data } = await supabase.from('periods').select('*').order('start_date', { ascending: false });
    if (data) setPeriods(data);
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await supabase.from('periods').insert([newPeriod]);
    setNewPeriod({ name: '', start_date: '', end_date: '' });
    fetchPeriods();
  };

  const handleSetActive = async (id) => {
    // Unset all first (requires rpc or multiple updates usually, doing simple for now)
    await supabase.from('periods').update({ is_active: false }).neq('id', id);
    await supabase.from('periods').update({ is_active: true }).eq('id', id);
    fetchPeriods();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Period / Archive Management</h1>
        <p className="text-gray-500">Manage organizational periods and data archives.</p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">Add New Period</h2>
        <form onSubmit={handleAdd} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium mb-1">Name (e.g. 2023/2024)</label>
            <Input value={newPeriod.name} onChange={e => setNewPeriod({...newPeriod, name: e.target.value})} required />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium mb-1">Start Date</label>
            <Input type="date" value={newPeriod.start_date} onChange={e => setNewPeriod({...newPeriod, start_date: e.target.value})} required />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium mb-1">End Date</label>
            <Input type="date" value={newPeriod.end_date} onChange={e => setNewPeriod({...newPeriod, end_date: e.target.value})} required />
          </div>
          <Button type="submit" className="bg-primary text-white">Add</Button>
        </form>
      </Card>

      <Card className="p-4">
        {loading ? <Spinner /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/30">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Dates</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {periods.map(p => (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3">{p.start_date} to {p.end_date}</td>
                    <td className="px-4 py-3">{p.is_active ? <span className="text-green-600 font-bold">Active</span> : <span className="text-gray-400">Archived</span>}</td>
                    <td className="px-4 py-3 text-right">
                      {!p.is_active && <Button size="sm" variant="outline" onClick={() => handleSetActive(p.id)}>Set Active</Button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
`);

// 18. Backup
generatePage('backup', `'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download } from 'lucide-react';

export default function BackupPage() {
  const handleExport = (type) => {
    alert('Exporting ' + type + '... (This feature requires server-side excel generation)');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Export & Backup</h1>
        <p className="text-gray-500">Download system data as Excel files.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {['Members', 'Programs', 'Events', 'W-SPIRAS', 'Gallery Metadata'].map(type => (
          <Card key={type} className="p-6 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">{type}</h3>
              <p className="text-xs text-gray-500">Export all {type.toLowerCase()} records</p>
            </div>
            <Button onClick={() => handleExport(type)} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
`);
