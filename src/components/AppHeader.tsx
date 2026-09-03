import React from 'react';
import { ScreenType } from '../types';
import { ASSETS } from '../data/mockData';

import { UserProfile } from '../types';

interface AppHeaderProps {
  currentUser?: UserProfile;
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onBack?: () => void;
  onLogout?: () => void;
  onOpenScreenPicker?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentUser,
  currentScreen,
  onNavigate,
  onBack,
  onLogout,
  onOpenScreenPicker,
}) => {
  const isSubScreen = currentScreen === 'registro-rapido' || currentScreen === 'detalle-tarea';

  const getSubScreenTitle = () => {
    if (currentScreen === 'registro-rapido') return 'Registro Rápido';
    if (currentScreen === 'detalle-tarea') return 'Detalle De Tarea';
    return '';
  };

  const getSectionLabel = () => {
    if (currentScreen === 'inicio') return 'Inicio';
    if (currentScreen === 'calendario') return 'Calendario';
    if (currentScreen === 'login' || currentScreen === 'registro' || currentScreen === 'recuperar') return 'Perfil';
    return '';
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-surface-container shadow-xs">
      <div className="h-16 px-margin-mobile flex items-center justify-between gap-space-sm w-full mx-auto">
        {/* Left Side */}
        {isSubScreen ? (
          <div className="flex items-center gap-space-xs min-w-0">
            <button
              aria-label="Volver"
              type="button"
              onClick={onBack || (() => onNavigate('inicio'))}
              className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container active:bg-surface-container-high transition-colors focus:outline-none shrink-0"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <div className="flex items-center gap-space-2xs min-w-0">
              <img
                alt="CampusApp Brand Logo"
                className="h-6 w-auto object-contain hidden xs:inline-block shrink-0"
                src={ASSETS.logo}
              />
              <h1 className="font-headline-sm text-headline-sm text-on-surface truncate">
                {getSubScreenTitle()}
              </h1>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center gap-space-xs cursor-pointer select-none"
            onClick={() => onNavigate('inicio')}
          >
            <img
              alt="CampusApp Brand Logo"
              className="h-8 w-auto object-contain"
              src={ASSETS.logo}
            />
            <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
              CampusApp
            </span>
          </div>
        )}

        {/* Desktop Navigation */}
        {currentUser && (
          <div className="hidden md:flex items-center gap-space-lg mx-auto">
            <button
              onClick={() => onNavigate('inicio')}
              className={`font-label-md text-label-md transition-colors ${currentScreen === 'inicio' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Inicio
            </button>
            <button
              onClick={() => onNavigate('calendario')}
              className={`font-label-md text-label-md transition-colors ${currentScreen === 'calendario' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Calendario
            </button>
            <button
              onClick={() => onNavigate('registro-rapido')}
              className={`font-label-md text-label-md transition-colors ${currentScreen === 'registro-rapido' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Nuevo
            </button>
          </div>
        )}

        {/* Right Action / Profile area */}
        <div className="flex items-center gap-space-xs">

          {/* Profile avatar button */}
          <button
            type="button"
            onClick={() => {
              if (currentUser) {
                onNavigate('perfil');
              } else {
                onNavigate(currentScreen === 'login' ? 'inicio' : 'login');
              }
            }}
            className="w-11 h-11 flex items-center justify-center rounded-full p-space-2xs focus:outline-none hover:bg-surface-container transition-colors"
            title={currentUser ? "Mi Perfil" : "Iniciar Sesión"}
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover shadow-[0_1px_3px_rgba(15,23,42,0.1)] ring-1 ring-primary/20"
              src={currentUser?.avatarUrl || ASSETS.userAvatar}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
