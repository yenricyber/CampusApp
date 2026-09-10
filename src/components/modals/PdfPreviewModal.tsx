import React from 'react';
import { StudentProfile } from '../../types';
import { UniversidadLatinoLogo } from '../common/UniversidadLatinoLogo';

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  student: StudentProfile;
  onDownloaded: (filename: string) => void;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  documentTitle,
  student,
  onDownloaded,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-primary-container text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-container text-[20px]">
              picture_as_pdf
            </span>
            <span className="font-headline text-[13px] font-bold truncate max-w-[280px]">
              {documentTitle}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Realistic Official Certificate Document Preview */}
        <div className="p-5 overflow-y-auto flex flex-col gap-4 bg-slate-50 font-body text-slate-800">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3.5 relative">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <svg className="w-64 h-64 text-primary-container" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 0 L90 20 L90 60 C90 80 50 100 50 100 C50 100 10 80 10 60 L10 20 Z" />
              </svg>
            </div>

            {/* University Header */}
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <div>
                <span className="font-headline text-[9px] uppercase tracking-wider text-primary-container font-bold block">
                  Universidad Latino
                </span>
                <h4 className="font-headline text-[13px] font-extrabold text-slate-900 leading-tight">
                  DIRECCIÓN DE SERVICIOS ESCOLARES
                </h4>
                <p className="text-[10px] text-slate-500 font-mono italic">
                  Unitus pro excellentia
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs">
                <UniversidadLatinoLogo size={40} />
              </div>
            </div>

            {/* Document Specific Info */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Estudiante:</span>
                <span className="font-bold text-slate-900">{student.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Matrícula:</span>
                <span className="font-mono font-bold text-primary-container">
                  {student.matricula}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Programa:</span>
                <span className="text-slate-800 font-semibold truncate max-w-[220px]">
                  {student.career}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Promedio Ponderado:</span>
                <span className="font-mono font-bold text-emerald-700">{Number(student.gpa || 0).toFixed(2)} / 10.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Estatus del Ciclo:</span>
                <span className="font-headline text-[10px] font-bold text-[#6b5f00] bg-amber-100 px-2 py-0.5 rounded">
                  {student.status}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              Por medio del presente documento oficial, se hace constar que el alumno de referencia se encuentra debidamente inscrito y al corriente en sus obligaciones académicas correspondientes al periodo <strong>Otoño 2026</strong>.
            </p>

            {/* Crypto Stamp & QR Verification Footer */}
            <div className="mt-2 pt-3 border-t border-slate-200 flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-[9px] text-slate-400">FIRMA ELECTRÓNICA AVANZADA</span>
                <span className="font-mono text-[9px] text-slate-700 font-bold break-all">
                  FEA-{student.cryptoToken.replace(/\s/g, '')}-SAT2026
                </span>
                <span className="text-[9px] text-emerald-700 flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-[12px]">check_circle</span>
                  Cadena Criptográfica Válida
                </span>
              </div>

              {/* QR */}
              <div className="p-1 bg-white border border-slate-200 rounded-lg shrink-0">
                <svg className="w-12 h-12 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v4h-4v-4zm-4 4h2v2h-2v-2zm2-4h2v2h-2v-2zm-4-2h4v2h-4v-2zm6 4h2v2h-2v-2zm-6-6h2v2h-2v-2zm2 2h2v2h-2v-2zm2-2h2v2h-2v-2zM5 5h2v2H5V5zm12 0h2v2h-2V5zM5 17h2v2H5v-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 bg-white border-t border-slate-200 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-headline text-xs font-bold transition-all"
          >
            Cerrar
          </button>
          <button
            onClick={() => {
              onDownloaded(documentTitle);
              onClose();
            }}
            className="flex-1 py-3 rounded-xl bg-secondary-container hover:brightness-105 text-[#0c0c5d] font-headline text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Descargar Archivo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
