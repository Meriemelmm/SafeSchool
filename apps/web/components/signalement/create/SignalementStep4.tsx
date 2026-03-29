'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  CloudUpload, FileText, Film, Trash2,
  ShieldCheck, Paperclip, FileImage,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────
interface FileWithId {
  id: string;
  file: File;
}

interface Props {
  files: FileWithId[];
  onChange: (files: FileWithId[]) => void;
}

// ── File size formatter ──────────────────────────────────────────────
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

// ── Single file item ─────────────────────────────────────────────────
function FileItem({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  const isPdf   = file.type === 'application/pdf';

  useEffect(() => {
    if (!isImage) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file, isImage]);

  return (
    <div className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all group">
      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100 flex items-center justify-center">
        {isImage && previewUrl ? (
          <img src={previewUrl} alt={file.name} className="w-full h-full object-cover" />
        ) : isPdf ? (
          <div className="flex flex-col items-center justify-center w-full h-full bg-red-50">
            <FileText className="w-6 h-6 text-red-500" />
            <span className="text-[8px] font-black text-red-400 mt-0.5">PDF</span>
          </div>
        ) : isVideo ? (
          <div className="flex flex-col items-center justify-center w-full h-full bg-orange-50">
            <Film className="w-6 h-6 text-orange-500" />
            <span className="text-[8px] font-black text-orange-400 mt-0.5">VIDEO</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full bg-blue-50">
            <FileImage className="w-6 h-6 text-blue-400" />
            <span className="text-[8px] font-black text-blue-300 mt-0.5">DOC</span>
          </div>
        )}
      </div>

      <div className="flex-grow min-w-0">
        <p className="text-sm font-bold text-gray-800 truncate">{file.name}</p>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-0.5">
          {formatBytes(file.size)}
        </p>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-200 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Main Step 4 ──────────────────────────────────────────────────────
export default function SignalementStep4({ files, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

 
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files).map(file => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
    }));
    onChange([...files, ...newFiles]);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).map(file => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
    }));
    onChange([...files, ...droppedFiles]);
  };

  // ✓ removeFile — par id, pas par index
  const removeFile = (id: string) => {
    onChange(files.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">

      {/* Drop zone */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
          <Paperclip className="w-3.5 h-3.5" />
          Téléverser des preuves
        </label>

        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex flex-col items-center justify-center py-14 px-6 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/40 cursor-pointer transition-all duration-300"
        >
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
            <CloudUpload className="w-7 h-7 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <h4 className="text-base font-bold text-gray-700 group-hover:text-indigo-700 transition-colors">
            Glissez-déposez ou cliquez pour parcourir
          </h4>
          <p className="text-sm text-gray-400 font-medium mt-1 text-center">
            Importez des photos, vidéos ou documents pour appuyer votre signalement
          </p>
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.15em] mt-5">
            TAILLE MAX : 50 MO PAR FICHIER
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
            className="hidden"
          />
        </div>
      </div>

      {/* Liste fichiers */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-gray-400" />
            <h4 className="text-sm font-bold text-gray-700">
              Fichiers joints ({files.length})
            </h4>
          </div>

          <div className="space-y-2">
            {/* ✓ key={item.id} stable + file={item.file} correct */}
            {files.map((item) => (
              <FileItem
                key={item.id}
                file={item.file}
                onRemove={() => removeFile(item.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Note sécurité */}
      <div className="flex gap-4 p-5 bg-blue-50 rounded-2xl border border-blue-100">
        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
        </div>
        <p className="text-xs font-semibold text-blue-700 leading-relaxed">
          <span className="font-black">Note de sécurité :</span> Les preuves sont chiffrées
          et accessibles uniquement aux administrateurs autorisés.
        </p>
      </div>
    </div>
  );
}