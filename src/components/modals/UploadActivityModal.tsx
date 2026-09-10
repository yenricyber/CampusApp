import React, { useState } from 'react';

interface UploadActivityModalProps {
  activityTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (fileName: string) => void;
}

export const UploadActivityModal: React.FC<UploadActivityModalProps> = ({
  activityTitle,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleConfirm = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      onSubmit(selectedFile ? selectedFile.name : 'Entregable_Sofia_Martinez.pdf');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl border border-slate-200 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary-container text-secondary-container flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">upload_file</span>
            </div>
            <div>
              <span className="font-headline text-[10px] text-primary-container font-bold uppercase tracking-wider">
                Entrega Oficial en Plataforma
              </span>
              <h3 className="font-headline text-[16px] font-bold text-on-surface truncate max-w-[260px]">
                {activityTitle}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all ${
            dragActive
              ? 'border-primary-container bg-primary-container/5 scale-[1.01]'
              : 'border-slate-300 bg-slate-50 hover:bg-slate-100/70'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-primary-container/10 text-primary-container flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-[26px]">cloud_upload</span>
          </div>

          <p className="font-headline text-[14px] font-bold text-slate-800">
            {selectedFile ? selectedFile.name : 'Arrastra tu archivo aquí'}
          </p>
          <p className="font-body text-[12px] text-slate-500 mt-0.5">
            Formatos admitidos: PDF, ZIP, DOCX (máx. 25 MB)
          </p>

          <label className="mt-3 px-4 py-2 rounded-xl bg-primary-container text-white text-xs font-headline font-bold cursor-pointer hover:bg-black transition-all shadow-xs">
            <span>O selecciona desde tu dispositivo</span>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.zip,.docx,.rar"
            />
          </label>
        </div>

        {/* Comentarios para el docente */}
        <div>
          <label className="block font-headline text-[11px] font-bold text-slate-700 mb-1">
            Comentario o Enlace Complementario (Opcional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Añade una nota explicativa o liga a repositorio GitHub..."
            rows={2}
            className="w-full text-xs font-body p-3 rounded-xl border border-slate-200 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none bg-slate-50"
          />
        </div>

        <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200/60 flex items-center gap-2 text-[11px] text-amber-900 font-mono">
          <span className="material-symbols-outlined text-[16px] text-amber-700">lock_clock</span>
          <span>Se registrará tu entrega con sello de tiempo institucional SHA-256.</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-headline text-xs font-bold transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isUploading}
            className="flex-1 py-3 rounded-xl bg-secondary-container hover:brightness-105 text-[#0c0c5d] font-headline text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[#0c0c5d] border-t-transparent rounded-full animate-spin"></span>
                <span>Enviando...</span>
              </span>
            ) : (
              <>
                <span>Confirmar Entrega</span>
                <span className="material-symbols-outlined text-[16px]">send</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
