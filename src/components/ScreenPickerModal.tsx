import React from 'react';
import { ScreenType } from '../types';

interface ScreenPickerModalProps {
  isOpen: boolean;
  currentScreen: ScreenType;
  onClose: () => void;
  onSelectScreen: (screen: ScreenType) => void;
}

export const ScreenPickerModal: React.FC<ScreenPickerModalProps> = ({
  isOpen,
  currentScreen,
  onClose,
  onSelectScreen,
}) => {
  if (!isOpen) return null;

  const screens: { id: ScreenType; name: string; subtitle: string; icon: string; category: string }[] = [
    {
      id: 'inicio',
      name: 'Inicio',
      subtitle: 'Dashboard estudiantil, métricas y tareas prioritarias',
      icon: 'dashboard',
      category: 'Principal',
    },
    {
      id: 'calendario',
      name: 'Calendario',
      subtitle: 'Línea de tiempo semanal, entregas y filtros',
      icon: 'calendar_month',
      category: 'Principal',
    },
    {
      id: 'registro-rapido',
      name: 'Registro Rápido',
      subtitle: 'Formulario para nueva tarea académica y adjuntos',
      icon: 'edit_note',
      category: 'Gestión',
    },
    {
      id: 'detalle-tarea',
      name: 'Detalle De Tarea',
      subtitle: 'Estado, subidas, profesor, avance de subtareas y bina',
      icon: 'assignment',
      category: 'Gestión',
    },
    {
      id: 'login',
      name: 'Iniciar Sesión',
      subtitle: 'Portal de acceso seguro estudiantil institucional',
      icon: 'login',
      category: 'Autenticación',
    },
    {
      id: 'registro',
      name: 'Crea tu Cuenta',
      subtitle: 'Registro institucional y validación académica',
      icon: 'school',
      category: 'Autenticación',
    },
    {
      id: 'recuperar',
      name: 'Recuperar Contraseña',
      subtitle: 'Restablecimiento con código y soporte institucional',
      icon: 'lock_reset',
      category: 'Autenticación',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl p-space-lg shadow-2xl border border-surface-container flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">view_carousel</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Explorador de Pantallas</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="text-xs text-on-surface-variant mt-2 mb-3">
          Selecciona cualquiera de las 7 pantallas diseñadas exactamente como en las especificaciones:
        </p>

        <div className="space-y-2 overflow-y-auto pr-1 flex-1 no-scrollbar">
          {screens.map((screen, idx) => {
            const isActive = currentScreen === screen.id;
            return (
              <button
                key={screen.id}
                type="button"
                onClick={() => {
                  onSelectScreen(screen.id);
                  onClose();
                }}
                className={`w-full text-left p-3 rounded-xl border flex items-center gap-3 transition-all ${
                  isActive
                    ? 'bg-primary-container text-on-primary border-primary-container shadow-sm'
                    : 'bg-surface-container-low hover:bg-surface-container border-transparent text-on-surface'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-white/20 text-on-primary' : 'bg-surface-container-lowest text-primary shadow-xs'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{screen.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md font-semibold truncate">
                      {idx + 1}. {screen.name}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-on-primary'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      {screen.category}
                    </span>
                  </div>
                  <p
                    className={`text-[11px] truncate mt-0.5 ${
                      isActive ? 'text-on-primary/80' : 'text-on-surface-variant'
                    }`}
                  >
                    {screen.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-3 mt-2 border-t border-surface-container">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors text-center"
          >
            Cerrar Explorador
          </button>
        </div>
      </div>
    </div>
  );
};
