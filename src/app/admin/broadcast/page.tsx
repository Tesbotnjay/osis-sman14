'use client';

import { useState, useEffect } from 'react';
import { Database } from '@/types/database';

type BroadcastRow = Database['public']['Tables']['broadcasts']['Row'];
type BroadcastInsert = Database['public']['Tables']['broadcasts']['Insert'];
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Spinner } from '@/components/ui/spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { Plus, Edit, Trash2, Search, Megaphone } from 'lucide-react';

export default function BroadcastPage() {
  const [data, setData] = useState<BroadcastRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BroadcastRow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<BroadcastInsert>>({});

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    let query = supabase.from('broadcasts').select('*').order('created_at', { ascending: false });
    
    const { data: result, error } = await query;
    
    if (error) {
      console.error(error);
      alert('Error fetching data');
    } else {
      setData(result || []);
    }
    setLoading(false);
  };

  const handleOpenModal = (item: BroadcastRow | null = null) => {
    setEditingItem(item);
    if (item) {
      setFormData({
        ...item,
        // Convert ISO strings to datetime-local format for the input
        start_at: item.start_at ? new Date(item.start_at).toISOString().slice(0, 16) : null,
        expires_at: item.expires_at ? new Date(item.expires_at).toISOString().slice(0, 16) : null,
      });
    } else {
      // Default: published = true, so new broadcasts show immediately
      setFormData({ published: true, pinned: false, priority: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate: expires_at must be after start_at if both are set
    if (formData.start_at && formData.expires_at) {
      const start = new Date(formData.start_at).getTime();
      const end = new Date(formData.expires_at).getTime();
      if (end <= start) {
        alert('⚠️ "Berakhir Pada" harus lebih lambat dari "Mulai Dari". Broadcast tidak bisa berakhir sebelum dimulai.');
        return;
      }
    }

    const isEdit = !!editingItem;
    
    // Convert datetime-local values to ISO for storage
    const payload: any = { ...formData };
    if (payload.start_at) payload.start_at = new Date(payload.start_at).toISOString();
    if (payload.expires_at) payload.expires_at = new Date(payload.expires_at).toISOString();
    
    let result;
    if (isEdit) {
      result = await supabase.from('broadcasts').update(payload).eq('id', editingItem.id);
    } else {
      result = await supabase.from('broadcasts').insert([payload]);
    }
    
    if (result.error) {
      console.error(result.error);
      alert('Error saving data: ' + result.error.message);
    } else {
      alert('Berhasil disimpan!');
      setIsModalOpen(false);
      fetchData();
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    const { error } = await supabase.from('broadcasts').delete().eq('id', deletingId);
    if (error) {
      console.error(error);
      alert('Error deleting data');
    } else {
      alert('Berhasil dihapus!');
      setIsConfirmOpen(false);
      fetchData();
    }
  };

  const filteredData = data.filter(item => 
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  );

  // Helper to format date for display
  const formatDateTime = (val: string | null) => {
    if (!val) return '-';
    try {
      return new Date(val).toLocaleString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return val;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Megaphone className="w-6 h-6" />
            Broadcast Management
          </h1>
          <p className="text-gray-500">Kelola pengumuman yang ditampilkan di halaman utama.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-primary hover:bg-primary/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Broadcast
        </Button>
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <strong>Tips:</strong> Broadcast akan tampil di halaman utama jika:
        <ul className="list-disc ml-5 mt-1 space-y-0.5">
          <li><strong>Published</strong> dicentang (✅)</li>
          <li><strong>Mulai Dari</strong> sudah lewat atau dikosongkan (opsional)</li>
          <li><strong>Berakhir Pada</strong> belum lewat atau dikosongkan (opsional)</li>
        </ul>
      </div>

      <Card className="p-4 border-secondary bg-white">
        <div className="flex mb-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Cari broadcast..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center"><Spinner /></div>
        ) : filteredData.length === 0 ? (
          <EmptyState title="Belum ada broadcast" description="Klik 'Tambah Broadcast' untuk membuat pengumuman baru." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/30 text-primary">
                <tr>
                  <th className="px-4 py-3 font-semibold">Judul</th>
                  <th className="px-4 py-3 font-semibold">Konten</th>
                  <th className="px-4 py-3 font-semibold">Published</th>
                  <th className="px-4 py-3 font-semibold">Prioritas</th>
                  <th className="px-4 py-3 font-semibold">Mulai Dari</th>
                  <th className="px-4 py-3 font-semibold">Berakhir Pada</th>
                  <th className="px-4 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-secondary/10">
                    <td className="px-4 py-3 font-medium">{item.title || '-'}</td>
                    <td className="px-4 py-3 max-w-xs truncate">{item.content || '-'}</td>
                    <td className="px-4 py-3">
                      {item.published 
                        ? <Badge className="bg-green-100 text-green-800">✅ Ya</Badge> 
                        : <Badge className="bg-red-100 text-red-800">❌ Tidak</Badge>}
                    </td>
                    <td className="px-4 py-3">{item.priority ?? 0}</td>
                    <td className="px-4 py-3 text-xs">{formatDateTime(item.start_at)}</td>
                    <td className="px-4 py-3 text-xs">{formatDateTime(item.expires_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleOpenModal(item)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => { setDeletingId(item.id); setIsConfirmOpen(true); }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "Edit Broadcast" : "Tambah Broadcast Baru"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium mb-1">Judul <span className="text-red-500">*</span></label>
            <Input 
              type="text"
              value={(formData.title as string) || ''}
              onChange={(e) => setFormData({...formData, 'title': e.target.value})}
              placeholder="Contoh: Pengumuman Rapat OSIS"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Konten / Isi Pengumuman <span className="text-red-500">*</span></label>
            <Textarea 
              value={(formData.content as string) || ''}
              onChange={(e) => setFormData({...formData, 'content': e.target.value})}
              placeholder="Isi pengumuman yang akan ditampilkan di ticker..."
              required
            />
            <p className="text-xs text-gray-400 mt-1">Teks ini yang akan berjalan di halaman utama.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
              <input 
                type="checkbox"
                id="published"
                checked={!!formData.published}
                onChange={(e) => setFormData({...formData, 'published': e.target.checked})}
                className="w-4 h-4"
              />
              <div>
                <label htmlFor="published" className="text-sm font-medium block">Published</label>
                <p className="text-xs text-gray-500">Centang agar tampil di website</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
              <input 
                type="checkbox"
                id="pinned"
                checked={!!formData.pinned}
                onChange={(e) => setFormData({...formData, 'pinned': e.target.checked})}
                className="w-4 h-4"
              />
              <div>
                <label htmlFor="pinned" className="text-sm font-medium block">Pinned</label>
                <p className="text-xs text-gray-500">Sematkan di atas</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Prioritas</label>
            <Input 
              type="number"
              value={formData.priority?.toString() || '0'}
              onChange={(e) => setFormData({...formData, 'priority': parseInt(e.target.value) || 0})}
            />
            <p className="text-xs text-gray-400 mt-1">Angka lebih besar = lebih diprioritaskan ditampilkan lebih dulu.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Mulai Dari <span className="text-gray-400">(opsional)</span></label>
              <Input 
                type="datetime-local"
                value={(formData.start_at as string) || ''}
                onChange={(e) => setFormData({...formData, 'start_at': e.target.value || null})}
              />
              <p className="text-xs text-gray-400 mt-1">Kosongkan = langsung tampil.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Berakhir Pada <span className="text-gray-400">(opsional)</span></label>
              <Input 
                type="datetime-local"
                value={(formData.expires_at as string) || ''}
                onChange={(e) => setFormData({...formData, 'expires_at': e.target.value || null})}
              />
              <p className="text-xs text-gray-400 mt-1">Kosongkan = tidak pernah berakhir.</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" className="bg-primary text-white">Simpan</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Konfirmasi Hapus"
        description="Apakah kamu yakin ingin menghapus broadcast ini? Tindakan ini tidak bisa dibatalkan."
      />
    </div>
  );
}
