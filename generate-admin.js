const fs = require('fs');
const path = require('path');

const pages = [
  {
    path: 'broadcast',
    name: 'Broadcast',
    entity: 'Broadcast',
    tableName: 'broadcasts',
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'content', label: 'Content', type: 'textarea' },
      { name: 'status', label: 'Status', type: 'select', options: ['published', 'draft'] },
      { name: 'priority', label: 'Priority', type: 'number' },
      { name: 'pinned', label: 'Pinned', type: 'checkbox' },
      { name: 'start_at', label: 'Start At', type: 'datetime-local' },
      { name: 'expires_at', label: 'Expires At', type: 'datetime-local' },
    ],
    columns: ['title', 'status', 'priority', 'pinned', 'start_at', 'expires_at']
  },
  {
    path: 'anggota',
    name: 'Anggota',
    entity: 'Member',
    tableName: 'members',
    fields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'photo_url', label: 'Photo', type: 'file' },
      { name: 'active', label: 'Active', type: 'checkbox' },
      { name: 'order', label: 'Order', type: 'number' }
    ],
    columns: ['name', 'description', 'active', 'order']
  },
  {
    path: 'kepengurusan',
    name: 'Kepengurusan',
    entity: 'Position',
    tableName: 'positions',
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'division', label: 'Division', type: 'text' },
      { name: 'member_id', label: 'Member', type: 'text' },
      { name: 'parent_id', label: 'Parent Position', type: 'text' },
      { name: 'order', label: 'Order', type: 'number' }
    ],
    columns: ['title', 'division', 'member_id', 'parent_id', 'order']
  },
  {
    path: 'ekstrakurikuler',
    name: 'Ekstrakurikuler',
    entity: 'Extracurricular',
    tableName: 'extracurriculars',
    fields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'pembina', label: 'Pembina', type: 'text' },
      { name: 'contact', label: 'Contact', type: 'text' },
      { name: 'active', label: 'Active', type: 'checkbox' },
      { name: 'order', label: 'Order', type: 'number' }
    ],
    columns: ['name', 'pembina', 'active', 'order']
  },
  {
    path: 'program-kerja',
    name: 'Program Kerja',
    entity: 'Program',
    tableName: 'programs',
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'status', label: 'Status', type: 'select', options: ['planned', 'ongoing', 'completed'] },
      { name: 'published', label: 'Published', type: 'checkbox' }
    ],
    columns: ['title', 'date', 'status', 'published', 'category']
  },
  {
    path: 'kalender',
    name: 'Kalender',
    entity: 'Event',
    tableName: 'events',
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'start_time', label: 'Start Time', type: 'time' },
      { name: 'end_time', label: 'End Time', type: 'time' },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'published', label: 'Published', type: 'checkbox' }
    ],
    columns: ['title', 'date', 'start_time', 'end_time', 'category', 'location', 'published']
  },
  {
    path: 'timeline',
    name: 'Timeline',
    entity: 'Timeline',
    tableName: 'timelines',
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'order', label: 'Order', type: 'number' },
      { name: 'published', label: 'Published', type: 'checkbox' }
    ],
    columns: ['title', 'date', 'order', 'published']
  },
  {
    path: 'linktree',
    name: 'Linktree',
    entity: 'Link',
    tableName: 'links',
    fields: [
      { name: 'label', label: 'Label', type: 'text' },
      { name: 'url', label: 'URL', type: 'text' },
      { name: 'enabled', label: 'Enabled', type: 'checkbox' },
      { name: 'order', label: 'Order', type: 'number' }
    ],
    columns: ['label', 'url', 'enabled']
  },
  {
    path: 'users',
    name: 'Users',
    entity: 'User',
    tableName: 'users',
    fields: [
      { name: 'role', label: 'Role', type: 'select', options: ['admin', 'super_admin'] }
    ],
    columns: ['name', 'email', 'role', 'created_at'],
    readOnlyFields: ['name', 'email']
  }
];

const generatePage = (page) => {
  return `'use client';

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

export default function ${page.entity}Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  
  const [formData, setFormData] = useState({});

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    let query = supabase.from('${page.tableName}').select('*');
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

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setFormData(item);
    } else {
      setFormData({});
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const isEdit = !!editingItem;
    
    let result;
    if (isEdit) {
      result = await supabase.from('${page.tableName}').update(formData).eq('id', editingItem.id);
    } else {
      result = await supabase.from('${page.tableName}').insert([formData]);
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
    const { error } = await supabase.from('${page.tableName}').delete().eq('id', deletingId);
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
          <h1 className="text-2xl font-bold text-primary">${page.name} Management</h1>
          <p className="text-gray-500">Manage your ${page.name.toLowerCase()}s here.</p>
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
                  ${page.columns.map(col => `<th className="px-4 py-3 font-semibold capitalize">${col.replace(/_/g, ' ')}</th>`).join('\n                  ')}
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-secondary/10">
                    ${page.columns.map(col => `
                    <td className="px-4 py-3">
                      {typeof item['${col}'] === 'boolean' 
                        ? (item['${col}'] ? <Badge className="bg-green-100 text-green-800">Yes</Badge> : <Badge className="bg-gray-100 text-gray-800">No</Badge>)
                        : String(item['${col}'] || '-')}
                    </td>`).join('')}
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleOpenModal(item)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => { setDeletingId(item.id); setIsConfirmOpen(true); }}>
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
        title={editingItem ? "Edit ${page.entity}" : "Add ${page.entity}"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          ${page.fields.map(f => {
            if (f.type === 'textarea') {
              return `
          <div>
            <label className="block text-sm font-medium mb-1">${f.label}</label>
            <Textarea 
              value={formData['${f.name}'] || ''}
              onChange={(e) => setFormData({...formData, '${f.name}': e.target.value})}
              required
            />
          </div>`;
            } else if (f.type === 'checkbox') {
              return `
          <div className="flex items-center gap-2">
            <input 
              type="checkbox"
              id="${f.name}"
              checked={!!formData['${f.name}']}
              onChange={(e) => setFormData({...formData, '${f.name}': e.target.checked})}
            />
            <label htmlFor="${f.name}" className="text-sm font-medium">${f.label}</label>
          </div>`;
            } else if (f.type === 'select') {
              return `
          <div>
            <label className="block text-sm font-medium mb-1">${f.label}</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={formData['${f.name}'] || ''}
              onChange={(e) => setFormData({...formData, '${f.name}': e.target.value})}
            >
              <option value="">Select...</option>
              ${f.options.map(o => `<option value="${o}">${o}</option>`).join('\n              ')}
            </select>
          </div>`;
            } else {
              return `
          <div>
            <label className="block text-sm font-medium mb-1">${f.label}</label>
            <Input 
              type="${f.type}"
              value={formData['${f.name}'] || ''}
              onChange={(e) => setFormData({...formData, '${f.name}': e.target.value})}
            />
          </div>`;
            }
          }).join('')}
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
`;
};

pages.forEach(page => {
  const dir = path.join(__dirname, 'src/app/admin', page.path);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(path.join(dir, 'page.tsx'), generatePage(page));
  console.log('Generated', page.path);
});
