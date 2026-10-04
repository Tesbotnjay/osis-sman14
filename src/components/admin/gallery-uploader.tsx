'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, ImagePlus } from 'lucide-react';

interface GalleryUploaderProps {
  urls: string[];
  onChange: (urls: string[]) => void;
}

export function GalleryUploader({ urls, onChange }: GalleryUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
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
          continue;
        }

        newUrls.push(result.url);
      } catch {
        setError('Gagal mengupload. Periksa koneksi internet.');
      }
    }

    if (newUrls.length > 0) {
      onChange([...urls, ...newUrls]);
    }

    setUploading(false);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeUrl = (index: number) => {
    const updated = urls.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium mb-1">Gallery Foto Kenangan</label>
      
      {/* Preview grid */}
      {urls.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {urls.map((url, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <img
                src={url}
                alt={`Gallery ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '';
                  (e.target as HTMLImageElement).alt = 'Gagal load';
                  (e.target as HTMLImageElement).className = 'w-full h-full flex items-center justify-center bg-red-50 text-red-400 text-xs';
                }}
              />
              <button
                type="button"
                onClick={() => removeUrl(i)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <div className="flex flex-col gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full border-dashed border-2 py-6"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sedang mengupload ke ImgBB...
            </>
          ) : (
            <>
              <ImagePlus className="w-4 h-4 mr-2" />
              Upload Foto (bisa pilih banyak sekaligus)
            </>
          )}
        </Button>
        <p className="text-xs text-gray-500">
          Foto akan otomatis diupload ke ImgBB (gratis, tanpa boros storage). Format: JPG, PNG, WebP, GIF. Maks 32MB per foto.
        </p>
      </div>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 p-2 rounded">{error}</p>
      )}
    </div>
  );
}
