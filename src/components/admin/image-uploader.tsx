'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

export function ImageUploader({ label, value, onChange, placeholder }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload-imgbb', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Gagal mengupload gambar.');
        return;
      }

      onChange(result.url);
    } catch {
      setError('Gagal mengupload. Periksa koneksi internet.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder={placeholder || 'https://...'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="shrink-0"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
          </Button>
          {value && (
            <Button
              type="button"
              variant="outline"
              onClick={() => onChange('')}
              className="shrink-0 text-red-500 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        {uploading && <p className="text-xs text-blue-500">Sedang mengupload ke ImgBB...</p>}
        {error && <p className="text-xs text-red-500">{error}</p>}
        {value && (
          <img src={value} alt="Preview" className="h-20 object-cover rounded border" />
        )}
      </div>
    </div>
  );
}
