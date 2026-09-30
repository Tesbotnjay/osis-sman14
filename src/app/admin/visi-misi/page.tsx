'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Trash2, Plus } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

export default function VisiMisiPage() {
  const [vision, setVision] = useState<string>('');
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: vData } = await supabase.from('vision_mission').select('*').single();
    if (vData) setVision(vData.vision_text || '');
    
    if (vData?.id) {
      const { data: mData } = await supabase.from('mission_items').select('*').eq('vision_mission_id', vData.id).order('order_index', { ascending: true });
      if (mData) setMissions(mData);
    }
    setLoading(false);
  };

  const handleSaveVision = async () => {
    // Get existing to find ID or active period
    const { data: vData } = await supabase.from('vision_mission').select('id').single();
    if (vData) {
      await (supabase as any).from('vision_mission').update({ vision_text: vision }).eq('id', vData.id);
    } else {
      await (supabase as any).from('vision_mission').insert({ vision_text: vision });
    }
    alert('Vision saved!');
  };

  const handleAddMission = async () => {
    const { data: vData } = await supabase.from('vision_mission').select('id').single();
    if (!vData) {
      alert('Please save Vision first!');
      return;
    }
    const newItem = { content: '', order_index: missions.length + 1, vision_mission_id: vData.id };
    const { data } = await (supabase as any).from('mission_items').insert([newItem]).select().single();
    if (data) setMissions([...missions, data]);
  };

  const handleUpdateMission = async (id: string, content: string, order_index: number) => {
    await (supabase as any).from('mission_items').update({ content, order_index }).eq('id', id);
    alert('Mission item updated!');
  };

  const handleDeleteMission = async (id: string) => {
    await supabase.from('mission_items').delete().eq('id', id);
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
                <Button size="sm" variant="danger" onClick={() => handleDeleteMission(m.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
          {missions.length === 0 && <p className="text-gray-500 text-sm">No mission items found.</p>}
        </div>
      </Card>
    </div>
  );
}
