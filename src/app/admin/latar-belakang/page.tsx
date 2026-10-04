'use client';
import { useState, useEffect } from 'react';
import { Database } from '@/types/database';

type BgRow = Database['public']['Tables']['background_content']['Row'];
type BgInsert = Database['public']['Tables']['background_content']['Insert'];
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { ImageUploader } from '@/components/admin/image-uploader';

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
    const { data } = await supabase.from('background_content').select('*').single();
    if (data) {
      setHeading(data.heading || '');
      setContent(data.content || '');
      setImageUrl(data.image_url || '');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    const { data: existing } = await supabase.from('background_content').select('id').single();
    if (existing) {
      await (supabase as any).from('background_content').update({
        heading,
        content,
        image_url: imageUrl
      }).eq('id', existing.id);
    } else {
      await (supabase as any).from('background_content').insert({
        heading,
        content,
        image_url: imageUrl
      });
    }
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
        <ImageUploader
          label="Gambar Latar Belakang"
          value={imageUrl}
          onChange={setImageUrl}
        />
        <Button onClick={handleSave} className="bg-primary text-white w-full">Save Changes</Button>
      </Card>
    </div>
  );
}
