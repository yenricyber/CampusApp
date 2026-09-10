import React, { useState } from 'react';
import { EvaluationItem } from '../../types';
import {
  generateIcsContent,
  downloadIcsFile,
  getGoogleCalendarUrl,
  getOutlookWebUrl,
} from '../../utils/icalGenerator';

interface ExportCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string) => void;
  evaluations: EvaluationItem[];
}

export const ExportCalendarModal: React.FC<ExportCalendarModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  evaluations,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    evaluations.map((e) => e.id)
  );
  const [activeTab, setActiveTab] = useState<'all' | 'google' | 'outlook'>('all');
  const [filterType, setFilterType] = useState<'all' | 'examenes' | 'proyectos'>('all');

  if (!isOpen) return null;

  const filteredEvaluations = evaluations.filter((item) => {
    if (filterType === 'examenes') return item.type === 'examen';
    if (filterType === 'proyectos') return item.type === 'proyecto' || item.type === 'actividad';
    return true;
  });

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === evaluations.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(evaluations.map((e) => e.id));
    }
  };

  const handleExportAll = () => {
    const itemsToExport = evaluations.filter((e) => selectedIds.includes(e.id));
    if (itemsToExport.length === 0) {
      onShowToast('Selecciona al menos una fecha o evaluación para exportar.');
      return;
    }

    const icsContent = generateIcsContent(
      itemsToExport,
      'Evaluaciones - Universidad Latino'
    );
    const filename = `evaluaciones_universidad_latino_${itemsToExport.length}_eventos.ics`;
    downloadIcsFile(filename, icsContent);

    onShowToast(`¡Archivo ${filename} descargado! Importa en Google Calendar u Outlook.`);
    onClose();
  };

  const handleExportSingle = (item: EvaluationItem) => {
    const icsContent = generateIcsContent([item], `${item.title} - Universidad Latino`);
    const cleanName = item.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
    downloadIcsFile(`evaluacion_${cleanName}.ics`, icsContent);
    onShowToast(`¡Evento "${item.title}" exportado a .ics!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-slate-200 flex flex-col gap-4 max-h-[92vh] overflow-y-auto font-body">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container/10 text-primary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">
                event_upcoming
              </span>
            </div>
            <div>
              <h3 className="font-headline text-[17px] font-bold text-slate-900 leading-tight">
                Exportar Calendario (.ics)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Compatible con Google Calendar, Microsoft Outlook y Apple Calendar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Acceso Rápido y Plataformas */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-center transition ${
              activeTab === 'all'
                ? 'bg-white text-primary-container shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Descarga iCal (.ics)
          </button>
          <button
            onClick={() => setActiveTab('google')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-center transition flex items-center justify-center gap-1 ${
              activeTab === 'google'
                ? 'bg-white text-primary-container shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Google Calendar</span>
          </button>
          <button
            onClick={() => setActiveTab('outlook')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-center transition flex items-center justify-center gap-1 ${
              activeTab === 'outlook'
                ? 'bg-white text-primary-container shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Outlook</span>
          </button>
        </div>

        {/* Instrucciones según pestaña */}
        {activeTab === 'google' && (
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 text-xs flex flex-col gap-2">
            <div className="flex items-center gap-2 font-bold text-[13px] text-blue-950">
              <span className="material-symbols-outlined text-[18px] text-blue-600">
                calendar_today
              </span>
              <span>Cómo importar en Google Calendar:</span>
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-slate-700 text-[11px]">
              <li>Haz clic en el botón inferior para <strong>Descargar archivo .ics</strong>.</li>
              <li>Abre <strong>calendar.google.com</strong> en tu navegador.</li>
              <li>En la esquina superior derecha, haz clic en <strong>Configuración (⚙️) &gt; Importar y exportar</strong>.</li>
              <li>Sube el archivo <code className="bg-white px-1 py-0.5 rounded text-blue-800 font-mono">.ics</code> descargado y haz clic en <em>Importar</em>.</li>
            </ol>
            <div className="flex justify-end pt-1">
              <a
                href="https://calendar.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-blue-700 hover:underline flex items-center gap-1"
              >
                <span>Ir a Google Calendar Web</span>
                <span className="material-symbols-outlined text-[13px]">open_in_new</span>
              </a>
            </div>
          </div>
        )}

        {activeTab === 'outlook' && (
          <div className="p-3 rounded-xl bg-cyan-50/70 border border-cyan-200 text-cyan-900 text-xs flex flex-col gap-2">
            <div className="flex items-center gap-2 font-bold text-[13px] text-cyan-950">
              <span className="material-symbols-outlined text-[18px] text-cyan-700">
                mail
              </span>
              <span>Cómo importar en Microsoft Outlook:</span>
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-slate-700 text-[11px]">
              <li>Descarga el archivo <strong>.ics</strong> haciendo clic en el botón principal.</li>
              <li>En computadoras con la aplicación de Outlook instalada, basta con <strong>hacer doble clic en el archivo .ics</strong> para agregarlo.</li>
              <li>En <strong>Outlook Web</strong> (outlook.live.com u Office 365): Ve al Calendario &gt; <em>Agregar calendario</em> &gt; <em>Cargar desde archivo</em>.</li>
            </ol>
            <div className="flex justify-end pt-1">
              <a
                href="https://outlook.live.com/calendar"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-cyan-800 hover:underline flex items-center gap-1"
              >
                <span>Ir a Outlook Calendar Web</span>
                <span className="material-symbols-outlined text-[13px]">open_in_new</span>
              </a>
            </div>
          </div>
        )}

        {/* Resumen de Alarmas Integradas */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-emerald-600">
              notifications_active
            </span>
            <div>
              <span className="font-bold block text-[12px]">Alarmas automáticas incluidas</span>
              <span className="text-[11px] text-emerald-700">
                Recordatorios a las 24 horas y 2 horas antes del vencimiento.
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
            VALARM RFC 5545
          </span>
        </div>

        {/* Filtros y selección de evaluaciones */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-headline text-xs font-bold text-slate-800">
              Evaluaciones seleccionadas ({selectedIds.length} de {evaluations.length})
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[11px] text-primary-container font-semibold hover:underline"
              >
                {selectedIds.length === evaluations.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 mb-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                filterType === 'all'
                  ? 'bg-primary-container text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todas ({evaluations.length})
            </button>
            <button
              onClick={() => setFilterType('examenes')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                filterType === 'examenes'
                  ? 'bg-primary-container text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Exámenes
            </button>
            <button
              onClick={() => setFilterType('proyectos')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                filterType === 'proyectos'
                  ? 'bg-primary-container text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Proyectos & Entregas
            </button>
          </div>

          {/* Lista scrolleable de eventos con acciones individuales */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {filteredEvaluations.map((item) => {
              const isChecked = selectedIds.includes(item.id);
              const googleLink = getGoogleCalendarUrl(item);
              const outlookLink = getOutlookWebUrl(item);

              return (
                <div
                  key={item.id}
                  className={`p-2.5 rounded-xl border text-xs transition flex flex-col gap-1.5 ${
                    isChecked
                      ? 'bg-white border-slate-300 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <label className="flex items-start gap-2 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleSelect(item.id)}
                        className="mt-0.5 rounded text-primary-container focus:ring-primary-container w-4 h-4"
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900 text-[12px]">
                            {item.title}
                          </span>
                          <span
                            className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded font-mono ${
                              item.type === 'examen'
                                ? 'bg-amber-100 text-amber-900'
                                : item.badgeType === 'urgent'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {item.type ? item.type : item.badge}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {item.subject} • <span className="font-mono">{item.dueTime}</span>
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.location}
                        </span>
                      </div>
                    </label>

                    {/* Acciones individuales */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleExportSingle(item)}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-primary-container"
                        title="Descargar solo este evento en archivo .ics"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          download
                        </span>
                      </button>
                      <a
                        href={googleLink}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 rounded-lg hover:bg-blue-50 text-blue-600 hover:text-blue-800"
                        title="Añadir directo a Google Calendar"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          event
                        </span>
                      </a>
                      <a
                        href={outlookLink}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 rounded-lg hover:bg-cyan-50 text-cyan-600 hover:text-cyan-800"
                        title="Añadir directo a Microsoft Outlook Web"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          calendar_month
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer with Primary Action */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleExportAll}
            disabled={selectedIds.length === 0}
            className={`flex-1 py-2.5 px-4 rounded-xl font-headline text-xs font-bold flex items-center justify-center gap-2 shadow-md transition active:scale-95 ${
              selectedIds.length > 0
                ? 'bg-primary-container hover:bg-opacity-95 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              download_for_offline
            </span>
            <span>
              Descargar Archivo iCal ({selectedIds.length} eventos)
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
