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
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Plus, Trash2 } from 'lucide-react';
import { ImageUploader } from '@/components/admin/image-uploader';

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<GalleryInsert>>({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
    if (!formData.image_url) {
      alert('Gambar wajib diisi!');
      return;
    }
    if (formData.id) {
      await supabase.from('gallery').update(formData as any).eq('id', formData.id);
    } else {
      await supabase.from('gallery').insert([{ ...formData, published: true } as any]);
    }
    setIsModalOpen(false);
    fetchItems();
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    await supabase.from('gallery').delete().eq('id', deletingId);
    setIsConfirmOpen(false);
    setDeletingId(null);
    fetchItems();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Gallery</h1>
          <p className="text-gray-500">Kelola foto dokumentasi OSIS.</p>
        </div>
        <Button onClick={() => { setFormData({}); setIsModalOpen(true); }} className="bg-primary text-white">
          <Plus className="w-4 h-4 mr-2" /> Tambah Foto
        </Button>
      </div>

      {loading ? <div className="flex justify-center py-12"><Spinner /></div> : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map(item => (
            <Card key={item.id} className="overflow-hidden group relative">
              <div className="aspect-square bg-secondary/30 relative cursor-pointer" onClick={() => { setFormData(item); setIsModalOpen(true); }}>
                {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" alt={item.title || undefined} /> : <div className="p-4 flex items-center justify-center h-full text-xs text-gray-400">No Image</div>}
              </div>
              <div className="p-2 flex justify-between items-center">
                <span className="text-sm truncate font-medium">{item.title || 'Untitled'}</span>
                <Button size="sm" variant="danger" onClick={() => { setDeletingId(item.id); setIsConfirmOpen(true); }}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Gallery Item">
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Judul</label><Input value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
          <ImageUploader
            label="Foto"
            value={formData.image_url || ''}
            onChange={(url) => setFormData({...formData, image_url: url})}
          />
          <div><label className="block text-sm font-medium mb-1">Kategori</label><Input value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} /></div>
          <div className="flex justify-end pt-4"><Button type="submit" className="bg-primary text-white">Simpan</Button></div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Foto"
        description="Yakin ingin menghapus foto ini?"
      />
    </div>
  );
}
