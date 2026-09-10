import React, { useState } from 'react';
import { evaluationTimeline } from '../../data/mockData';
import { EvaluationItem } from '../../types';
import { ExportCalendarModal } from '../modals/ExportCalendarModal';
import {
  generateIcsContent,
  downloadIcsFile,
  getGoogleCalendarUrl,
  getOutlookWebUrl,
} from '../../utils/icalGenerator';

interface CalendarioScreenProps {
  onOpenUploadModal: (title: string) => void;
  onOpenDetails: (title: string) => void;
  onShowToast: (message: string) => void;
  isPushActive?: boolean;
  onTogglePush?: (active?: boolean) => void;
  onTriggerTestPush?: () => void;
}

export const CalendarioScreen: React.FC<CalendarioScreenProps> = ({
  onOpenUploadModal,
  onOpenDetails,
  onShowToast,
  isPushActive = true,
  onTogglePush,
  onTriggerTestPush,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(14);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const weekDays = [
    { dayNumber: 12, dayLabel: 'Lun', hasDelivery: false },
    { dayNumber: 13, dayLabel: 'Mar', hasDelivery: false },
    { dayNumber: 14, dayLabel: 'Mié', hasDelivery: true, isToday: true },
    { dayNumber: 15, dayLabel: 'Jue', hasDelivery: false },
    { dayNumber: 16, dayLabel: 'Vie', hasDelivery: false },
    { dayNumber: 17, dayLabel: 'Sáb', hasDelivery: true },
    { dayNumber: 18, dayLabel: 'Dom', hasDelivery: false },
  ];

  const handleToggleAlarm = () => {
    if (onTogglePush) {
      onTogglePush();
    }
    onShowToast(
      !isPushActive
        ? 'Alarma preventiva push activada (recordatorios a las 24h y 2h).'
        : 'Alarma preventiva desactivada.'
    );
  };

  const handleExportSingleIcs = (item: EvaluationItem) => {
    const icsContent = generateIcsContent([item], `${item.title} - Universidad Latino`);
    const cleanName = item.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
    downloadIcsFile(`evaluacion_${cleanName}.ics`, icsContent);
    onShowToast(`¡Evento "${item.title}" exportado a .ics! Listo para Google Calendar u Outlook.`);
    setActiveMenuId(null);
  };

  const handleExportAllQuick = () => {
    const icsContent = generateIcsContent(
      evaluationTimeline,
      'Evaluaciones - Universidad Latino'
    );
    downloadIcsFile('evaluaciones_universidad_latino.ics', icsContent);
    onShowToast('¡Calendario completo (.ics) descargado! Compatible con Google Calendar y Outlook.');
  };

  return (
    <div className="flex flex-col w-full px-4 gap-4 pb-28 pt-20 max-w-md mx-auto">
      {/* Sub-encabezado de Contexto Académico y Mes Actual */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex flex-col">
          <span className="font-headline text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
            Período Otoño 2026
          </span>
          <div className="flex items-center gap-1.5">
            <h2 className="font-headline text-[22px] font-bold text-on-surface tracking-tight">
              Octubre 2026
            </h2>
            <button
              aria-label="Cambiar mes"
              onClick={() => onShowToast('Seleccionador de mes del ciclo Otoño 2026')}
              className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:text-on-surface rounded-lg bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
            </button>
          </div>
        </div>

        {/* Botón de Exportar a iCal / Calendario */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 bg-primary-container hover:bg-opacity-90 text-white px-3 py-1.5 rounded-xl font-headline text-xs font-bold shadow-xs active:scale-95 transition"
            title="Exportar evaluaciones a iCal (.ics) para Google Calendar u Outlook"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary-container">
              calendar_add_on
            </span>
            <span>Exportar .ics</span>
          </button>
        </div>
      </div>

      {/* Banner Sincronización con Google Calendar & Outlook */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/50 to-slate-50 border border-blue-200/70 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[18px]">event</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-headline text-[12px] font-bold text-blue-950">
                Sincronizar Evaluaciones
              </span>
              <span className="text-[9px] font-mono font-bold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">
                iCal
              </span>
            </div>
            <span className="font-body text-[10px] text-slate-500 mt-0.5">
              Importa tus exámenes y entregas en Google Calendar u Outlook
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleExportAllQuick}
            title="Descarga rápida de todas las fechas en archivo .ics"
            className="h-8 px-2.5 bg-white hover:bg-slate-50 text-blue-950 border border-blue-200 rounded-xl text-[11px] font-headline font-bold flex items-center gap-1 shadow-2xs active:scale-95 transition"
          >
            <span className="material-symbols-outlined text-[15px] text-blue-600">
              download
            </span>
            <span>.ics</span>
          </button>
        </div>
      </div>

      {/* Tira Semanal Horizontal Interactiva (Octubre 2026) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between overflow-x-auto pb-1 gap-1.5 no-scrollbar" id="week-strip">
          {weekDays.map((item) => {
            const isSelected = selectedDay === item.dayNumber;
            return (
              <button
                key={item.dayNumber}
                onClick={() => setSelectedDay(item.dayNumber)}
                className={`flex flex-col items-center justify-center min-w-[46px] py-2.5 px-1.5 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-primary-container text-on-primary shadow-[0_4px_14px_rgba(10,10,92,0.22)] scale-105'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low border border-[#e3e8f3] shadow-xs'
                }`}
              >
                <span
                  className={`font-headline text-[10px] uppercase font-bold ${
                    isSelected ? 'text-secondary-container' : 'text-outline'
                  }`}
                >
                  {item.dayLabel}
                </span>
                <span
                  className={`font-mono text-[14px] mt-0.5 ${
                    isSelected ? 'text-on-primary font-bold' : 'text-on-surface font-semibold'
                  }`}
                >
                  {item.dayNumber}
                </span>
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-1 ${
                    isSelected
                      ? 'bg-secondary-container shadow-[0_0_4px_#fce010]'
                      : item.hasDelivery
                      ? 'bg-secondary-container'
                      : 'bg-transparent'
                  }`}
                ></span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tarjeta Destacada: Switch Alarma Preventiva Push */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-primary-container text-on-primary shadow-[0_4px_14px_rgba(10,10,92,0.16)] relative overflow-hidden border border-white/10">
        <div className="flex items-start gap-3 pr-2">
          <div className="w-10 h-10 rounded-xl bg-tertiary-container flex items-center justify-center shrink-0 mt-0.5 shadow-inner border border-white/10">
            <span className="material-symbols-outlined text-secondary-container text-[22px]">
              notifications_active
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-headline text-[15px] font-bold text-on-primary">
                Alarma Preventiva Push
              </span>
              <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
            </div>
            <p className="font-body text-[11px] text-surface-variant/90 mt-0.5 leading-snug">
              Recordatorio automático 24h y 2h antes de cada vencimiento oficial.
            </p>
          </div>
        </div>

        {/* Interruptor Toggle */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <button
            onClick={handleToggleAlarm}
            aria-checked={isPushActive}
            aria-label="Alternar alarma preventiva"
            role="switch"
            className={`relative inline-flex h-7 w-12 items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
              isPushActive ? 'bg-secondary-container' : 'bg-outline-variant'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-primary-container shadow-md transition-transform duration-200 flex items-center justify-center ${
                isPushActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            >
              {isPushActive && (
                <span className="material-symbols-outlined text-secondary-container text-[14px] font-bold">
                  done
                </span>
              )}
            </span>
          </button>
          
          {onTriggerTestPush && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTriggerTestPush();
              }}
              className="text-[10px] font-headline text-secondary-container hover:underline flex items-center gap-0.5 tracking-tight"
              title="Disparar notificación push de prueba ahora"
            >
              <span className="material-symbols-outlined text-[12px]">bolt</span>
              <span>Probar Push</span>
            </button>
          )}
        </div>
      </div>

      {/* Feed Cronológico de Pendientes */}
      <div className="flex flex-col gap-3 mt-1">
        <div className="flex items-center justify-between">
          <span className="font-headline text-[11px] uppercase text-on-surface-variant font-bold tracking-wider">
            Línea Temporal de Evaluaciones ({evaluationTimeline.length})
          </span>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="text-[11px] font-headline text-primary-container hover:underline flex items-center gap-1 font-semibold"
          >
            <span className="material-symbols-outlined text-[14px]">ios_share</span>
            <span>Exportar todas</span>
          </button>
        </div>

        {/* Lista Dinámica de Evaluaciones */}
        {evaluationTimeline.map((item) => {
          const isMenuOpen = activeMenuId === item.id;
          const googleLink = getGoogleCalendarUrl(item);
          const outlookLink = getOutlookWebUrl(item);

          return (
            <div
              key={item.id}
              className="flex flex-col p-4 rounded-xl bg-surface-container-lowest shadow-[0_4px_14px_rgba(10,10,92,0.06)] border border-[#e3e8f3] relative overflow-hidden transition hover:border-slate-300"
            >
              {/* Barra lateral de estado */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  item.type === 'examen'
                    ? 'bg-amber-500'
                    : item.badgeType === 'urgent'
                    ? 'bg-error'
                    : item.badgeType === 'soon'
                    ? 'bg-secondary-container'
                    : 'bg-primary-container'
                }`}
              ></div>

              <div className="flex items-start justify-between gap-2 mb-2 pl-1.5">
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md ${
                    item.type === 'examen'
                      ? 'bg-amber-100 text-amber-900 font-bold'
                      : item.badgeType === 'urgent'
                      ? 'bg-error-container text-on-error-container font-bold'
                      : 'bg-surface-container-high text-on-surface font-semibold'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {item.type === 'examen'
                      ? 'school'
                      : item.badgeType === 'urgent'
                      ? 'alarm'
                      : 'event'}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-tight">
                    {item.badge}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-on-surface-variant">
                  {item.dueTime}
                </span>
              </div>

              <div className="flex flex-col pl-1.5">
                <h3 className="font-headline text-[16px] font-bold text-on-surface leading-snug">
                  {item.title}
                </h3>
                <p className="font-body text-[13px] text-on-surface-variant mt-0.5">
                  {item.subject}
                </p>
                {item.description && (
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between mt-3 pt-2.5 pl-1.5 border-t border-slate-100 relative">
                <div className="flex items-center gap-1.5 text-on-surface-variant font-mono text-[11px] truncate max-w-[140px]">
                  <span className="material-symbols-outlined text-[16px] text-outline shrink-0">
                    {item.location.includes('Lab')
                      ? 'biotech'
                      : item.location.includes('Equipo')
                      ? 'group'
                      : 'inventory_2'}
                  </span>
                  <span className="truncate">{item.location}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Botón iCal con menú emergente rápido */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setActiveMenuId(isMenuOpen ? null : item.id)}
                      title="Opciones de calendario: iCal (.ics), Google Calendar, Outlook"
                      className="h-9 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 text-[11px] font-bold transition active:scale-95 border border-slate-200"
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary-container">
                        calendar_add_on
                      </span>
                      <span className="hidden xs:inline">.ics</span>
                    </button>

                    {/* Menú de opciones de calendario rápido */}
                    {isMenuOpen && (
                      <div className="absolute right-0 bottom-full mb-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-30 animate-in fade-in zoom-in-95 duration-150 text-xs">
                        <button
                          type="button"
                          onClick={() => handleExportSingleIcs(item)}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 flex items-center gap-2 text-slate-800 font-medium"
                        >
                          <span className="material-symbols-outlined text-[16px] text-primary-container">
                            download
                          </span>
                          <span>Descargar archivo .ics</span>
                        </button>
                        <a
                          href={googleLink}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => setActiveMenuId(null)}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-50 flex items-center gap-2 text-blue-900 font-medium"
                        >
                          <span className="material-symbols-outlined text-[16px] text-blue-600">
                            event
                          </span>
                          <span>Añadir a Google Calendar</span>
                        </a>
                        <a
                          href={outlookLink}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => setActiveMenuId(null)}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-cyan-50 flex items-center gap-2 text-cyan-900 font-medium"
                        >
                          <span className="material-symbols-outlined text-[16px] text-cyan-700">
                            mail
                          </span>
                          <span>Añadir a Outlook Web</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Botón Principal de la Actividad */}
                  <button
                    onClick={() => {
                      if (item.actionText === 'Entregar') {
                        onOpenUploadModal(item.title);
                      } else {
                        onOpenDetails(item.title);
                      }
                    }}
                    className={`h-9 px-3.5 rounded-xl font-headline text-[12px] font-bold flex items-center gap-1.5 transition-transform active:scale-95 ${
                      item.actionText === 'Entregar'
                        ? 'bg-secondary-container text-primary-container shadow-[0_2px_8px_rgba(250,222,10,0.35)]'
                        : 'bg-surface-container text-primary-container hover:bg-surface-container-high'
                    }`}
                  >
                    <span>{item.actionText}</span>
                    <span className="material-symbols-outlined text-[16px]">
                      {item.actionIcon}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Exportación a iCal (.ics) */}
      <ExportCalendarModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onShowToast={onShowToast}
        evaluations={evaluationTimeline}
      />
    </div>
  );
};

