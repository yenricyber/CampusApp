import React, { useState } from 'react';
import { AcademicTask, ScreenType } from '../../types';

interface CalendarioScreenProps {
  tasks: AcademicTask[];
  onNavigate: (screen: ScreenType) => void;
  onSelectTask: (task: AcademicTask) => void;
  onToggleTaskCompleted: (taskId: string) => void;
}

export const CalendarioScreen: React.FC<CalendarioScreenProps> = ({
  tasks,
  onNavigate,
  onSelectTask,
  onToggleTaskCompleted,
}) => {
  const today = new Date();
  const [activeFilter, setActiveFilter] = useState<'all' | 'urgent' | 'done'>('all');
  const [viewMode, setViewMode] = useState<'week' | 'month'>('month');
  
  // State for calendar navigation automatically directed to real system date (new Date())
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());

  const handleGoToToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setSelectedDay(now.getDate());
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Get total days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun, 1 = Mon
  // Shift so Monday is index 0
  const startingOffset = (firstDayIndex + 6) % 7;

  // Build array of days for week view around selectedDay or current date
  const weekDays = [19, 20, 21, 22, 23, 24, 25, 26];
  const dayNamesShort = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Dynamic counts
  const urgentCount = tasks.filter((t) => t.status !== 'terminada' && (t.priority === 'urgente' || t.urgentBadge)).length;
  const doneCount = tasks.filter((t) => t.status === 'terminada').length;
  const allCount = tasks.length;

  // Filter tasks based on activeFilter & selectedDay
  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'urgent' && (task.status === 'terminada' || (task.priority !== 'urgente' && !task.urgentBadge))) return false;
    if (activeFilter === 'done' && task.status !== 'terminada') return false;

    if (selectedDay !== null) {
      // Check if task date matches selected day number
      if (task.dueDate) {
        const dayNum = parseInt(task.dueDate.split('-')[2], 10);
        if (!isNaN(dayNum) && dayNum !== selectedDay) {
          // If filtering specifically by clicked day
          return false;
        }
      }
    }
    return true;
  });

  return (
    <main className="flex flex-col relative w-full pt-16 pb-24 bg-surface min-h-screen">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pb-space-3xl pt-4 space-y-6">
        {/* Header Ribbon & Calendar Controls */}
        <div className="flex flex-col bg-surface-container-lowest border border-surface-container rounded-2xl shadow-xs p-5 md:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[26px]">calendar_month</span>
              </div>
              <div>
                <span className="font-label-xs text-label-xs text-primary font-bold uppercase tracking-wider block">
                  Semestre {currentYear}-2
                </span>
                <div className="flex items-center gap-2">
                  <h1 className="font-headline-md text-headline-md md:text-headline-lg font-bold text-on-surface tracking-tight">
                    {monthNames[currentMonth]} {currentYear}
                  </h1>
                </div>
              </div>
            </div>

            {/* Navigation & View Mode Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* View Switcher */}
              <div className="flex items-center bg-surface-container-low p-1 rounded-xl border border-surface-container">
                <button
                  type="button"
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-semibold transition-all cursor-pointer ${
                    viewMode === 'week'
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Vista Semana
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('month')}
                  className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-semibold transition-all cursor-pointer ${
                    viewMode === 'month'
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Mes Completo
                </button>
              </div>

              {/* Month Arrow Buttons & Today Trigger */}
              <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl border border-surface-container">
                <button
                  type="button"
                  onClick={handleGoToToday}
                  className="px-2.5 py-1 rounded-lg bg-surface hover:bg-surface-container text-primary font-label-xs text-label-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                  title="Ir a la fecha actual de hoy"
                >
                  <span className="material-symbols-outlined text-[14px] font-bold">today</span>
                  <span>Hoy</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  aria-label="Mes anterior"
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  aria-label="Mes siguiente"
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Display Grid */}
          {viewMode === 'week' ? (
            /* Week Strip */
            <div className="grid grid-cols-7 gap-2 pt-2 border-t border-surface-container">
              {dayNamesShort.map((dayName, idx) => {
                const dNum = weekDays[idx] || (idx + 20);
                const isSelected = selectedDay === dNum;
                const isToday = today.getFullYear() === currentYear && today.getMonth() === currentMonth && today.getDate() === dNum;
                const dayTasksCount = tasks.filter((t) => t.dueDate && parseInt(t.dueDate.split('-')[2], 10) === dNum).length;
                return (
                  <button
                    key={dNum}
                    type="button"
                    onClick={() => setSelectedDay(selectedDay === dNum ? null : dNum)}
                    className={`flex flex-col items-center justify-center py-3 px-1 rounded-xl transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-primary text-on-primary border-primary shadow-md font-bold scale-[1.02]'
                        : isToday
                        ? 'bg-secondary-container/20 border-secondary text-on-surface font-semibold'
                        : 'bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container'
                    }`}
                  >
                    <span className="font-label-xs text-label-xs uppercase font-medium">{dayName}</span>
                    <span className="font-headline-sm text-headline-sm font-bold mt-1">{dNum}</span>
                    <div className="flex items-center gap-1 mt-1.5 h-2">
                      {dayTasksCount > 0 && (
                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-secondary-fixed' : 'bg-primary'}`} />
                      )}
                      {dayTasksCount > 1 && (
                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-tertiary-fixed' : 'bg-secondary'}`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Full Extended Month Grid View */
            <div className="flex flex-col gap-2 pt-2 border-t border-surface-container">
              {/* Days Header */}
              <div className="grid grid-cols-7 gap-1 text-center font-label-sm text-label-sm font-bold text-on-surface-variant py-1">
                {dayNamesShort.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
              {/* Days Matrix */}
              <div className="grid grid-cols-7 gap-1.5 md:gap-2">
                {/* Empty offset cells */}
                {Array.from({ length: startingOffset }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-12 md:h-16 rounded-xl bg-surface-container-low/30 border border-transparent" />
                ))}
                {/* Days of Month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dNum = i + 1;
                  const isSelected = selectedDay === dNum;
                  const isToday = today.getFullYear() === currentYear && today.getMonth() === currentMonth && today.getDate() === dNum;
                  const dayTasks = tasks.filter((t) => t.dueDate && parseInt(t.dueDate.split('-')[2], 10) === dNum);
                  return (
                    <button
                      key={dNum}
                      type="button"
                      onClick={() => setSelectedDay(selectedDay === dNum ? null : dNum)}
                      className={`h-12 md:h-16 rounded-xl p-1.5 flex flex-col justify-between items-start transition-all cursor-pointer border text-left ${
                        isSelected
                          ? 'bg-primary text-on-primary border-primary shadow-md font-bold ring-2 ring-primary/40'
                          : isToday
                          ? 'bg-secondary-fixed/30 border-secondary text-on-surface font-semibold shadow-xs'
                          : dayTasks.length > 0
                          ? 'bg-primary-container/20 border-primary/20 text-on-surface hover:bg-primary-container/40'
                          : 'bg-surface-container-low border-surface-container/50 text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <div className="w-full flex items-center justify-between">
                        <span className="font-label-sm text-label-sm font-bold">{dNum}</span>
                        {isToday && (
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                            isSelected ? 'bg-white text-primary' : 'bg-secondary text-on-secondary'
                          }`}>
                            Hoy
                          </span>
                        )}
                      </div>
                      {dayTasks.length > 0 && (
                        <div className="w-full flex items-center justify-between">
                          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-primary text-on-primary'}`}>
                            {dayTasks.length} {dayTasks.length === 1 ? 'tarea' : 'tareas'}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Workload Summary Bar & Add Task Trigger */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[24px]">pending_actions</span>
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="font-label-lg text-label-lg text-on-surface font-bold truncate">
                {filteredTasks.length} {filteredTasks.length === 1 ? 'entrega agendada' : 'entregas agendadas'} {selectedDay !== null ? `para el día ${selectedDay}` : 'este mes'}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {urgentCount} prioritarias • {doneCount} completadas
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('registro-rapido')}
            className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-2 shadow-xs hover:bg-primary-container transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>+ Añadir Tarea</span>
          </button>
        </div>

        {/* Filter Pills Bar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full font-label-md text-label-md transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-primary text-on-primary font-bold shadow-xs'
                  : 'bg-surface-container-lowest text-on-surface border border-surface-container hover:bg-surface-container-low'
              }`}
            >
              Ver todas ({allCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('urgent')}
              className={`px-4 py-2 rounded-full font-label-md text-label-md transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === 'urgent'
                  ? 'bg-primary text-on-primary font-bold shadow-xs'
                  : 'bg-surface-container-lowest text-on-surface border border-surface-container hover:bg-surface-container-low'
              }`}
            >
              Por Vencer ({urgentCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('done')}
              className={`px-4 py-2 rounded-full font-label-md text-label-md transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === 'done'
                  ? 'bg-primary text-on-primary font-bold shadow-xs'
                  : 'bg-surface-container-lowest text-on-surface border border-surface-container hover:bg-surface-container-low'
              }`}
            >
              Terminadas ({doneCount})
            </button>
          </div>

          {selectedDay !== null && (
            <button
              type="button"
              onClick={() => setSelectedDay(null)}
              className="font-label-sm text-label-sm text-primary font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Mostrar todos los días</span>
            </button>
          )}
        </div>

        {/* Dynamic Task Timeline Stream */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center bg-surface-container-lowest rounded-2xl border border-surface-container flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-[48px] text-outline">event_busy</span>
              <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">No hay entregas para esta selección</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
                Prueba seleccionando otro día o haciendo clic en "Mostrar todos los días".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTasks.map((task) => {
                const isCompleted = task.status === 'terminada';
                return (
                  <div
                    key={task.id}
                    onClick={() => {
                      onSelectTask(task);
                      onNavigate('detalle-tarea');
                    }}
                    className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col justify-between gap-4 relative overflow-hidden transition-all hover:border-primary/40 hover:shadow-md cursor-pointer group"
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isCompleted ? 'bg-tertiary' : 'bg-primary'}`} />
                    <div className="flex items-start justify-between gap-3 pl-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-label-xs text-label-xs bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full uppercase">
                            {task.code}
                          </span>
                          <span className="font-label-xs text-label-xs text-on-surface-variant font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">schedule</span> {task.dueDate} • {task.dueTime} hrs
                          </span>
                        </div>
                        <h3 className={`font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors ${isCompleted ? 'line-through opacity-60' : ''}`}>
                          {task.title}
                        </h3>
                        <p className="font-body-xs text-body-xs text-on-surface-variant line-clamp-2 mt-1">
                          {task.courseName} • {task.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        aria-label="Marcar completada"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleTaskCompleted(task.id);
                        }}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                          isCompleted
                            ? 'bg-tertiary text-on-tertiary'
                            : 'bg-surface-container-high text-on-surface-variant hover:bg-tertiary/20'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-surface-container pl-2 font-label-xs text-label-xs">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        isCompleted
                          ? 'bg-tertiary-fixed-dim/30 text-tertiary'
                          : task.priority === 'urgente'
                          ? 'bg-error-container text-on-error-container animate-pulse'
                          : 'bg-secondary-fixed/40 text-secondary'
                      }`}>
                        {isCompleted ? '✓ Terminada' : task.priority === 'urgente' ? 'Urgente' : 'Pendiente'}
                      </span>
                      <span className="text-primary font-semibold flex items-center gap-1">
                        Ver detalle →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
