'use client';

import { useState, useEffect } from 'react';
import { Database } from '@/types/database';

type EkstrakurikulerRow = Database['public']['Tables']['extracurriculars']['Row'];
type EkstrakurikulerInsert = Database['public']['Tables']['extracurriculars']['Insert'];
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

export default function ExtracurricularPage() {
  const [data, setData] = useState<EkstrakurikulerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EkstrakurikulerRow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<EkstrakurikulerInsert>>({});

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    let query = supabase.from('extracurriculars').select('*').order('order_index', { ascending: true });
    
    const { data: result, error } = await query;
    
    if (error) {
      console.error(error);
      alert('Error fetching data');
    } else {
      setData(result || []);
    }
    setLoading(false);
  };

  const handleOpenModal = (item: EkstrakurikulerRow | null = null) => {
    setEditingItem(item);
    if (item) {
      setFormData(item as any);
    } else {
      setFormData({});
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingItem;
    
    let result;
    if (isEdit && editingItem) {
      result = await supabase.from('extracurriculars').update(formData as any).eq('id', editingItem.id);
    } else {
      result = await supabase.from('extracurriculars').insert([formData as any]);
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
    const { error } = await supabase.from('extracurriculars').delete().eq('id', deletingId);
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
          <h1 className="text-2xl font-bold text-primary">Ekstrakurikuler Management</h1>
          <p className="text-gray-500">Manage your ekstrakurikulers here.</p>
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
                  <th className="px-4 py-3 font-semibold capitalize">name</th>
                  <th className="px-4 py-3 font-semibold capitalize">pembina</th>
                  <th className="px-4 py-3 font-semibold capitalize">active</th>
                  <th className="px-4 py-3 font-semibold">Nomor Urut</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-secondary/10">
                    
                    <td className="px-4 py-3">
                      {typeof item.name === 'boolean' 
                        ? (item.name ? <Badge className="bg-green-100 text-green-800">Yes</Badge> : <Badge className="bg-gray-100 text-gray-800">No</Badge>)
                        : String(item.name || '-')}
                    </td>
                    <td className="px-4 py-3">
                      {typeof item.pembina === 'boolean' 
                        ? (item.pembina ? <Badge className="bg-green-100 text-green-800">Yes</Badge> : <Badge className="bg-gray-100 text-gray-800">No</Badge>)
                        : String(item.pembina || '-')}
                    </td>
                    <td className="px-4 py-3">
                      {typeof item.active === 'boolean' 
                        ? (item.active ? <Badge className="bg-green-100 text-green-800">Yes</Badge> : <Badge className="bg-gray-100 text-gray-800">No</Badge>)
                        : String(item.active || '-')}
                    </td>
                    <td className="px-4 py-3">
                      {typeof item.order_index === 'boolean' 
                        ? (item.order_index ? <Badge className="bg-green-100 text-green-800">Yes</Badge> : <Badge className="bg-gray-100 text-gray-800">No</Badge>)
                        : String(item.order_index || '-')}
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
        title={editingItem ? "Edit Extracurricular" : "Add Extracurricular"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input 
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea 
              value={formData.description || ''}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Logo URL (Optional)</label>
            <Input 
              type="text"
              placeholder="https://..."
              value={formData.logo_url || ''}
              onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Photo URL (Optional)</label>
            <Input 
              type="text"
              placeholder="https://..."
              value={formData.photo_url || ''}
              onChange={(e) => setFormData({...formData, photo_url: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pembina</label>
            <Input 
              type="text"
              value={formData.pembina || ''}
              onChange={(e) => setFormData({...formData, pembina: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact</label>
            <Input 
              type="text"
              value={formData.contact || ''}
              onChange={(e) => setFormData({...formData, contact: e.target.value})}
            />
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox"
              id="active"
              checked={!!formData.active}
              onChange={(e) => setFormData({...formData, active: e.target.checked})}
            />
            <label htmlFor="active" className="text-sm font-medium">Active</label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nomor Urut (0 = Paling Atas)</label>
            <Input 
              type="number"
              value={formData.order_index || ''}
              onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Social Label (e.g., Instagram, Link Tree)</label>
            <Input 
              type="text"
              placeholder="Instagram"
              value={formData.social_links && typeof formData.social_links === 'object' && (formData.social_links as any).label 
                ? (formData.social_links as any).label 
                : formData.social_links && typeof formData.social_links === 'object' && (formData.social_links as any).instagram 
                  ? 'Instagram' 
                  : (formData.social_links && typeof formData.social_links === 'object' ? Object.keys(formData.social_links)[0] || '' : '')}
              onChange={(e) => {
                const currentLinks = typeof formData.social_links === 'object' ? formData.social_links : {};
                const currentUrl = (currentLinks as any)?.url || (currentLinks as any)?.instagram || Object.values(currentLinks || {})[0] || '';
                setFormData({...formData, social_links: { label: e.target.value, url: currentUrl }});
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Social URL</label>
            <Input 
              type="url"
              placeholder="https://instagram.com/..."
              value={formData.social_links && typeof formData.social_links === 'object' 
                ? ((formData.social_links as any).url || (formData.social_links as any).instagram || Object.values(formData.social_links)[0] || '')
                : ''}
              onChange={(e) => {
                const currentLinks = typeof formData.social_links === 'object' ? formData.social_links : {};
                const currentLabel = (currentLinks as any)?.label || (currentLinks as any)?.instagram ? 'Instagram' : Object.keys(currentLinks || {})[0] || 'Instagram';
                setFormData({...formData, social_links: { label: currentLabel, url: e.target.value }});
              }}
            />
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
