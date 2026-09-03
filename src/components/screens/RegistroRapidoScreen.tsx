import React, { useState } from 'react';
import { AcademicTask, ScreenType } from '../../types';
import { ASSETS } from '../../data/mockData';

interface RegistroRapidoScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onAddTask: (task: AcademicTask) => void;
}

export const RegistroRapidoScreen: React.FC<RegistroRapidoScreenProps> = ({
  onNavigate,
  onAddTask,
}) => {
  const getTodayDateStr = () => new Date().toISOString().split('T')[0];
  const getFutureTimeStr = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 15);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const [title, setTitle] = useState('');
  const [courseName, setCourseName] = useState('Ingeniería de Software');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(getTodayDateStr());
  const [dueTime, setDueTime] = useState(getFutureTimeStr());
  const [status, setStatus] = useState<'pendiente' | 'en_progreso'>('pendiente');
  const [priority, setPriority] = useState<'baja' | 'media' | 'urgente'>('media');
  const [reminderMinutes, setReminderMinutes] = useState<number>(10);
  const [attachments, setAttachments] = useState<{ name: string; size: string; type: string }[]>([
    { name: 'Rubrica_Evaluacion_Final.pdf', size: '1.4 MB • Rúbrica oficial', type: 'pdf' },
  ]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleAddAttachment = () => {
    if (attachments.length >= 3) return;
    const newIdx = attachments.length + 1;
    setAttachments([
      ...attachments,
      {
        name: `Repositorio_Proyecto_v${newIdx}.zip`,
        size: '8.2 MB • Archivo adjunto',
        type: 'zip',
      },
    ]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalCourseName = courseName.trim() || 'Materia General';
    const generatedCode = finalCourseName.slice(0, 3).toUpperCase() + '-101';

    const newTask: AcademicTask = {
      id: `task-${Date.now()}`,
      code: generatedCode,
      courseName: finalCourseName,
      moduleOrDetail: 'Módulo académico',
      title: title,
      description: description || 'Sin descripción adicional.',
      dueDate: dueDate,
      dueTime: dueTime,
      dueTimeText: `${dueDate} • ${dueTime} hrs`,
      status: status,
      priority: priority,
      reminderMinutes: reminderMinutes,
      urgentBadge: priority === 'urgente' ? '¡Cierra hoy!' : priority === 'media' ? 'Próxima' : 'Normal',
      timeRemaining: 'Programada',
      attachmentsCount: attachments.length,
      attachmentName: attachments[0]?.name || undefined,
      attachmentSize: attachments[0]?.size || undefined,
      progressPercent: status === 'en_progreso' ? 25 : 0,
      timelineSection: 'hoy',
      category: 'dev',
      subtasks: [
        { id: 'st-1', title: 'Revisión inicial del requerimiento', completed: true },
        { id: 'st-2', title: 'Elaboración y entrega del proyecto', completed: false },
      ],
    };

    onAddTask(newTask);
    setShowSuccessModal(true);
  };

  return (
    <main className="flex flex-col relative w-full pt-16 pb-safe bg-surface min-h-screen">
      <div className="flex flex-col w-full pb-12 max-w-md mx-auto">
        {/* Interactive Form Container */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-space-lg px-margin-mobile pt-3" id="task-registration-form">
          {/* Top Warm Banner & Motivation */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low p-space-lg shadow-xs">
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-space-2xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    auto_stories
                  </span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider">Semestre Activo</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Nueva Tarea Académica</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Registra los datos de tu entrega o actividad para mantener tu calendario al día.
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs shrink-0">
                <span className="material-symbols-outlined text-[26px]">edit_note</span>
              </div>
            </div>
          </div>

          {/* Section 1: Core Details Card */}
          <div className="flex flex-col gap-space-md p-space-lg rounded-xl bg-surface-container-lowest shadow-xs">
            <div className="flex items-center gap-space-xs text-primary">
              <span className="material-symbols-outlined text-[20px]">assignment</span>
              <h3 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wide">
                Información Principal
              </h3>
            </div>

            {/* Título de la tarea */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface flex items-center justify-between" htmlFor="task-title">
                <span>
                  Título de la tarea <span className="text-error">*</span>
                </span>
                <span className="font-label-sm text-label-sm text-outline">{title.length}/70</span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="task-title"
                  type="text"
                  maxLength={70}
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ej. Investigación de Patrones de Arquitectura"
                  className="w-full h-12 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]"
                />
              </div>
            </div>

            {/* Materia / Asignatura Input (Escritura Libre) */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="course-input">
                Materia / Asignatura <span className="text-error">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="course-input"
                  type="text"
                  required
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="Escribe el nombre de tu materia o asignatura..."
                  className="w-full h-12 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]"
                />
              </div>
              {/* Sugerencias de escritura rápida */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar">
                <span className="font-label-xs text-label-xs text-outline shrink-0">Sugerencias:</span>
                {['Ingeniería de Software', 'Base de Datos', 'Redes de Computadoras', 'Cálculo Avanzado', 'Física', 'Programación Web'].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setCourseName(sug)}
                    className="px-2.5 py-0.5 rounded-full bg-surface-container-high hover:bg-primary/10 hover:text-primary text-on-surface-variant font-label-xs text-label-xs transition-colors shrink-0 cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Descripción y detalles */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="task-desc">
                Descripción y detalles
              </label>
              <textarea
                id="task-desc"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Notas adicionales, requisitos solicitados por el docente, rúbrica de evaluación o directrices clave..."
                className="w-full p-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]"
              />
            </div>
          </div>

          {/* Section 2: Deadlines & Scheduling Card */}
          <div className="flex flex-col gap-space-md p-space-lg rounded-xl bg-surface-container-lowest shadow-xs">
            <div className="flex items-center gap-space-xs text-primary">
              <span className="material-symbols-outlined text-[20px]">schedule</span>
              <h3 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wide">Plazos de Entrega</h3>
            </div>

            <div className="grid grid-cols-2 gap-space-sm">
              {/* Fecha de Entrega */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface truncate" htmlFor="due-date">
                  Fecha Límite
                </label>
                <div className="relative flex items-center">
                  <input
                    id="due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full h-12 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              {/* Hora Límite */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface truncate" htmlFor="due-time">
                  Hora Límite
                </label>
                <div className="relative flex items-center">
                  <input
                    id="due-time"
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full h-12 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Recordatorio Configurable */}
            <div className="flex flex-col gap-2 pt-1">
              <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-primary">notifications_active</span>
                  <span>Aviso de Alarma y Timbre</span>
                </span>
                <span className="font-label-sm text-label-sm text-primary font-bold">{reminderMinutes} min antes</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '5 min', value: 5 },
                  { label: '10 min', value: 10 },
                  { label: '15 min', value: 15 },
                  { label: '30 min', value: 30 },
                  { label: '1 hora', value: 60 },
                  { label: '1 día', value: 1440 },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setReminderMinutes(opt.value)}
                    className={`py-2 px-1 rounded-lg font-label-sm text-label-sm font-semibold transition-all cursor-pointer ${
                      reminderMinutes === opt.value
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    {opt.label} antes
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Status & Priority Card */}
          <div className="flex flex-col gap-space-md p-space-lg rounded-xl bg-surface-container-lowest shadow-xs">
            <div className="flex items-center gap-space-xs text-primary">
              <span className="material-symbols-outlined text-[20px]">tune</span>
              <h3 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wide">Estado y Prioridad</h3>
            </div>

            {/* Initial Status Pills */}
            <div className="flex flex-col gap-2">
              <span className="font-label-md text-label-md text-on-surface">Estado inicial</span>
              <div className="grid grid-cols-2 gap-space-xs bg-surface-container-low p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setStatus('pendiente')}
                  className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-1.5 font-label-md text-label-md transition-all ${
                    status === 'pendiente'
                      ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
                  <span>Pendiente</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('en_progreso')}
                  className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-1.5 font-label-md text-label-md transition-all ${
                    status === 'en_progreso'
                      ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-surface-tint"></span>
                  <span>En progreso</span>
                </button>
              </div>
            </div>

            {/* Priority Selector */}
            <div className="flex flex-col gap-2">
              <span className="font-label-md text-label-md text-on-surface">Nivel de prioridad</span>
              <div className="grid grid-cols-3 gap-2">
                {/* Baja */}
                <button
                  type="button"
                  onClick={() => setPriority('baja')}
                  className={`h-11 rounded-lg flex flex-col items-center justify-center font-label-md text-label-md transition-all ${
                    priority === 'baja'
                      ? 'bg-tertiary-container text-on-tertiary font-bold shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span>Baja</span>
                </button>

                {/* Media */}
                <button
                  type="button"
                  onClick={() => setPriority('media')}
                  className={`h-11 rounded-lg flex flex-col items-center justify-center font-label-md text-label-md transition-all ${
                    priority === 'media'
                      ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span>Media</span>
                </button>

                {/* Alta / Urgente */}
                <button
                  type="button"
                  onClick={() => setPriority('urgente')}
                  className={`h-11 rounded-lg flex flex-col items-center justify-center font-label-md text-label-md transition-all ${
                    priority === 'urgente'
                      ? 'bg-error text-on-error font-bold shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span>Alta</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: Attachments & Resources Card */}
          <div className="flex flex-col gap-space-md p-space-lg rounded-xl bg-surface-container-lowest shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs text-primary">
                <span className="material-symbols-outlined text-[20px]">attach_file</span>
                <h3 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wide">
                  Recursos y Archivos
                </h3>
              </div>
              <span className="font-label-sm text-label-sm text-outline">Opcional</span>
            </div>

            {/* Drag / Drop Upload Dropzone Mock */}
            <div
              onClick={handleAddAttachment}
              className="flex flex-col items-center justify-center gap-2 p-space-lg rounded-xl bg-surface-container-low text-center cursor-pointer hover:bg-surface-container transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs">
                <span className="material-symbols-outlined text-[22px]">cloud_upload</span>
              </div>
              <div>
                <p className="font-label-md text-label-md text-on-surface font-semibold">Toca para adjuntar archivos o enlaces</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  PDF, DOCX, ZIP o URL del repositorio (Máx. 25MB)
                </p>
              </div>
            </div>

            {/* Dynamic Attachment Preview Target */}
            <div className="flex flex-col gap-2">
              {attachments.map((att, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-error-container text-error flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">
                        {att.type === 'pdf' ? 'picture_as_pdf' : 'link'}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-md text-label-md text-on-surface truncate font-semibold">{att.name}</span>
                      <span className="font-label-sm text-label-sm text-outline">{att.size}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(idx)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-error transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Academic Snapshot Card */}
          <div className="rounded-xl overflow-hidden bg-surface-container-lowest shadow-xs flex flex-col">
            <div
              className="relative h-28 w-full bg-cover bg-center"
              style={{ backgroundImage: `url('${ASSETS.studyDeskRegistro}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent"></div>
              <div className="absolute bottom-3 left-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">lightbulb</span>
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">Consejo de estudio</span>
              </div>
            </div>
            <div className="px-space-md pb-space-md pt-1">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Dividir tus tareas grandes en fases incrementales reduce los picos de estrés y mejora tu rendimiento promedio.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-space-sm pt-space-xs">
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md active:bg-primary-container transition-all cursor-pointer font-semibold"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                save
              </span>
              <span>Guardar Tarea</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('calendario')}
              className="w-full h-12 rounded-xl bg-surface-container text-on-surface font-label-lg text-label-lg flex items-center justify-center hover:bg-surface-container-high active:bg-surface-container-highest transition-all font-semibold"
            >
              Cancelar / Descartar
            </button>
          </div>
        </form>

        {/* Success Modal Confirmation */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-margin-mobile bg-inverse-surface/40 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-2xl bg-surface-container-lowest p-space-xl flex flex-col items-center text-center shadow-xl space-y-4 border border-surface-container">
              <div className="w-16 h-16 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
                <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">¡Tarea Registrada!</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  La actividad ha sido añadida exitosamente a tu calendario académico.
                </p>
              </div>
              <div className="w-full pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowSuccessModal(false);
                    onNavigate('calendario');
                  }}
                  className="w-full h-11 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center font-semibold"
                >
                  Volver a mi Agenda
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
