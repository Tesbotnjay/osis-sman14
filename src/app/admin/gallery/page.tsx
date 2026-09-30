'use client';
import { useState, useEffect } from 'react';
import { Database } from '@/types/database';

type GalleryRow = Database['public']['Tables']['gallery']['Row'];
type GalleryInsert = Database['public']['Tables']['gallery']['Insert'];
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<GalleryInsert>>({});

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      await supabase.from('gallery').update(formData as any).eq('id', formData.id);
    } else {
      await supabase.from('gallery').insert([formData as any]);
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
                {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" alt={item.title || undefined} /> : <div className="p-4 flex items-center justify-center h-full text-xs text-gray-400">No Image URL</div>}
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
