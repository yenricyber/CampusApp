import React from 'react';
import { AppScreen } from '../types';

interface BottomNavigationProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  unreadNoticesCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentScreen,
  onNavigate,
  unreadNoticesCount = 1,
}) => {
  const tabs = [
    {
      id: 'materias' as AppScreen,
      label: 'Materias',
      icon: 'dashboard',
    },
    {
      id: 'calendario' as AppScreen,
      label: 'Calendario',
      icon: 'calendar_month',
    },
    {
      id: 'avisos' as AppScreen,
      label: 'Avisos',
      icon: 'notifications',
      hasBadge: unreadNoticesCount > 0,
    },
    {
      id: 'tramites' as AppScreen,
      label: 'Trámites',
      icon: 'assignment',
    },
    {
      id: 'tareas' as AppScreen,
      label: 'Tareas',
      icon: 'task_alt',
    },
    {
      id: 'credencial' as AppScreen,
      label: 'Credencial',
      icon: 'badge',
    },
  ];

  // If on login or detail screen, we can still show the bar or navigate seamlessly
  const activeTabId = currentScreen === 'detalle-materia' ? 'materias' : currentScreen;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-primary-container/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_20px_rgba(10,10,92,0.18)] pb-safe transition-all">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-1">
        {tabs.map((tab) => {
          const isActive = activeTabId === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center min-w-[62px] min-h-[46px] py-1 transition-all relative rounded-xl active:scale-95 ${
                isActive
                  ? 'text-secondary-container'
                  : 'text-[#9fa5e8] hover:text-white'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[23px] transition-transform duration-200"
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1, 'wght' 600" : "'FILL' 0, 'wght' 400",
                  }}
                >
                  {tab.icon}
                </span>

                {tab.hasBadge && (
                  <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-secondary-container ring-2 ring-primary-container animate-pulse" />
                )}
              </div>

              <span
                className={`font-headline text-[10px] tracking-tight mt-0.5 transition-colors ${
                  isActive ? 'font-bold text-secondary-container' : 'font-medium text-[#9fa5e8]'
                }`}
              >
                {tab.label}
              </span>

              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-container mt-0.5 absolute bottom-1 shadow-[0_0_6px_#fce010]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
