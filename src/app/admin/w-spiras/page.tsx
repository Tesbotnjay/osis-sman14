'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Spinner } from '@/components/ui/spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';

export default function WSpirasPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [filter, setFilter] = useState('Semua');
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);
  const supabase = createClient();

  const tabs = ['Semua', 'Baru', 'Dibaca', 'Diproses', 'Selesai', 'Spam'];

  const statusMap: Record<string, string> = {
    new: 'Baru', baru: 'Baru',
    read: 'Dibaca', dibaca: 'Dibaca',
    processing: 'Diproses', diproses: 'Diproses',
    completed: 'Selesai', selesai: 'Selesai',
    spam: 'Spam',
  };

  const categoryMap: Record<string, string> = {
    aspirasi: 'Aspirasi',
    saran: 'Saran',
    kritik: 'Kritik',
  };

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
    const s = m.status || 'new';
    if (filter === 'Baru') return s === 'new' || s === 'baru';
    if (filter === 'Dibaca') return s === 'read' || s === 'dibaca';
    if (filter === 'Diproses') return s === 'processing' || s === 'diproses';
    if (filter === 'Selesai') return s === 'completed' || s === 'selesai';
    if (filter === 'Spam') return s === 'spam';
    return true;
  });

  const exportPDF = () => {
    setIsExporting(true);
    try {
      const dataToExport = filtered;
      if (dataToExport.length === 0) {
        alert('Tidak ada data untuk di-export.');
        setIsExporting(false);
        return;
      }

      const now = new Date();
      const dateStr = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
      const filterLabel = filter;

      let tableRows = '';
      dataToExport.forEach((item: any, idx: number) => {
        const status = statusMap[item.status] || item.status || 'Baru';
        const category = categoryMap[item.category] || item.category || '-';
        const sender = item.name || 'Anonymous';
        const kelas = item.class || '-';
        const date = new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const msg = (item.message || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        tableRows += `
          <tr style="${idx % 2 === 0 ? 'background:#f8f9fc;' : ''}">
            <td style="border:1px solid #ccc;padding:8px;text-align:center;">${idx + 1}</td>
            <td style="border:1px solid #ccc;padding:8px;">${sender}</td>
            <td style="border:1px solid #ccc;padding:8px;">${kelas}</td>
            <td style="border:1px solid #ccc;padding:8px;">${category}</td>
            <td style="border:1px solid #ccc;padding:8px;">${msg}</td>
            <td style="border:1px solid #ccc;padding:8px;text-align:center;">${status}</td>
            <td style="border:1px solid #ccc;padding:8px;text-align:center;">${date}</td>
          </tr>`;
      });

      // Count by status
      const countBaru = dataToExport.filter((m: any) => m.status === 'new' || m.status === 'baru').length;
      const countDibaca = dataToExport.filter((m: any) => m.status === 'read' || m.status === 'dibaca').length;
      const countDiproses = dataToExport.filter((m: any) => m.status === 'processing' || m.status === 'diproses').length;
      const countSelesai = dataToExport.filter((m: any) => m.status === 'completed' || m.status === 'selesai').length;
      const countSpam = dataToExport.filter((m: any) => m.status === 'spam').length;

      // Count by category
      const countAspirasi = dataToExport.filter((m: any) => m.category === 'aspirasi').length;
      const countSaran = dataToExport.filter((m: any) => m.category === 'saran').length;
      const countKritik = dataToExport.filter((m: any) => m.category === 'kritik').length;

      const html = `
        <!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="utf-8">
          <title>Laporan W-SPIRAS</title>
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .no-print { display: none !important; }
              @page { size: landscape; margin: 1.5cm; }
            }
            body { font-family: 'Segoe UI', Arial, sans-serif; color: #31487A; margin: 0; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #31487A; padding-bottom: 20px; }
            .header h1 { font-size: 22px; margin: 0 0 4px 0; color: #31487A; }
            .header h2 { font-size: 16px; margin: 0 0 4px 0; color: #31487A; font-weight: normal; }
            .header p { font-size: 12px; color: #666; margin: 4px 0 0 0; }
            .summary { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
            .summary-card { flex: 1; min-width: 100px; background: #f0f4fa; border: 1px solid #D9E1F1; border-radius: 8px; padding: 12px; text-align: center; }
            .summary-card .num { font-size: 24px; font-weight: bold; color: #31487A; }
            .summary-card .label { font-size: 11px; color: #666; margin-top: 2px; }
            .section-title { font-size: 14px; font-weight: bold; color: #31487A; margin: 20px 0 10px 0; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th { background: #31487A; color: white; padding: 10px 8px; text-align: left; border: 1px solid #31487A; }
            td { padding: 8px; vertical-align: top; }
            .footer { text-align: center; margin-top: 30px; padding-top: 15px; border-top: 2px solid #D9E1F1; font-size: 11px; color: #999; }
            .print-btn { position: fixed; top: 20px; right: 20px; background: #31487A; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; cursor: pointer; z-index: 999; }
            .print-btn:hover { background: #253a63; }
          </style>
        </head>
        <body>
          <button class="print-btn no-print" onclick="window.print()">🖨️ Cetak / Save PDF</button>

          <div class="header">
            <h1>LAPORAN W-SPIRAS</h1>
            <h2>OSIS SMA Negeri 14 Samarinda - Periode 2026/2027</h2>
            <p>Tanggal Cetak: ${dateStr} | Filter: ${filterLabel} | Total: ${dataToExport.length} pesan</p>
          </div>

          <div class="summary">
            <div class="summary-card"><div class="num">${dataToExport.length}</div><div class="label">Total</div></div>
            <div class="summary-card"><div class="num">${countBaru}</div><div class="label">Baru</div></div>
            <div class="summary-card"><div class="num">${countDibaca}</div><div class="label">Dibaca</div></div>
            <div class="summary-card"><div class="num">${countDiproses}</div><div class="label">Diproses</div></div>
            <div class="summary-card"><div class="num">${countSelesai}</div><div class="label">Selesai</div></div>
            <div class="summary-card"><div class="num">${countSpam}</div><div class="label">Spam</div></div>
          </div>

          <div class="summary">
            <div class="summary-card"><div class="num">${countAspirasi}</div><div class="label">Aspirasi</div></div>
            <div class="summary-card"><div class="num">${countSaran}</div><div class="label">Saran</div></div>
            <div class="summary-card"><div class="num">${countKritik}</div><div class="label">Kritik</div></div>
          </div>

          <div class="section-title">Daftar Aspirasi, Saran & Kritik</div>
          <table>
            <thead>
              <tr>
                <th style="width:30px;">No</th>
                <th>Pengirim</th>
                <th>Kelas</th>
                <th>Kategori</th>
                <th>Pesan</th>
                <th>Status</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>

          <div class="footer">
            Dokumen ini digenerate secara otomatis oleh Sistem W-SPIRAS OSIS SMA Negeri 14 Samarinda.<br>
            © ${now.getFullYear()} OSIS SMA Negeri 14 Samarinda
          </div>
        </body>
        </html>
      `;

      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (win) {
        win.onload = () => URL.revokeObjectURL(url);
      }
    } catch (error) {
      alert('Gagal membuat laporan PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportCSV = () => {
    const dataToExport = filtered;
    if (dataToExport.length === 0) {
      alert('Tidak ada data untuk di-export.');
      return;
    }

    const headers = ['No', 'Pengirim', 'Kelas', 'Kategori', 'Pesan', 'Status', 'Tanggal'];
    const rows = dataToExport.map((item: any, idx: number) => {
      const status = statusMap[item.status] || item.status || 'Baru';
      const category = categoryMap[item.category] || item.category || '-';
      const sender = item.name || 'Anonymous';
      const kelas = item.class || '-';
      const date = new Date(item.created_at).toLocaleDateString('id-ID');
      const msg = (item.message || '').replace(/"/g, '""');
      return [idx + 1, `"${sender}"`, `"${kelas}"`, `"${category}"`, `"${msg}"`, `"${status}"`, `"${date}"`].join(',');
    });

    const csv = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wspiras_laporan_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-1">W-SPIRAS</h1>
          <p className="text-gray-500 text-sm">Wadah Aspirasi Siswa - Kelola aspirasi, saran & kritik siswa.</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button onClick={exportPDF} variant="outline" size="sm" disabled={isExporting} className="gap-1.5">
            <FileText className="w-4 h-4" />
            Export PDF
          </Button>
          <Button onClick={exportCSV} variant="outline" size="sm" className="gap-1.5">
            <FileSpreadsheet className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
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
            {tab !== 'Semua' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({messages.filter(m => {
                  const s = m.status || 'new';
                  if (tab === 'Baru') return s === 'new' || s === 'baru';
                  if (tab === 'Dibaca') return s === 'read' || s === 'dibaca';
                  if (tab === 'Diproses') return s === 'processing' || s === 'diproses';
                  if (tab === 'Selesai') return s === 'completed' || s === 'selesai';
                  if (tab === 'Spam') return s === 'spam';
                  return false;
                }).length})
              </span>
            )}
          </Button>
        ))}
      </div>

      <Card className="p-4 border-secondary bg-white">
        {loading ? <div className="py-12 flex justify-center"><Spinner /></div> : 
         filtered.length === 0 ? <EmptyState title="Tidak ada pesan" description="Coba filter lain." /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/30 text-primary">
                <tr>
                  <th className="px-4 py-3 font-semibold">Pengirim</th>
                  <th className="px-4 py-3 font-semibold">Kategori</th>
                  <th className="px-4 py-3 font-semibold">Pesan</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary">
                {filtered.map(item => (
                  <tr key={item.id} onClick={() => setSelectedMsg(item)} className="hover:bg-secondary/10 cursor-pointer">
                    <td className="px-4 py-3">{item.name || 'Anonymous'} {item.class ? `(${item.class})` : ''}</td>
                    <td className="px-4 py-3"><Badge variant="outline">{categoryMap[item.category] || item.category}</Badge></td>
                    <td className="px-4 py-3 truncate max-w-xs">{item.message}</td>
                    <td className="px-4 py-3"><Badge>{statusMap[item.status] || item.status || 'Baru'}</Badge></td>
                    <td className="px-4 py-3">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal isOpen={!!selectedMsg} onClose={() => setSelectedMsg(null)} title="Detail Pesan">
        {selectedMsg && (
          <div className="space-y-4">
            <div><strong>Pengirim:</strong> {selectedMsg.name || 'Anonymous'}</div>
            <div><strong>Kelas:</strong> {selectedMsg.class || '-'}</div>
            <div><strong>Kategori:</strong> {categoryMap[selectedMsg.category] || selectedMsg.category}</div>
            <div><strong>Tanggal:</strong> {new Date(selectedMsg.created_at).toLocaleString('id-ID')}</div>
            <div><strong>Status:</strong> {statusMap[selectedMsg.status] || selectedMsg.status || 'Baru'}</div>
            <div>
              <strong>Pesan:</strong>
              <div className="mt-2 p-3 bg-secondary/20 rounded-md border border-secondary text-sm whitespace-pre-wrap">
                {selectedMsg.message}
              </div>
            </div>
            
            <div className="pt-4 border-t flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(selectedMsg.id, 'dibaca')}>Tandai Dibaca</Button>
              <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(selectedMsg.id, 'diproses')}>Proses</Button>
              <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(selectedMsg.id, 'selesai')}>Selesai</Button>
              <Button size="sm" variant="danger" onClick={() => handleUpdateStatus(selectedMsg.id, 'spam')}>Spam</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
