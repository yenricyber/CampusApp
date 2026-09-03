import React, { useState } from 'react';
import { AcademicTask, ScreenType, UserProfile } from '../../types';
import { ASSETS } from '../../data/mockData';

interface InicioScreenProps {
  currentUser: UserProfile;
  tasks: AcademicTask[];
  onNavigate: (screen: ScreenType) => void;
  onSelectTask: (task: AcademicTask) => void;
  onToggleTaskCompleted: (taskId: string) => void;
  onOpenNotifications?: () => void;
}

export const InicioScreen: React.FC<InicioScreenProps> = ({
  currentUser,
  tasks,
  onNavigate,
  onSelectTask,
  onToggleTaskCompleted,
  onOpenNotifications,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'urgent' | 'pending' | 'done' | 'math' | 'dev'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterPills: { id: 'all' | 'urgent' | 'pending' | 'done' | 'math' | 'dev'; label: string }[] = [
    { id: 'all', label: `Todas (${tasks.length})` },
    { id: 'urgent', label: 'Próximas' },
    { id: 'pending', label: 'Pendientes' },
    { id: 'done', label: 'Terminadas' },
    { id: 'math', label: 'Matemáticas' },
    { id: 'dev', label: 'Desarrollo' },
  ];

  const filteredTasks = tasks.filter((task) => {
    if (filterCategory === 'urgent' && task.priority !== 'urgente') return false;
    if (filterCategory === 'pending' && task.status !== 'pendiente') return false;
    if (filterCategory === 'done' && task.status !== 'terminada') return false;
    if (filterCategory === 'dev' && task.category !== 'dev') return false;
    if (filterCategory === 'math' && task.category !== 'math') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchCourse = task.courseName.toLowerCase().includes(q);
      const matchCode = task.code.toLowerCase().includes(q);
      return matchTitle || matchCourse || matchCode;
    }
    return true;
  });

  const urgentCount = tasks.filter((t) => t.status === 'pendiente' && t.priority === 'urgente').length;
  const pendingCount = tasks.filter((t) => t.status === 'pendiente').length;
  const completedCount = tasks.filter((t) => t.status === 'terminada').length;
  const completionRate = Math.round((completedCount / (tasks.length || 1)) * 100);

  return (
    <main className="flex flex-col relative w-full pt-16 pb-24 bg-surface min-h-screen">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pb-space-3xl pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Main Left Column (Desktop 8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Greeting & Semester Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-primary-container text-on-primary p-6 shadow-md">
              <div className="absolute -right-6 -bottom-6 w-40 h-40 rounded-full bg-primary-fixed/10 pointer-events-none blur-xl"></div>
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <h1 className="font-headline-xl-mobile text-headline-xl-mobile md:text-headline-lg font-bold tracking-tight">
                    ¡Hola, {currentUser.name.split(' ')[0]}!
                  </h1>
                  <p className="font-body-sm text-body-sm text-surface-container-highest/90 mt-1">
                    {currentUser.program} • {currentUser.semester}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenNotifications}
                  title="Notificaciones y Timbre de Alarma"
                  className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center text-on-primary cursor-pointer hover:bg-white/20 active:scale-95 transition-all shadow-xs shrink-0"
                >
                  <span className="material-symbols-outlined text-[24px]">notifications_active</span>
                </button>
              </div>
            </div>

            {/* Quick Stats Overview Grid */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {/* Stat 1: Por vencer */}
              <button
                type="button"
                onClick={() => setFilterCategory(filterCategory === 'urgent' ? 'all' : 'urgent')}
                className={`flex flex-col p-4 rounded-xl text-left transition-all cursor-pointer shadow-xs border bg-secondary-fixed/30 text-on-secondary-fixed border-secondary/20 hover:scale-[1.02] active:scale-95 ${
                  filterCategory === 'urgent' ? 'ring-2 ring-secondary font-bold bg-secondary-fixed/60 shadow-sm' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
                  </span>
                  <span className="font-headline-md text-headline-md font-bold text-secondary">{urgentCount}</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-secondary-fixed-variant font-medium mt-2 leading-tight flex items-center justify-between">
                  <span>Por vencer</span>
                  {filterCategory === 'urgent' && <span className="text-[10px] uppercase font-bold text-secondary">Activo</span>}
                </span>
              </button>

              {/* Stat 2: Pendientes */}
              <button
                type="button"
                onClick={() => setFilterCategory(filterCategory === 'pending' ? 'all' : 'pending')}
                className={`flex flex-col p-4 rounded-xl text-left transition-all cursor-pointer shadow-xs border bg-surface-container text-on-surface border-primary/10 hover:scale-[1.02] active:scale-95 ${
                  filterCategory === 'pending' ? 'ring-2 ring-primary font-bold bg-primary-container/20 shadow-sm' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">pending_actions</span>
                  </span>
                  <span className="font-headline-md text-headline-md font-bold text-primary">{pendingCount}</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium mt-2 leading-tight flex items-center justify-between">
                  <span>Pendientes</span>
                  {filterCategory === 'pending' && <span className="text-[10px] uppercase font-bold text-primary">Activo</span>}
                </span>
              </button>

              {/* Stat 3: Completas */}
              <button
                type="button"
                onClick={() => setFilterCategory(filterCategory === 'done' ? 'all' : 'done')}
                className={`flex flex-col p-4 rounded-xl text-left transition-all cursor-pointer shadow-xs border bg-surface-container-low text-tertiary-container border-tertiary/20 hover:scale-[1.02] active:scale-95 ${
                  filterCategory === 'done' ? 'ring-2 ring-tertiary font-bold bg-tertiary-container/30 shadow-sm' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-tertiary-fixed-dim/40 flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-[18px]">task_alt</span>
                  </span>
                  <span className="font-headline-md text-headline-md font-bold text-tertiary">{completedCount}</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-tertiary-fixed-variant font-medium mt-2 leading-tight flex items-center justify-between">
                  <span>Completas</span>
                  {filterCategory === 'done' && <span className="text-[10px] uppercase font-bold text-tertiary">Activo</span>}
                </span>
              </button>
            </div>

            {/* Search & Filter Controls */}
            <div className="flex flex-col space-y-3">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar tarea, materia o tema..."
                  className="w-full h-12 pl-11 pr-10 rounded-xl bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-outline border border-surface-container shadow-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-outline hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
              </div>

              {/* Horizontal Pill Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {filterPills.map((pill) => {
                  const isSelected = filterCategory === pill.id;
                  return (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => setFilterCategory(pill.id)}
                      className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md font-medium whitespace-nowrap transition-all cursor-pointer select-none ${
                        isSelected
                          ? 'bg-primary text-on-primary font-bold shadow-xs scale-[1.02]'
                          : 'bg-surface-container-high/60 text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      {pill.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Weekly Objective Card */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-xs shrink-0 bg-surface-container">
                  <img
                    alt="Workspace Laptop"
                    className="w-full h-full object-cover"
                    src={ASSETS.laptopDesk}
                  />
                </div>
                <div>
                  <span className="font-label-xs text-label-xs text-primary font-bold uppercase tracking-wider">
                    Objetivo de la Semana
                  </span>
                  <h4 className="font-label-lg text-label-lg font-semibold text-on-surface mt-0.5">
                    Entregar Casos de Uso antes de medianoche
                  </h4>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary text-[24px] shrink-0">outlined_flag</span>
            </div>

            {/* Priority Tasks List Header */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Tareas Prioritarias</h3>
                <button
                  type="button"
                  onClick={() => onNavigate('calendario')}
                  className="font-label-md text-label-md text-primary font-semibold hover:underline cursor-pointer"
                >
                  Ver agenda completas →
                </button>
              </div>

              {/* Tasks List */}
              {filteredTasks.length === 0 ? (
                <div className="p-8 text-center bg-surface-container-lowest rounded-2xl border border-surface-container flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-[40px] text-outline">task</span>
                  <p className="font-body-md text-body-md text-on-surface-variant font-medium">
                    No hay tareas que coincidan con el filtro.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTasks.map((task) => {
                    const isCompleted = task.status === 'terminada';
                    return (
                      <div
                        key={task.id}
                        onClick={() => onSelectTask(task)}
                        className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs hover:border-primary/30 transition-all cursor-pointer flex items-center justify-between gap-4 hover:shadow-md"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleTaskCompleted(task.id);
                            }}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors cursor-pointer shrink-0 ${
                              isCompleted
                                ? 'bg-tertiary border-tertiary text-on-tertiary'
                                : 'border-outline hover:border-primary'
                            }`}
                          >
                            {isCompleted && <span className="material-symbols-outlined text-[14px]">check</span>}
                          </button>
                          <div className="min-w-0">
                            <span className="font-label-xs text-label-xs text-primary font-semibold uppercase tracking-wider">
                              {task.courseName} • {task.code}
                            </span>
                            <h4 className={`font-label-lg text-label-lg font-bold text-on-surface truncate ${isCompleted ? 'line-through opacity-60' : ''}`}>
                              {task.title}
                            </h4>
                            <p className="font-body-xs text-body-xs text-on-surface-variant truncate mt-0.5">
                              {task.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`px-2.5 py-1 rounded-full font-label-xs text-label-xs font-bold ${
                            isCompleted ? 'bg-tertiary-fixed-dim/30 text-tertiary' : 'bg-secondary-fixed/40 text-secondary'
                          }`}>
                            {task.dueTimeText || task.dueTime}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Right Sidebar (Desktop 4 Cols) */}
          <div className="hidden lg:flex lg:col-span-4 flex-col gap-6 sticky top-20">
            {/* Academic Profile Card */}
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  alt="User avatar"
                  className="w-14 h-14 rounded-full object-cover shadow-xs ring-2 ring-primary/20"
                  src={currentUser.avatarUrl || ASSETS.userAvatar}
                />
                <div className="min-w-0">
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface truncate">{currentUser.name}</h3>
                  <p className="font-body-xs text-body-xs text-on-surface-variant truncate">{currentUser.program}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-xs text-label-xs font-semibold">
                    {currentUser.campus}
                  </span>
                </div>
              </div>

              {/* Academic Progress Meter */}
              <div className="space-y-1.5 pt-2 border-t border-surface-container">
                <div className="flex items-center justify-between font-label-sm text-label-sm">
                  <span className="text-on-surface-variant font-medium">Progreso de Entregas</span>
                  <span className="text-primary font-bold">{completionRate}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Desktop Quick Actions */}
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col gap-3">
              <h4 className="font-label-lg text-label-lg font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">bolt</span>
                Acciones Rápidas
              </h4>
              <button
                type="button"
                onClick={() => onNavigate('registro-rapido')}
                className="w-full py-3 px-4 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-2 shadow-xs hover:bg-primary-container transition-all cursor-pointer active:scale-98"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>+ Crear Nueva Tarea</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('calendario')}
                className="w-full py-2.5 px-4 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md font-semibold flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                <span>Ver Calendario Completo</span>
              </button>
              <button
                type="button"
                onClick={onOpenNotifications}
                className="w-full py-2.5 px-4 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md font-semibold flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">notifications_active</span>
                <span>Configurar Timbre y Alarma</span>
              </button>
            </div>

            {/* Collaborative Teaser Card */}
            <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-container flex items-center justify-between gap-3 shadow-xs">
              <div className="space-y-1 min-w-0">
                <span className="font-label-xs text-label-xs text-primary font-bold uppercase">Trabajo Grupal</span>
                <h5 className="font-label-md text-label-md font-semibold text-on-surface">Invita a tu equipo</h5>
                <p className="font-body-xs text-body-xs text-on-surface-variant">Sincroniza avances con tus binas</p>
              </div>
              <img
                alt="Team work"
                className="w-14 h-14 rounded-xl object-cover shadow-xs shrink-0"
                src={ASSETS.studentsTeamInicio}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
