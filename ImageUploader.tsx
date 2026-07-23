import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Check, Sparkles } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  allImages: string[];
}

export default function ImageUploader({ value, onChange, label, allImages }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isCompacting, setIsCompacting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress and resize image using HTML Canvas client-side
  const processAndSetFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WEBP, etc).');
      return;
    }

    setIsCompacting(true);
    try {
      const base64 = await compressImage(file, 800, 600, 0.7);
      onChange(base64);
    } catch (err) {
      console.error('Error compressing image:', err);
      // Fallback to reading raw base64 if canvas processing fails
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompacting(false);
    }
  };

  const compressImage = (file: File, maxWidth = 800, maxHeight = 600, quality = 0.75): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = (err) => reject(err);
        img.src = e.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processAndSetFile(files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processAndSetFile(files[0]);
    }
  };

  return (
    <div className="space-y-3.5 p-4 bg-neutral-900/40 border border-neutral-800 rounded-2xl">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-black uppercase tracking-wider text-neutral-400">{label}</label>
          {value && value.startsWith('data:image') && (
            <span className="text-[9px] font-bold text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Uploaded Image</span>
            </span>
          )}
        </div>
      )}

      {/* Upload Zone & Preview Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Preview Panel */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-neutral-950 border border-neutral-800 rounded-xl relative min-h-[120px] overflow-hidden group">
          {value ? (
            <>
              <img
                src={value}
                alt="Image preview"
                className="w-full h-24 object-cover rounded-lg border border-neutral-800"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute inset-0 bg-rose-950/90 text-rose-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold cursor-pointer"
              >
                Clear Image
              </button>
            </>
          ) : (
            <div className="text-center p-4">
              <ImageIcon className="w-7 h-7 text-neutral-600 mx-auto mb-1.5" />
              <span className="text-[10px] font-semibold text-neutral-500">No image set</span>
            </div>
          )}
        </div>

        {/* Drag-and-Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`md:col-span-8 flex flex-col items-center justify-center p-5 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            isDragging
              ? 'border-sky-500 bg-sky-500/5 text-sky-400 scale-[0.99]'
              : 'border-neutral-800 hover:border-neutral-700 bg-neutral-950/40 text-neutral-400 hover:text-neutral-300'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <Upload className={`w-6 h-6 mb-2 ${isDragging ? 'text-sky-400' : 'text-neutral-500'}`} />
          {isCompacting ? (
            <p className="text-[11px] font-bold text-sky-400 animate-pulse text-center">
              Processing & Compressing...
            </p>
          ) : (
            <>
              <p className="text-xs font-bold text-center">
                Drag image here, or <span className="text-sky-400 underline">browse</span>
              </p>
              <p className="text-[10px] text-neutral-500 mt-1 text-center">
                JPG, PNG, WebP up to 10MB (will be auto-compressed)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Manual URL Input (for fallback/fine-tuning) */}
      <div className="space-y-1.5 pt-1">
        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide">Or paste Image URL directly</label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://images.unsplash.com/photo-..."
          className="w-full px-3.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-300 focus:outline-none focus:border-sky-500"
        />
      </div>

      {/* Quick-Select Media Gallery */}
      {allImages && allImages.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-neutral-800/60">
          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide block">Select from Media Gallery</label>
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-800">
            {allImages.map((imgUrl, i) => {
              const isSelected = value === imgUrl;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onChange(imgUrl)}
                  className={`w-14 h-14 rounded-lg overflow-hidden relative shrink-0 border-2 transition-all group cursor-pointer ${
                    isSelected ? 'border-sky-500 scale-95 shadow-lg' : 'border-neutral-800 hover:border-neutral-700'
                  }`}
                  title="Select image from gallery"
                >
                  <img
                    src={imgUrl}
                    alt="Gallery item"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-sky-950/60 flex items-center justify-center">
                      <Check className="w-4 h-4 text-sky-400" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
