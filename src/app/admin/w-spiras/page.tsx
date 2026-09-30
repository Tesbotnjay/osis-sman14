'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Spinner } from '@/components/ui/spinner';
import { EmptyState } from '@/components/ui/empty-state';

export default function WSpirasPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [filter, setFilter] = useState('Semua');
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState<any>(null);
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

  const handleUpdateStatus = async (id: string, status: string) => {
    await supabase.from('w_spiras').update({ status } as any).eq('id', id);
    setMessages(messages.map((m: any) => m.id === id ? { ...m, status } : m));
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
            variant={filter === tab ? 'primary' : 'outline'} 
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
                    <td className="px-4 py-3">{item.name || 'Anonymous'} {item.class ? `(${item.class})` : ''}</td>
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
            <div><strong>Sender:</strong> {selectedMsg.name || 'Anonymous'}</div>
            <div><strong>Class:</strong> {selectedMsg.class || '-'}</div>
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
              <Button size="sm" variant="danger" onClick={() => handleUpdateStatus(selectedMsg.id, 'spam')}>Spam</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
