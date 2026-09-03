import React, { useState } from 'react';
import { AcademicTask, ScreenType, UserProfile } from '../../types';
import { ASSETS } from '../../data/mockData';

interface InicioScreenProps {
  currentUser: UserProfile;
  tasks: AcademicTask[];
  onNavigate: (screen: ScreenType) => void;
  onSelectTask: (task: AcademicTask) => void;
  onToggleTaskCompleted: (taskId: string) => void;
}

export const InicioScreen: React.FC<InicioScreenProps> = ({
  currentUser,
  tasks,
  onNavigate,
  onSelectTask,
  onToggleTaskCompleted,
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
    // Category filter
    if (filterCategory === 'urgent' && task.priority !== 'urgente') return false;
    if (filterCategory === 'pending' && task.status !== 'pendiente') return false;
    if (filterCategory === 'done' && task.status !== 'terminada') return false;
    if (filterCategory === 'dev' && task.category !== 'dev') return false;
    if (filterCategory === 'math' && task.category !== 'math') return false;

    // Search query
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

  return (
    <main className="flex flex-col relative w-full pt-16 pb-24 bg-surface min-h-screen">
      <div className="flex flex-col w-full px-margin-mobile md:px-space-2xl pb-space-3xl space-y-space-lg mx-auto pt-3">
        <div className="max-w-3xl">
        {/* Greeting & Semester Banner */}
        <div className="relative overflow-hidden rounded-xl bg-primary-container text-on-primary p-space-md shadow-md">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-primary-fixed/10 pointer-events-none blur-xl"></div>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <h1 className="font-headline-xl-mobile text-headline-xl-mobile font-bold tracking-tight">¡Hola, {currentUser.name.split(' ')[0]}!</h1>
              <p className="font-body-sm text-body-sm text-surface-container-highest/90 mt-0.5">
                {currentUser.program}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-[22px]">notifications_active</span>
            </div>
          </div>
        </div>

        </div>

        {/* Quick Stats Overview Grid */}
        <div className="grid grid-cols-3 gap-space-xs md:gap-space-lg">
          {/* Stat 1: Por vencer */}
          <div className="flex flex-col p-space-sm rounded-xl bg-secondary-fixed/30 text-on-secondary-fixed shadow-xs">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
              </span>
              <span className="font-headline-md text-headline-md font-bold text-secondary">{urgentCount || 2}</span>
            </div>
            <span className="font-label-sm text-label-sm text-on-secondary-fixed-variant font-medium mt-space-xs leading-tight">
              Por vencer
            </span>
          </div>

          {/* Stat 2: Pendientes */}
          <div className="flex flex-col p-space-sm rounded-xl bg-surface-container text-on-surface shadow-xs">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[16px]">pending_actions</span>
              </span>
              <span className="font-headline-md text-headline-md font-bold text-primary">{pendingCount || 5}</span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium mt-space-xs leading-tight">
              Pendientes
            </span>
          </div>

          {/* Stat 3: Completas */}
          <div className="flex flex-col p-space-sm rounded-xl bg-surface-container-low text-tertiary-container shadow-xs">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-full bg-tertiary-fixed-dim/40 flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-[16px]">task_alt</span>
              </span>
              <span className="font-headline-md text-headline-md font-bold text-tertiary">{completedCount || 14}</span>
            </div>
            <span className="font-label-sm text-label-sm text-on-tertiary-fixed-variant font-medium mt-space-xs leading-tight">
              Completas
            </span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col space-y-space-sm">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-space-sm pointer-events-none text-outline">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar tarea, materia o tema..."
              className="w-full h-12 pl-10 pr-space-md rounded-xl bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-md text-body-md shadow-xs focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-all"
            />
            <button className="absolute inset-y-0 right-0 flex items-center pr-space-sm text-outline hover:text-primary">
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </button>
          </div>

          {/* Category Pills Scrollable Row */}
          <div className="flex items-center gap-space-xs overflow-x-auto py-1 no-scrollbar text-nowrap">
            {filterPills.map((pill) => {
              const isActive = filterCategory === pill.id;
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setFilterCategory(pill.id)}
                  className={`px-space-sm py-1.5 rounded-full font-label-md text-label-md font-medium transition-transform active:scale-95 cursor-pointer ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-variant'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Visual Academic Quote / Pulse Micro-banner */}
        <div className="flex items-center gap-space-sm p-space-sm rounded-xl bg-surface-container-low shadow-xs">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 relative">
            <img
              alt="Study desk"
              className="w-full h-full object-cover"
              src={ASSETS.studyDeskInicio}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider">
              Objetivo de la semana
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
              Entregar Casos de Uso antes de medianoche
            </span>
          </div>
          <div className="ml-auto flex items-center text-primary">
            <span className="material-symbols-outlined text-[20px]">flag</span>
          </div>
        </div>

        {/* Task List Section */}
        <div className="flex flex-col space-y-space-md">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Tareas Prioritarias</h2>
            <button
              type="button"
              onClick={() => onNavigate('calendario')}
              className="font-label-md text-label-md text-primary font-semibold hover:underline cursor-pointer"
            >
              Ver agenda
            </button>
          </div>

          {/* Task Cards Stream */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-sm" id="tasks-container">
            {filteredTasks.map((task) => {
              const isUrgent = task.priority === 'urgente';
              const isCompleted = task.status === 'terminada';

              return (
                <div
                  key={task.id}
                  onClick={() => {
                    onSelectTask(task);
                    onNavigate('detalle-tarea');
                  }}
                  className={`task-item relative rounded-xl bg-surface-container-lowest p-space-md shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-space-xs cursor-pointer ${
                    isCompleted ? 'opacity-85' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-xs flex-wrap">
                      <span className="px-space-xs py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
                        {task.code}
                      </span>
                      {isUrgent && (
                        <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
                          <span className="material-symbols-outlined text-[13px]">alarm</span>
                          {task.dueTimeText || 'Hoy, 23:59 hrs'}
                        </span>
                      )}
                      {!isUrgent && !isCompleted && (
                        <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
                          <span className="material-symbols-outlined text-[13px]">schedule</span>
                          {task.dueTimeText}
                        </span>
                      )}
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-full bg-surface-container text-outline font-label-sm text-label-sm font-medium">
                          <span className="material-symbols-outlined text-[13px]">event_available</span>
                          {task.dueTimeText}
                        </span>
                      )}
                    </div>

                    {/* Toggle Checkbox Button */}
                    <button
                      type="button"
                      aria-label="Toggle task completion"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleTaskCompleted(task.id);
                      }}
                      className={`task-checkbox w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                        isCompleted
                          ? 'bg-tertiary text-on-tertiary'
                          : 'bg-surface-container text-transparent hover:text-outline'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">check</span>
                    </button>
                  </div>

                  <div className="pt-0.5">
                    <h3
                      className={`task-title font-headline-sm text-headline-sm leading-snug font-semibold ${
                        isCompleted ? 'text-on-surface-variant line-through' : 'text-on-surface'
                      }`}
                    >
                      {task.title}
                    </h3>
                    <p className={`font-body-sm text-body-sm ${isCompleted ? 'text-outline' : 'text-on-surface-variant'}`}>
                      {task.courseName} • {task.moduleOrDetail}
                    </p>
                  </div>

                  {/* Progress Bar (if available) */}
                  {task.progressPercent !== undefined && !isCompleted && (
                    <div className="pt-space-xs space-y-1">
                      <div className="flex items-center justify-between font-label-sm text-label-sm">
                        <span className="text-on-surface-variant font-medium">Progreso acumulado</span>
                        <span className="text-primary font-semibold">{task.progressPercent}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${task.progressPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Card bottom metadata */}
                  <div className="flex items-center justify-between pt-1">
                    {task.collaborators && task.collaborators.length > 0 ? (
                      <div className="flex items-center -space-x-1.5">
                        <span className="w-6 h-6 rounded-full bg-secondary-fixed flex items-center justify-center text-[10px] font-bold text-on-secondary-fixed shadow-xs">
                          VP
                        </span>
                        <span className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center text-[10px] font-bold text-primary shadow-xs">
                          LR
                        </span>
                        <span className="w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px] text-on-surface-variant font-semibold">
                          +2
                        </span>
                      </div>
                    ) : task.attachmentsCount ? (
                      <span className="inline-flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px]">attachment</span>
                        {task.attachmentsCount} documentos adjuntos
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-body-sm text-body-sm text-on-tertiary-container font-medium">
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        {task.grade || 'Completada'}
                      </span>
                    )}

                    <span
                      className={`px-2 py-0.5 rounded font-label-sm text-label-sm font-medium ${
                        isCompleted
                          ? 'bg-tertiary-fixed-dim/40 text-tertiary-container font-semibold'
                          : task.status === 'en_progreso'
                          ? 'bg-surface-container text-on-surface-variant'
                          : 'bg-secondary-fixed/50 text-on-secondary-fixed-variant'
                      }`}
                    >
                      {isCompleted
                        ? 'Terminada'
                        : task.status === 'en_progreso'
                        ? 'En Progreso'
                        : 'Pendiente'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Collaborative Project Peek / Delight Illustration Module */}
        <div className="p-space-md rounded-xl bg-surface-container flex items-center justify-between shadow-xs">
          <div className="flex flex-col space-y-1">
            <span className="font-label-sm text-label-sm text-primary font-semibold">¿Trabajando en equipo?</span>
            <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Invita a tus compañeros
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Sincroniza subtareas y recordatorios grupales en tiempo real.
            </p>
          </div>
          <div className="w-16 h-16 rounded-xl overflow-hidden shadow-xs flex-shrink-0 ml-space-xs">
            <img
              alt="Students team"
              className="w-full h-full object-cover"
              src={ASSETS.studentsTeamInicio}
            />
          </div>
        </div>

        {/* Quick Register Action Button */}
        <div className="pt-space-xs">
          <button
            type="button"
            onClick={() => onNavigate('registro-rapido')}
            className="w-full h-12 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-semibold flex items-center justify-center gap-space-xs shadow-md active:scale-[0.99] transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>+ Registrar Nueva Tarea</span>
          </button>
        </div>
      </div>
    </main>
  );
};
