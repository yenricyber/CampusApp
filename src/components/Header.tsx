import React, { useState } from 'react';
import { AppScreen } from '../types';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { UniversidadLatinoLogo } from './common/UniversidadLatinoLogo';

interface HeaderProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  onBack?: () => void;
  onOpenSearch: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onBack,
  onOpenSearch,
  onOpenProfile,
}) => {
  const { isOnline, isSimulatedOffline, toggleSimulateOffline, reconnect } = useNetworkStatus();
  const [showOfflineBanner, setShowOfflineBanner] = useState(true);

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'materias':
        return 'Materias';
      case 'calendario':
        return 'Calendario';
      case 'avisos':
        return 'Avisos';
      case 'tramites':
        return 'Trámites';
      case 'credencial':
        return 'Credencial';
      case 'detalle-materia':
        return 'Detalle De Asignatura';
      default:
        return 'Campus Conectado';
    }
  };

  const isDetail = currentScreen === 'detalle-materia';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-xl border-b border-[#0A0A5C]/5 shadow-[0_1px_8px_rgba(10,10,92,0.04)] transition-all">
      <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-between">
        {isDetail ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onBack || (() => onNavigate('materias'))}
              aria-label="Volver"
              className="w-10 h-10 -ml-1 rounded-xl flex items-center justify-center text-on-surface hover:text-primary-container hover:bg-surface-container active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="font-headline text-[17px] font-semibold text-on-surface truncate">
              Detalle De Asignatura
            </h1>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 p-0.5 flex items-center justify-center shadow-xs overflow-hidden">
              <UniversidadLatinoLogo size={32} />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-container shadow-[0_0_6px_#fce010]"></span>
                <span className="font-headline text-[10px] uppercase text-on-surface-variant font-bold tracking-wider">
                  Universidad Latino
                </span>
              </div>
              <h1 className="font-headline text-[18px] font-bold text-on-surface tracking-tight leading-tight mt-0.5">
                {getScreenTitle()}
              </h1>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          {/* TiDB Cloud Database Badge */}
          <div
            title="Conectado a TiDB Cloud Serverless (AWS us-east-1) - Base de datos institucional campus_app"
            className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-[10px] font-mono"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>TiDB Cloud</span>
          </div>

          {/* Subtle Network Status Indicator */}
          {isOnline ? (
            <button
              onClick={toggleSimulateOffline}
              title="Dispositivo en línea. Haz clic para simular modo offline"
              aria-label="Estado de red: En línea"
              className="group flex items-center gap-1 px-2 py-1 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 transition-colors text-[11px] font-mono"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover:text-slate-600">
                wifi
              </span>
            </button>
          ) : (
            <button
              onClick={toggleSimulateOffline}
              title="Dispositivo sin conexión a internet. Haz clic para restablecer"
              aria-label="Estado de red: Sin conexión"
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 text-[11px] font-mono font-bold animate-pulse hover:bg-amber-500/25 transition-all shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_6px_#f59e0b]"></span>
              <span className="material-symbols-outlined text-[15px] text-amber-700">
                wifi_off
              </span>
              <span className="text-[10px] hidden sm:inline">Offline</span>
            </button>
          )}

          <button
            onClick={onOpenSearch}
            aria-label="Búsqueda académica"
            className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          <button
            onClick={onOpenProfile}
            aria-label="Perfil del estudiante"
            className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-[0_2px_8px_rgba(10,10,92,0.18)] hover:scale-105 active:scale-95 transition-transform overflow-hidden border border-secondary-container/40"
          >
            <span className="material-symbols-outlined text-secondary-container text-[18px]">person</span>
          </button>
        </div>
      </div>

      {/* Offline Warning Notice Banner */}
      {!isOnline && showOfflineBanner && (
        <div className="bg-amber-50/95 border-t border-amber-200/80 px-4 py-2.5 backdrop-blur-md shadow-inner transition-all animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="max-w-md mx-auto flex items-start justify-between gap-2.5">
            <div className="flex items-start gap-2 min-w-0">
              <span className="material-symbols-outlined text-[18px] text-amber-600 shrink-0 mt-0.5">
                cloud_off
              </span>
              <div className="text-[11px] font-body text-amber-900 leading-snug">
                <span className="font-headline font-bold text-amber-950">
                  Modo sin conexión activo:
                </span>{' '}
                <span>
                  Solo los datos en caché y las funciones de credencial digital offline están disponibles.
                </span>
                <div className="flex items-center gap-3 mt-1.5">
                  <button
                    onClick={() => onNavigate('credencial')}
                    className="inline-flex items-center gap-1 text-[11px] font-headline font-bold text-[#0A0A5C] bg-[#FADE0A] hover:bg-[#ebd009] px-2 py-0.5 rounded-md shadow-xs active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[13px]">badge</span>
                    <span>Ver Credencial Offline</span>
                  </button>
                  {isSimulatedOffline && (
                    <button
                      onClick={reconnect}
                      className="text-[10px] font-mono text-amber-800 hover:text-amber-950 underline underline-offset-1"
                    >
                      Restablecer conexión
                    </button>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowOfflineBanner(false)}
              aria-label="Cerrar advertencia de conexión"
              className="text-amber-700/60 hover:text-amber-900 p-0.5 rounded transition shrink-0"
              title="Ocultar aviso"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
