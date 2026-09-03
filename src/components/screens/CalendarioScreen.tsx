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
  const [activeFilter, setActiveFilter] = useState<'all' | 'urgent' | 'done'>('all');
  const [selectedDay, setSelectedDay] = useState(24);

  const days = [
    { dayName: 'Lun', date: 20, dot: 'bg-outline-variant' },
    { dayName: 'Mar', date: 21, dot: 'bg-tertiary-container' },
    { dayName: 'Mié', date: 22, dot: 'opacity-0' },
    { dayName: 'Jue', date: 23, dot: 'bg-tertiary-container' },
    { dayName: 'Vie', date: 24, active: true, doubleDot: true },
    { dayName: 'Sáb', date: 25, dot: 'bg-secondary-container' },
    { dayName: 'Dom', date: 26, dot: 'opacity-0' },
  ];

  const urgentCount = tasks.filter((t) => t.status === 'pendiente' && t.priority === 'urgente').length;
  const doneCount = tasks.filter((t) => t.status === 'terminada').length;
  const allCount = tasks.length;

  return (
    <main className="flex flex-col relative w-full pt-16 pb-24 bg-surface min-h-screen">
      <div className="flex flex-col w-full px-margin-mobile pb-space-3xl gap-space-lg max-w-5xl mx-auto pt-3">
        {/* Week Calendar Picker Ribbon */}
        <div className="flex flex-col bg-surface-container-lowest rounded-xl shadow-xs p-space-md gap-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                calendar_month
              </span>
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">
                  Semestre 2025-2
                </span>
                <div className="flex items-center gap-space-2xs cursor-pointer group">
                  <h1 className="font-headline-md text-headline-md text-on-surface font-bold">Octubre 2025</h1>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-[20px]">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            {/* Month Navigation Arrows */}
            <div className="flex items-center gap-space-2xs bg-surface-container-low p-space-2xs rounded-lg">
              <button
                type="button"
                aria-label="Mes anterior"
                className="w-8 h-8 flex items-center justify-center rounded text-on-surface-variant hover:text-primary hover:bg-surface transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button
                type="button"
                aria-label="Mes siguiente"
                className="w-8 h-8 flex items-center justify-center rounded text-on-surface-variant hover:text-primary hover:bg-surface transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Mini Weekly Calendar Strip */}
          <div className="grid grid-cols-7 gap-space-2xs pt-space-xs">
            {days.map((d) => {
              const isSelected = selectedDay === d.date;
              return (
                <div
                  key={d.date}
                  onClick={() => setSelectedDay(d.date)}
                  className={`flex flex-col items-center justify-center py-space-xs px-space-2xs rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-primary text-on-primary shadow-md relative'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <span className={`font-label-sm text-label-sm ${isSelected ? 'opacity-90' : ''}`}>{d.dayName}</span>
                  <span className={`font-headline-sm text-headline-sm mt-space-2xs ${isSelected ? 'font-bold' : ''}`}>
                    {d.date}
                  </span>
                  {isSelected ? (
                    <div className="flex items-center gap-0.5 mt-space-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed"></span>
                    </div>
                  ) : (
                    <span className={`w-1.5 h-1.5 rounded-full mt-space-2xs ${d.dot || 'opacity-0'}`}></span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Workload Summary & Quick Add Trigger */}
        <div className="flex items-center justify-between bg-surface-container-low rounded-xl p-space-md shadow-xs">
          <div className="flex items-center gap-space-sm min-w-0">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[22px]">pending_actions</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                3 entregas esta semana
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">2 prioritarias y 1 proyecto final</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('registro-rapido')}
            className="shrink-0 flex items-center gap-space-2xs bg-primary text-on-primary font-label-md text-label-md py-space-xs px-space-sm rounded-lg shadow-xs hover:bg-primary-container active:scale-95 transition-all font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Añadir</span>
          </button>
        </div>

        {/* Filter Pills Bar */}
        <div className="flex items-center gap-space-xs overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-space-md py-space-xs rounded-full font-label-md text-label-md shadow-xs transition-all whitespace-nowrap font-medium ${
              activeFilter === 'all'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            Ver todas ({allCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('urgent')}
            className={`px-space-md py-space-xs rounded-full font-label-md text-label-md shadow-xs transition-all whitespace-nowrap font-medium ${
              activeFilter === 'urgent'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            Por Vencer ({urgentCount || 2})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('done')}
            className={`px-space-md py-space-xs rounded-full font-label-md text-label-md shadow-xs transition-all whitespace-nowrap font-medium ${
              activeFilter === 'done'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            Terminadas ({doneCount || 1})
          </button>
        </div>

        {/* Task Timeline Stream */}
        <div className="flex flex-col gap-space-lg" id="timeline-container">
          {/* Timeline Section: Hoy */}
          {(activeFilter === 'all' || activeFilter === 'urgent') && (
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between px-space-2xs">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse"></span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Hoy — 24 Octubre</span>
                </div>
                <span className="font-label-sm text-label-sm text-error font-semibold bg-error-container/40 text-on-error-container px-space-xs py-0.5 rounded-full">
                  ¡Cierra hoy!
                </span>
              </div>

              {/* Task Card 1: Ing. Software */}
              {tasks.filter(t => t.id === 'task-1').map((t1) => (
                <div
                  key={t1.id}
                  onClick={() => {
                    onSelectTask(t1);
                    onNavigate('detalle-tarea');
                  }}
                  className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs flex flex-col gap-space-sm relative overflow-hidden transition-all hover:shadow-md cursor-pointer"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
                  <div className="flex items-start justify-between gap-space-sm pl-space-2xs">
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-space-xs mb-space-2xs flex-wrap">
                        <span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant font-semibold px-space-xs py-0.5 rounded">
                          {t1.code}
                        </span>
                        <span className="font-label-sm text-label-sm text-error font-medium flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[16px]">schedule</span> {t1.dueTime} hrs
                        </span>
                      </div>
                      <h2 className={`font-headline-sm text-headline-sm text-on-surface font-semibold text-wrap ${t1.status === 'terminada' ? 'line-through opacity-75' : ''}`}>
                        {t1.title}
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        {t1.courseName} • {t1.moduleOrDetail}
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label="Marcar completada"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleTaskCompleted(t1.id);
                      }}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                        t1.status === 'terminada'
                          ? 'bg-tertiary text-on-tertiary'
                          : 'bg-surface-container-high text-on-surface-variant hover:bg-tertiary/20'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">check</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-space-xs pl-space-2xs">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-label-sm text-label-sm bg-error-container text-on-error-container font-semibold px-space-xs py-0.5 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">priority_high</span> Urgente
                      </span>
                      <span className="font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed font-medium px-space-xs py-0.5 rounded-full">
                        {t1.status === 'terminada' ? 'Terminada' : 'Pendiente'}
                      </span>
                    </div>
                    <div className="flex items-center gap-space-2xs text-on-surface-variant font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[16px]">attach_file</span>
                      <span>2 archivos</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Timeline Section: Mañana */}
          {(activeFilter === 'all' || activeFilter === 'urgent') && (
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between px-space-2xs">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Mañana — 25 Octubre</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Quedan 28 hrs</span>
              </div>

              {/* Task Card 2: Ética */}
              {tasks.filter(t => t.id === 'task-2').map((t2) => (
                <div
                  key={t2.id}
                  onClick={() => {
                    onSelectTask(t2);
                    onNavigate('detalle-tarea');
                  }}
                  className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs flex flex-col gap-space-sm relative overflow-hidden transition-all hover:shadow-md cursor-pointer"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary-container"></div>
                  <div className="flex items-start justify-between gap-space-sm pl-space-2xs">
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-space-xs mb-space-2xs flex-wrap">
                        <span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant font-semibold px-space-xs py-0.5 rounded">
                          {t2.code}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[16px]">schedule</span> {t2.dueTime} hrs
                        </span>
                      </div>
                      <h2 className={`font-headline-sm text-headline-sm text-on-surface font-semibold text-wrap ${t2.status === 'terminada' ? 'line-through opacity-75' : ''}`}>
                        {t2.title}
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        {t2.courseName} • {t2.moduleOrDetail}
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label="Marcar completada"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleTaskCompleted(t2.id);
                      }}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                        t2.status === 'terminada'
                          ? 'bg-tertiary text-on-tertiary'
                          : 'bg-surface-container-high text-on-surface-variant hover:bg-tertiary/20'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">check</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-space-xs pl-space-2xs">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed font-semibold px-space-xs py-0.5 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">timelapse</span> Próxima
                      </span>
                    </div>
                    <div className="flex items-center gap-space-2xs text-on-surface-variant font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[16px]">menu_book</span>
                      <span>Rúbrica APA 7</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Timeline Section: Próxima semana */}
          {(activeFilter === 'all') && (
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between px-space-2xs">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Próxima semana — 28 Octubre
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Martes</span>
              </div>

              {/* Task Card 3: Bases de Datos */}
              {tasks.filter(t => t.id === 'task-3').map((t3) => (
                <div
                  key={t3.id}
                  onClick={() => {
                    onSelectTask(t3);
                    onNavigate('detalle-tarea');
                  }}
                  className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs flex flex-col gap-space-sm relative overflow-hidden transition-all hover:shadow-md cursor-pointer"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-tertiary-container"></div>
                  <div className="flex items-start justify-between gap-space-sm pl-space-2xs">
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-space-xs mb-space-2xs flex-wrap">
                        <span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant font-semibold px-space-xs py-0.5 rounded">
                          {t3.code}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[16px]">schedule</span> {t3.dueTime} hrs
                        </span>
                      </div>
                      <h2 className={`font-headline-sm text-headline-sm text-on-surface font-semibold text-wrap ${t3.status === 'terminada' ? 'line-through opacity-75' : ''}`}>
                        {t3.title}
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        {t3.courseName} • {t3.moduleOrDetail}
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label="Marcar completada"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleTaskCompleted(t3.id);
                      }}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                        t3.status === 'terminada'
                          ? 'bg-tertiary text-on-tertiary'
                          : 'bg-surface-container-high text-on-surface-variant hover:bg-tertiary/20'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">check</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-space-xs pl-space-2xs">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface font-medium px-space-xs py-0.5 rounded-full">
                        {t3.status === 'terminada' ? 'Terminada' : 'Pendiente'}
                      </span>
                    </div>
                    <div className="flex items-center gap-space-2xs text-on-surface-variant font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[16px]">groups</span>
                      <span>Equipo (3/4)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Timeline Section: Entregadas recientemente */}
          {(activeFilter === 'all' || activeFilter === 'done') && (
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between px-space-2xs">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim"></span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Entregadas recientemente
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-tertiary-container font-medium flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[16px]">verified</span> Al día
                </span>
              </div>

              {/* Task Card 4: Taller Git (Completed) */}
              {tasks.filter(t => t.id === 'task-4').map((t4) => (
                <div
                  key={t4.id}
                  onClick={() => {
                    onSelectTask(t4);
                    onNavigate('detalle-tarea');
                  }}
                  className="bg-surface-container-lowest/80 rounded-xl p-space-md shadow-xs flex flex-col gap-space-sm relative overflow-hidden opacity-95 cursor-pointer"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-tertiary-fixed-dim"></div>
                  <div className="flex items-start justify-between gap-space-sm pl-space-2xs">
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-space-xs mb-space-2xs flex-wrap">
                        <span className="font-label-sm text-label-sm bg-surface-container text-on-surface-variant font-semibold px-space-xs py-0.5 rounded">
                          {t4.code}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-tertiary-fixed-variant font-medium flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[16px]">event_available</span> 22 Oct, 19:30 hrs
                        </span>
                      </div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold line-through opacity-75 text-wrap">
                        {t4.title}
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        {t4.courseName} • {t4.moduleOrDetail}
                      </p>
                    </div>
                    <div className="w-6 h-6 rounded-lg bg-tertiary text-on-tertiary flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">done_all</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-space-xs pl-space-2xs">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-label-sm text-label-sm bg-tertiary-fixed text-on-tertiary-fixed font-bold px-space-xs py-0.5 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span> Entregada a tiempo
                      </span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Nota: 10/10</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
