'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download } from 'lucide-react';

export default function BackupPage() {
  const handleExport = (type: string) => {
    alert('Exporting ' + type + '... (This feature requires server-side excel generation)');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Export & Backup</h1>
        <p className="text-gray-500">Download system data as Excel files.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {['Members', 'Programs', 'Events', 'W-SPIRAS', 'Gallery Metadata'].map(type => (
          <Card key={type} className="p-6 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">{type}</h3>
              <p className="text-xs text-gray-500">Export all {type.toLowerCase()} records</p>
            </div>
            <Button onClick={() => handleExport(type)} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
