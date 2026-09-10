import React, { useRef, useState } from 'react';
import { apiService } from '../../services/api';

interface ImportCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string) => void;
  onImportSuccess: () => void;
}

export const ImportCalendarModal: React.FC<ImportCalendarModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  onImportSuccess,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.ics')) {
      onShowToast('Por favor, selecciona un archivo válido con extensión .ics');
      return;
    }

    setIsImporting(true);
    try {
      const text = await file.text();
      const res = await apiService.importCalendar(text);
      if (res.success) {
        onShowToast(res.message || 'Calendario importado y sincronizado con tu carrera.');
        onImportSuccess();
        onClose();
      } else {
        onShowToast(res.error || 'Hubo un problema al importar el calendario.');
      }
    } catch (err) {
      onShowToast('Error al leer el archivo. Intenta de nuevo.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] w-full max-w-sm overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2 text-[#0A0A5C]">
            <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
            <h3 className="font-headline text-lg font-bold">Importar Calendario</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/50 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col items-center">
          <p className="text-sm font-body text-slate-600 text-center mb-4">
            Sube un archivo <strong>.ics</strong> para sincronizarlo con todos los compañeros de tu carrera y grado.
          </p>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isImporting && fileInputRef.current?.click()}
            className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
              isDragging 
                ? 'border-[#FADE0A] bg-[#FADE0A]/10 text-[#0A0A5C]' 
                : 'border-slate-300 bg-slate-50 text-slate-500 hover:bg-slate-100'
            } ${isImporting ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <span className={`material-symbols-outlined text-[48px] mb-2 ${isDragging ? 'text-[#FADE0A]' : 'text-slate-400'}`}>
              {isImporting ? 'sync' : 'upload_file'}
            </span>
            <span className="font-headline font-bold text-sm mb-1">
              {isImporting ? 'Procesando y sincronizando...' : 'Toca o arrastra aquí tu archivo .ics'}
            </span>
            <span className="font-mono text-xs opacity-70">
              Solo formato iCal (.ics)
            </span>
            <input
              type="file"
              accept=".ics"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={isImporting}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
