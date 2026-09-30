'use client';
import { useState, useEffect } from 'react';
import { Database } from '@/types/database';

type PeriodRow = Database['public']['Tables']['periods']['Row'];
type PeriodInsert = Database['public']['Tables']['periods']['Insert'];
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

export default function ArchivePage() {
  const [periods, setPeriods] = useState<PeriodRow[]>([]);
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

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('periods').insert([newPeriod]);
    setNewPeriod({ name: '', start_date: '', end_date: '' });
    fetchPeriods();
  };

  const handleSetActive = async (id: string) => {
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
