import React from 'react';
import { ScreenType } from '../types';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-surface/90 backdrop-blur-xl border-t border-surface-container shadow-[0_-4px_16px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-around h-16 px-space-xs max-w-md mx-auto">
        {/* Inicio */}
        <button
          type="button"
          onClick={() => onNavigate('inicio')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-space-2xs px-space-xs transition-colors ${
            currentScreen === 'inicio' ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: currentScreen === 'inicio' ? "'FILL' 1" : "'FILL' 0" }}
          >
            dashboard
          </span>
          <span className="font-label-sm text-label-sm mt-space-2xs">Inicio</span>
        </button>

        {/* Calendario */}
        <button
          type="button"
          onClick={() => onNavigate('calendario')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-space-2xs px-space-xs transition-colors ${
            currentScreen === 'calendario' ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: currentScreen === 'calendario' ? "'FILL' 1" : "'FILL' 0" }}
          >
            calendar_today
          </span>
          <span className="font-label-sm text-label-sm mt-space-2xs">Calendario</span>
        </button>

        {/* Nuevo (Central action button) */}
        <button
          type="button"
          onClick={() => onNavigate('registro-rapido')}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-space-2xs px-space-xs text-on-surface-variant hover:text-on-surface group"
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(30,58,138,0.25)] transition-transform active:scale-95 ${
              currentScreen === 'registro-rapido' ? 'bg-primary text-on-primary ring-2 ring-primary-fixed' : 'bg-primary-container text-on-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">add</span>
          </div>
          <span className={`font-label-sm text-label-sm mt-space-2xs ${currentScreen === 'registro-rapido' ? 'text-primary font-semibold' : ''}`}>
            Nuevo
          </span>
        </button>

        {/* Perfil */}
        <button
          type="button"
          onClick={() => onNavigate('registro')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-space-2xs px-space-xs transition-colors ${
            currentScreen === 'registro' || currentScreen === 'login' || currentScreen === 'recuperar'
              ? 'text-primary font-semibold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{
              fontVariationSettings:
                currentScreen === 'registro' || currentScreen === 'login' || currentScreen === 'recuperar'
                  ? "'FILL' 1"
                  : "'FILL' 0",
            }}
          >
            person
          </span>
          <span className="font-label-sm text-label-sm mt-space-2xs">Perfil</span>
        </button>
      </div>
    </nav>
  );
};
