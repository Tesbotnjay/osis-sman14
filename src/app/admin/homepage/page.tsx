'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Spinner } from '@/components/ui/spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { ArrowUp, ArrowDown, Save } from 'lucide-react';
import { Database } from '@/types/database';

type SectionRow = Database['public']['Tables']['homepage_sections']['Row'];

export default function HomepageAdmin() {
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('homepage_sections')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) {
      console.error(error);
      alert('Gagal mengambil data section homepage');
    } else {
      setSections(data || []);
    }
    setLoading(false);
  };

  const handleToggleVisible = (id: string, visible: boolean) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, visible } : s));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    const temp = newSections[index - 1];
    newSections[index - 1] = newSections[index];
    newSections[index] = temp;
    // Update order_index
    newSections.forEach((s, i) => s.order_index = i);
    setSections(newSections);
  };

  const handleMoveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    const temp = newSections[index + 1];
    newSections[index + 1] = newSections[index];
    newSections[index] = temp;
    // Update order_index
    newSections.forEach((s, i) => s.order_index = i);
    setSections(newSections);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Upsert all sections
      const { error } = await supabase
        .from('homepage_sections')
        .upsert(
          sections.map(s => ({
            id: s.id,
            section_key: s.section_key,
            visible: s.visible,
            order_index: s.order_index
          }))
        );

      if (error) throw error;
      alert('Berhasil menyimpan perubahan urutan dan visibilitas homepage.');
      fetchSections();
    } catch (err: any) {
      console.error(err);
      alert('Gagal menyimpan: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Human readable labels for section keys
  const sectionLabels: Record<string, string> = {
    hero: 'Hero Section',
    broadcast: 'Broadcast / Pengumuman',
    background: 'Latar Belakang OSIS',
    statistics: 'Statistik',
    vision_mission: 'Visi & Misi',
    programs: 'Program Kerja Unggulan',
    organization: 'Susunan Kepengurusan',
    extracurriculars: 'Ekstrakurikuler',
    agenda: 'Agenda Terdekat',
    timeline: 'Timeline Periode',
    wspiras: 'W-SPIRAS (Wadah Aspirasi)',
    gallery: 'Dokumentasi Kegiatan',
    linktree: 'Tautan Linktree',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Atur Halaman Utama</h1>
          <p className="text-muted-foreground">Kelola urutan dan visibilitas bagian-bagian di beranda publik.</p>
        </div>
        <Button onClick={handleSave} disabled={saving || loading}>
          {saving ? <Spinner className="mr-2" /> : <Save className="mr-2 w-4 h-4" />}
          Simpan Perubahan
        </Button>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="py-12 flex justify-center"><Spinner /></div>
        ) : sections.length === 0 ? (
          <EmptyState title="Tidak ada section" description="Database section kosong." />
        ) : (
          <div className="space-y-3">
            {sections.map((section, index) => (
              <div 
                key={section.id} 
                className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <button 
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-primary disabled:opacity-30 disabled:hover:text-gray-400"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleMoveDown(index)}
                      disabled={index === sections.length - 1}
                      className="p-1 text-gray-400 hover:text-primary disabled:opacity-30 disabled:hover:text-gray-400"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{sectionLabels[section.section_key] || section.section_key}</h3>
                    <p className="text-sm text-muted-foreground font-mono">{section.section_key}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{section.visible ? 'Tampil' : 'Sembunyi'}</span>
                  <Switch 
                    checked={section.visible} 
                    onCheckedChange={(val: boolean) => handleToggleVisible(section.id, val)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
