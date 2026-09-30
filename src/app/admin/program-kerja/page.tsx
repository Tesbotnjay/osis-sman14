'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Spinner } from '@/components/ui/spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Database } from '@/types/database';

type ProgramRow = Database['public']['Tables']['programs']['Row'];
type ProgramInsert = Database['public']['Tables']['programs']['Insert'];

export default function ProgramPage() {
  const [data, setData] = useState<ProgramRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProgramRow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<ProgramInsert>>({});

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    let query = supabase.from('programs').select('*');
    // .order('created_at', { ascending: false });
    
    const { data: result, error } = await query;
    
    if (error) {
      console.error(error);
      alert('Error fetching data');
    } else {
      setData(result || []);
    }
    setLoading(false);
  };

  const handleOpenModal = (item: ProgramRow | null = null) => {
    setEditingItem(item);
    if (item) {
      setFormData(item as any);
    } else {
      setFormData({ featured: false, order_index: 0, status: 'akan_datang', published: false });
    }
    setIsModalOpen(true);
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('programs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('programs')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrlData.publicUrl }));
    } catch (error: any) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingItem;
    
    let result;
    if (isEdit && editingItem) {
      result = await supabase.from('programs').update(formData as any).eq('id', editingItem.id);
    } else {
      result = await supabase.from('programs').insert([formData as any]);
    }
    
    if (result.error) {
      console.error(result.error);
      alert('Error saving data');
    } else {
      alert('Success!');
      setIsModalOpen(false);
      fetchData();
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    const { error } = await supabase.from('programs').delete().eq('id', deletingId);
    if (error) {
      console.error(error);
      alert('Error deleting data');
    } else {
      alert('Deleted successfully!');
      setIsConfirmOpen(false);
      fetchData();
    }
  };

  const filteredData = data.filter(item => 
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Program Kerja Management</h1>
          <p className="text-gray-500">Manage your program kerjas here.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-primary hover:bg-primary/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>

      <Card className="p-4 border-secondary bg-white">
        <div className="flex mb-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center"><Spinner /></div>
        ) : filteredData.length === 0 ? (
          <EmptyState title="No data found" description="Try adjusting your search or add a new item." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/30 text-primary">
                <tr>
                  <th className="px-4 py-3 font-semibold capitalize">title</th>
                  <th className="px-4 py-3 font-semibold capitalize">date</th>
                  <th className="px-4 py-3 font-semibold capitalize">category</th>
                  <th className="px-4 py-3 font-semibold capitalize">featured</th>
                  <th className="px-4 py-3 font-semibold capitalize">published</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-secondary/10">
                    
                    <td className="px-4 py-3">
                      {typeof item['title'] === 'boolean' 
                        ? (item['title'] ? <Badge className="bg-green-100 text-green-800">Yes</Badge> : <Badge className="bg-gray-100 text-gray-800">No</Badge>)
                        : String(item['title'] || '-')}
                    </td>
                    <td className="px-4 py-3">
                      {typeof item['date'] === 'boolean' 
                        ? (item['date'] ? <Badge className="bg-green-100 text-green-800">Yes</Badge> : <Badge className="bg-gray-100 text-gray-800">No</Badge>)
                        : String(item['date'] || '-')}
                    </td>
                    <td className="px-4 py-3">
                      {typeof item['category'] === 'boolean' 
                        ? (item['category'] ? <Badge className="bg-green-100 text-green-800">Yes</Badge> : <Badge className="bg-gray-100 text-gray-800">No</Badge>)
                        : String(item['category'] || '-')}
                    </td>
                    <td className="px-4 py-3">
                      {item.featured ? <Badge className="bg-amber-100 text-amber-800">Featured</Badge> : <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-4 py-3">
                      {item.published ? <Badge className="bg-green-100 text-green-800">Yes</Badge> : <Badge className="bg-gray-100 text-gray-800">No</Badge>}
                    </td>
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
        title={editingItem ? "Edit Program" : "Add Program"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input 
              type="text"
              value={formData['title'] || ''}
              onChange={(e) => setFormData({...formData, 'title': e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea 
              value={formData['description'] || ''}
              onChange={(e) => setFormData({...formData, 'description': e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <Input 
              type="date"
              value={formData['date'] || ''}
              onChange={(e) => setFormData({...formData, 'date': e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <Input 
              type="text"
              value={formData['location'] || ''}
              onChange={(e) => setFormData({...formData, 'location': e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Input 
              type="text"
              value={formData['category'] || ''}
              onChange={(e) => setFormData({...formData, 'category': e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={formData['status'] || ''}
              onChange={(e) => setFormData({...formData, status: e.target.value as ProgramRow['status']})}
            >
              <option value="">Select...</option>
              <option value="akan_datang">Akan Datang</option>
              <option value="berlangsung">Berlangsung</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Caption / Singkatan</label>
            <Input 
              type="text"
              value={formData['caption'] || ''}
              onChange={(e) => setFormData({...formData, 'caption': e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Order Index</label>
            <Input 
              type="number"
              value={formData['order_index'] || 0}
              onChange={(e) => setFormData({...formData, 'order_index': parseInt(e.target.value) || 0})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <div className="flex gap-2 items-center">
              <Input 
                type="text"
                value={formData['image_url'] || ''}
                onChange={(e) => setFormData({...formData, 'image_url': e.target.value})}
                placeholder="https://..."
              />
              <Input
                type="file"
                accept="image/*"
                onChange={handleUploadImage}
                disabled={uploading}
                className="w-1/2"
              />
            </div>
            {uploading && <span className="text-xs text-blue-500 mt-1 block">Uploading...</span>}
            {formData['image_url'] && (
              <img src={formData['image_url']} alt="Preview" className="h-16 object-cover mt-2 rounded" />
            )}
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox"
                id="published"
                checked={!!formData['published']}
                onChange={(e) => setFormData({...formData, 'published': e.target.checked})}
              />
              <label htmlFor="published" className="text-sm font-medium">Published</label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox"
                id="featured"
                checked={!!formData['featured']}
                onChange={(e) => setFormData({...formData, 'featured': e.target.checked})}
              />
              <label htmlFor="featured" className="text-sm font-medium text-amber-600">Featured Program</label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-primary text-white">Save</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Confirmation"
        description="Are you sure you want to delete this item? This action cannot be undone."
      />
    </div>
  );
}
