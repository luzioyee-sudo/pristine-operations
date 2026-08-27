// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, Clipboard, Trash2, Link as LinkIcon, Check, Sparkles } from 'lucide-react';

interface ImageDropzoneUploadProps {
  value?: string;
  onChange: (dataUrlOrUrl: string) => void;
  label?: string;
  helperText?: string;
}

const PRESET_BANNERS = [
  {
    name: 'Book & Reading',
    url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Vocabulary Study',
    url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Language AI',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Special Deal / Sale',
    url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Global Culture',
    url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&auto=format&fit=crop&q=80',
  },
];

/**
 * Compresses an image File to a base64 Data URL to fit cleanly in local storage and Supabase-backed payloads.
 */
async function compressImageFile(file: File, maxDim = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Try WebP first for ultra small size, fallback to JPEG
        try {
          const webpData = canvas.toDataURL('image/webp', quality);
          if (webpData.startsWith('data:image/webp')) {
            resolve(webpData);
            return;
          }
        } catch {
          // fallback
        }
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

export const ImageDropzoneUpload: React.FC<ImageDropzoneUploadProps> = ({
  value,
  onChange,
  label = 'Campaign Image Banner',
  helperText = 'Upload from your device, paste from clipboard (Ctrl+V), or select a preset',
}) => {
  const [mode, setMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [urlInput, setUrlInput] = useState(value?.startsWith('http') ? value : '');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pasteSuccess, setPasteSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  // Handle file selection from local device
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP, GIF, SVG).');
      return;
    }

    try {
      setIsProcessing(true);
      const compressedDataUrl = await compressImageFile(file);
      onChange(compressedDataUrl);
    } catch (err) {
      console.error('Error processing image:', err);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      try {
        setIsProcessing(true);
        const compressed = await compressImageFile(file);
        onChange(compressed);
      } catch (err) {
        console.error('Error dropping image:', err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Handle Paste from Clipboard
  const handlePaste = async (e: React.ClipboardEvent | ClipboardEvent) => {
    const items = (e as React.ClipboardEvent).clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          e.preventDefault();
          try {
            setIsProcessing(true);
            const compressed = await compressImageFile(blob);
            onChange(compressed);
            setPasteSuccess(true);
            setTimeout(() => setPasteSuccess(false), 2500);
          } catch (err) {
            console.error('Clipboard paste failed:', err);
          } finally {
            setIsProcessing(false);
          }
          break;
        }
      }
    }
  };

  // Listen to paste event when dropzone is focused or active
  useEffect(() => {
    const el = dropzoneRef.current;
    if (!el) return;

    const onWindowPaste = (e: ClipboardEvent) => {
      // If user is focused within dropzone or nothing specifically typing
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        // If it's another text input, let default paste happen
        return;
      }
      handlePaste(e);
    };

    window.addEventListener('paste', onWindowPaste);
    return () => window.removeEventListener('paste', onWindowPaste);
  }, []);

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  const handleClear = () => {
    onChange('');
    setUrlInput('');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-stone-700 dark:text-stone-300 font-bold text-xs">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Remove Image</span>
          </button>
        )}
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-1 p-0.5 rounded-xl bg-stone-100 dark:bg-stone-850 border border-[#D0E4FE] dark:border-stone-800 text-[11px]">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex-1 py-1 px-2.5 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            mode === 'upload'
              ? 'bg-white dark:bg-stone-750 text-[#334DAF] shadow-xs'
              : 'text-[#5D7BBE] hover:text-[#091F5C] dark:hover:text-stone-200'
          }`}
        >
          <Upload className="w-3 h-3" />
          <span>Upload / Paste</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex-1 py-1 px-2.5 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            mode === 'url'
              ? 'bg-white dark:bg-stone-750 text-[#334DAF] shadow-xs'
              : 'text-[#5D7BBE] hover:text-[#091F5C] dark:hover:text-stone-200'
          }`}
        >
          <LinkIcon className="w-3 h-3" />
          <span>Web URL</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('presets')}
          className={`flex-1 py-1 px-2.5 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            mode === 'presets'
              ? 'bg-white dark:bg-stone-750 text-[#334DAF] shadow-xs'
              : 'text-[#5D7BBE] hover:text-[#091F5C] dark:hover:text-stone-200'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>Presets</span>
        </button>
      </div>

      {/* Mode 1: Drag & Drop + Device File Upload + Clipboard Paste Zone */}
      {mode === 'upload' && (
        <div
          ref={dropzoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onPaste={handlePaste}
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[#334DAF] ${
            isDragging
              ? 'border-[#334DAF] bg-[#E8F2FE] dark:bg-[#3d2416]/50'
              : 'border-[#D0E4FE] dark:border-stone-700 hover:border-[#334DAF]/60 bg-[#E8F2FE]/50 dark:bg-stone-900/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {value ? (
            <div className="flex items-center gap-3 text-start">
              <div className="w-20 h-14 rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-800 shrink-0 border border-stone-300 dark:border-stone-700 relative">
                <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs mb-0.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Image Loaded Ready</span>
                </div>
                <p className="text-[11px] text-stone-400 truncate">
                  Click to replace or paste a new image anytime (Ctrl+V)
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 py-1">
              <div className="w-10 h-10 rounded-full bg-[#E8F2FE] dark:bg-[#3d2416] text-[#334DAF] flex items-center justify-center mx-auto shadow-2xs">
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-[#334DAF] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
              </div>
              <div className="text-xs font-bold text-[#091F5C] dark:text-stone-200">
                <span className="text-[#334DAF] underline">Click to upload from device</span> or drag & drop
              </div>
              <p className="text-[10px] text-stone-400 flex items-center justify-center gap-1">
                <Clipboard className="w-3 h-3 inline" /> Or directly paste from clipboard (<kbd className="px-1 py-0.5 bg-stone-200 dark:bg-stone-800 rounded font-mono text-[9px]">Ctrl+V</kbd>)
              </p>
            </div>
          )}

          {pasteSuccess && (
            <div className="absolute inset-0 bg-emerald-600/90 text-white rounded-2xl flex items-center justify-center gap-2 text-xs font-bold animate-in fade-in">
              <Check className="w-4 h-4" /> Pasted Image from Clipboard!
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Web Image URL */}
      {mode === 'url' && (
        <div className="flex items-center gap-2">
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-[#D0E4FE] dark:border-stone-800 bg-[#E8F2FE] dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-2 focus:ring-[#334DAF]"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3.5 py-2 rounded-xl bg-[#334DAF] text-white text-xs font-bold hover:bg-[#091F5C] transition-colors cursor-pointer shrink-0"
          >
            Apply
          </button>
        </div>
      )}

      {/* Mode 3: Curated Presets */}
      {mode === 'presets' && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {PRESET_BANNERS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onChange(preset.url);
                setUrlInput(preset.url);
              }}
              className={`group rounded-xl overflow-hidden border p-1 text-start transition-all cursor-pointer flex flex-col items-center gap-1 ${
                value === preset.url
                  ? 'border-[#334DAF] ring-2 ring-[#334DAF]/30 bg-[#E8F2FE] dark:bg-[#3d2416]/40'
                  : 'border-[#D0E4FE] dark:border-stone-800 hover:border-stone-300 bg-[#E8F2FE] dark:bg-stone-900'
              }`}
            >
              <div className="w-full h-12 rounded-lg overflow-hidden bg-stone-200 dark:bg-stone-800">
                <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <span className="text-[10px] font-bold text-stone-700 dark:text-stone-300 truncate w-full text-center">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      )}

      <p className="text-[10px] text-stone-400">{helperText}</p>
    </div>
  );
};
