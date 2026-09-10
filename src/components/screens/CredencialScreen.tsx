import React from 'react';
import { StudentProfile } from '../../types';
import { UniversidadLatinoLogo } from '../common/UniversidadLatinoLogo';

interface CredencialScreenProps {
  student: StudentProfile;
  onSaveToWallet: () => void;
  onDownloadPdf: () => void;
  onShowToast: (message: string) => void;
}

export const CredencialScreen: React.FC<CredencialScreenProps> = ({
  student,
  onSaveToWallet,
  onDownloadPdf,
  onShowToast,
}) => {
  return (
    <div className="flex flex-col w-full px-4 gap-4 pb-28 pt-20 max-w-md mx-auto">
      {/* Offline Status Banner */}
      <div className="w-full bg-surface-container-high rounded-xl p-3 shadow-xs border border-[#dfe1f9] flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary-container text-secondary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">cloud_done</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse shadow-[0_0_6px_#fce010]"></span>
              <span className="font-headline text-[13px] font-bold text-on-surface truncate">
                Modo Offline Activo
              </span>
            </div>
            <span className="font-body text-[11px] text-on-surface-variant truncate">
              Sincronizado hoy a las 08:00 hrs con firma SHA-256
            </span>
          </div>
        </div>

        <div className="shrink-0 bg-primary-container/10 px-2 py-1 rounded-md border border-primary-container/20">
          <span className="font-mono text-[10px] text-primary-container font-bold uppercase tracking-wider">
            Cripto-Válida
          </span>
        </div>
      </div>

      {/* Credencial Digital Container (Interactive Card) */}
      <div
        className="relative w-full rounded-2xl bg-primary-container text-white shadow-xl overflow-hidden p-4 flex flex-col justify-between border border-white/10"
        style={{ minHeight: '495px' }}
      >
        {/* Ambient Geometric Watermark */}
        <div className="absolute -right-12 -top-12 opacity-5 pointer-events-none text-white">
          <svg fill="currentColor" height="260" viewBox="0 0 100 100" width="260">
            <path d="M50 0 L90 20 L90 60 C90 80 50 100 50 100 C50 100 10 80 10 60 L10 20 Z" />
          </svg>
        </div>

        {/* Top Ribbon: University Header & Security Hologram */}
        <div className="relative z-10 flex items-start justify-between gap-2 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center shadow-md shrink-0 border border-white/20">
              <UniversidadLatinoLogo size={36} />
            </div>
            <div className="flex flex-col">
              <span className="font-headline text-[10px] tracking-wider text-secondary-container uppercase leading-tight font-bold">
                Universidad Latino
              </span>
              <h2 className="font-headline text-[13px] text-white uppercase tracking-tight font-bold">
                Credencial Oficial Estudiantil
              </h2>
            </div>
          </div>

          {/* Holographic Security Stamp */}
          <div className="relative shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-secondary-container/20 via-white/30 to-secondary-container/10 backdrop-blur-md shadow-inner border border-white/20">
            <svg
              className="w-5 h-5 text-secondary-container animate-pulse"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              viewBox="0 0 24 24"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
        </div>

        {/* Student Bio & Photo Module */}
        <div className="relative z-10 flex gap-3 my-2 items-center">
          <div className="relative shrink-0">
            <div className="w-24 h-28 rounded-xl overflow-hidden shadow-lg bg-surface-container-high border border-white/20">
              <img
                className="w-full h-full object-cover"
                alt="Retrato de estudiante Sofía Martínez Reyes"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB93_sZuj9NOv_NGlYA9idEJMWvUByf74-kV80PwlL1vhJhhSoiGz7rzHKSseu8LzOKWhEcslUyi7E2W_IKK_6V72sf4qi0UA1SGx6teEe71EGSk4SLQs9NXsSb7mQ1svvk5xx8tyX9taehxrXoywi_LNjaJX0XzLWNEuvWvRXOTDtZ-QpvBqf9OgnpjjG5pmZ__U2JXGPOpbNAOJcvJ4pS4K3n2M4KTlH7mvWfmshOamxSk9K3VOSI"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-secondary-container text-primary-container px-1.5 py-0.5 rounded text-[9px] font-mono font-bold shadow-sm">
              REGULAR
            </div>
          </div>

          <div className="flex flex-col flex-1 min-w-0 justify-center">
            <span className="font-headline text-[10px] text-secondary-container uppercase tracking-wide font-bold">
              Alumna Activa
            </span>
            <h3 className="font-headline text-[16px] text-white font-bold truncate leading-snug">
              {student.name}
            </h3>
            <p className="font-body text-[11px] text-surface-variant font-medium line-clamp-1">
              {student.career}
            </p>

            <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 pt-2 bg-white/5 rounded-lg p-2 border border-white/10">
              <div>
                <p className="font-headline text-[9px] text-[#9fa5e8] uppercase font-bold">Matrícula</p>
                <p className="font-mono text-[13px] text-secondary-container tracking-wider font-bold">
                  {student.matricula}
                </p>
              </div>
              <div>
                <p className="font-headline text-[9px] text-[#9fa5e8] uppercase font-bold">Semestre</p>
                <p className="font-mono text-[12px] text-white font-semibold">{student.semester}</p>
              </div>
              <div>
                <p className="font-headline text-[9px] text-[#9fa5e8] uppercase font-bold">Vigencia</p>
                <p className="font-mono text-[11px] text-white font-medium">{student.validity}</p>
              </div>
              <div>
                <p className="font-headline text-[9px] text-[#9fa5e8] uppercase font-bold">Tipo Sangre</p>
                <p className="font-mono text-[12px] text-secondary-container font-bold">{student.bloodType}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Digital Access Codes Grid */}
        <div className="relative z-10 bg-white text-on-surface rounded-xl p-3 shadow-md mt-1 border border-slate-200">
          <div className="flex items-center justify-between gap-3">
            {/* Torniquetes Dynamic High-Res QR */}
            <div className="flex flex-col items-center shrink-0">
              <div
                onClick={() => onShowToast('Código QR dinámico válido para torniquetes (SHA-256)')}
                className="p-1.5 bg-white rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              >
                {/* Crisp QR Vector */}
                <svg className="w-20 h-20 text-on-surface" fill="currentColor" viewBox="0 0 100 100">
                  <rect fill="none" height="30" rx="3" stroke="currentColor" strokeWidth="6" width="30" x="5" y="5" />
                  <rect height="12" width="12" x="14" y="14" />
                  <rect fill="none" height="30" rx="3" stroke="currentColor" strokeWidth="6" width="30" x="65" y="5" />
                  <rect height="12" width="12" x="74" y="14" />
                  <rect fill="none" height="30" rx="3" stroke="currentColor" strokeWidth="6" width="30" x="5" y="65" />
                  <rect height="12" width="12" x="14" y="74" />
                  <rect height="8" width="8" x="42" y="10" />
                  <rect height="12" width="6" x="54" y="18" />
                  <rect height="6" width="14" x="42" y="30" />
                  <rect height="12" width="8" x="10" y="44" />
                  <rect height="6" width="12" x="24" y="48" />
                  <rect height="10" width="10" x="45" y="45" />
                  <rect height="6" width="10" x="62" y="42" />
                  <rect height="8" width="14" x="78" y="45" />
                  <rect height="16" width="8" x="42" y="65" />
                  <rect height="6" width="14" x="54" y="70" />
                  <rect height="14" width="16" x="74" y="68" />
                  <rect height="8" width="10" x="54" y="85" />
                  <rect height="6" width="6" x="88" y="88" />
                </svg>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
                <span className="font-mono text-[9px] text-on-surface-variant uppercase font-bold tracking-tight">
                  Torniquetes
                </span>
              </div>
            </div>

            {/* Central Library Optical Barcode */}
            <div className="flex flex-col flex-1 min-w-0 justify-center items-center pl-1">
              <span className="font-headline text-[9px] text-on-surface-variant font-bold uppercase tracking-wider text-center mb-1">
                Préstamo Biblioteca Central
              </span>
              
              {/* High-Contrast Vector Barcode */}
              <div className="w-full flex items-stretch justify-center h-10 bg-white px-1">
                <div className="w-1 bg-black mr-0.5"></div>
                <div className="w-2 bg-black mr-1"></div>
                <div className="w-0.5 bg-black mr-0.5"></div>
                <div className="w-1.5 bg-black mr-1"></div>
                <div className="w-3 bg-black mr-0.5"></div>
                <div className="w-0.5 bg-black mr-0.5"></div>
                <div className="w-1 bg-black mr-1"></div>
                <div className="w-2 bg-black mr-0.5"></div>
                <div className="w-0.5 bg-black mr-1"></div>
                <div className="w-2.5 bg-black mr-0.5"></div>
                <div className="w-1 bg-black mr-0.5"></div>
                <div className="w-2 bg-black mr-1"></div>
                <div className="w-0.5 bg-black mr-0.5"></div>
                <div className="w-1.5 bg-black mr-1"></div>
                <div className="w-2 bg-black mr-0.5"></div>
                <div className="w-0.5 bg-black mr-0.5"></div>
                <div className="w-1 bg-black mr-1"></div>
                <div className="w-3 bg-black"></div>
              </div>
              <p className="font-mono text-[11px] text-on-surface tracking-widest font-bold mt-1">
                {student.barcode}
              </p>
            </div>
          </div>
        </div>

        {/* Security Microprint Strip */}
        <div className="relative z-10 flex items-center justify-between pt-2 text-[#9fa5e8] text-[10px] font-mono">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-secondary-container">
              verified_user
            </span>
            <span>TOKEN CRIPTOGRÁFICO OFFLINE</span>
          </div>
          <span className="text-secondary-container font-bold">{student.cryptoToken}</span>
        </div>
      </div>

      {/* Quick NFC / Scanner Notice */}
      <div className="w-full bg-surface-container rounded-xl p-3 flex items-center gap-3 border border-[#dfe1f9]">
        <div className="w-9 h-9 rounded-lg bg-surface-container-high text-primary-container flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[20px]">sensors</span>
        </div>
        <div className="flex flex-col min-w-0">
          <p className="font-headline text-[13px] font-bold text-on-surface">
            NFC y Escaneo de Barras activo
          </p>
          <p className="font-body text-[11px] text-on-surface-variant leading-snug">
            Presente la pantalla en los lectores de acceso del edificio A, B y biblioteca.
          </p>
        </div>
      </div>

      {/* Primary Interactive Actions */}
      <div className="flex flex-col space-y-2 pt-1">
        {/* Action 1: Digital Wallets */}
        <button
          onClick={onSaveToWallet}
          type="button"
          className="w-full h-12 bg-secondary-container text-primary-container rounded-xl font-headline text-[13px] font-bold flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-transform"
          style={{ boxShadow: '0 4px 14px rgba(250, 222, 10, 0.35)' }}
        >
          <svg
            className="w-5 h-5 shrink-0 text-[#0c0c5d]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
            <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
            <circle cx="18" cy="16" r="1" />
          </svg>
          <span className="text-[#0c0c5d]">Guardar en Apple / Google Wallet</span>
        </button>

        {/* Action 2: PDF Export */}
        <button
          onClick={onDownloadPdf}
          type="button"
          className="w-full h-12 bg-surface-container-lowest text-primary-container rounded-xl font-headline text-[13px] font-bold flex items-center justify-center gap-2 shadow-xs border border-[#e3e8f3] hover:bg-surface-container transition-colors active:scale-[0.99]"
        >
          <svg
            className="w-5 h-5 shrink-0 text-primary-container"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
          <span>Descargar Credencial en PDF</span>
        </button>
      </div>
    </div>
  );
};
