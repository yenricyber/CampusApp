import React, { useState } from 'react';
import { AcademicTask, ScreenType, Subtask } from '../../types';
import { ASSETS } from '../../data/mockData';

interface DetalleTareaScreenProps {
  task: AcademicTask;
  onNavigate: (screen: ScreenType) => void;
  onUpdateTask: (task: AcademicTask) => void;
  onDeleteTask: (taskId: string) => void;
}

export const DetalleTareaScreen: React.FC<DetalleTareaScreenProps> = ({
  task,
  onNavigate,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [currentStatus, setCurrentStatus] = useState<'pendiente' | 'terminada'>(
    task.status === 'terminada' ? 'terminada' : 'pendiente'
  );
  const [subtasks, setSubtasks] = useState<Subtask[]>(
    task.subtasks || [
      { id: 'sub-1', title: 'Reunión de alineación con compañero de bina', completed: true },
      { id: 'sub-2', title: 'Diagrama de secuencia del módulo autenticación', completed: true },
      { id: 'sub-3', title: 'Exportar documento final en formato PDF estándar', completed: false },
    ]
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const completedSubtasksCount = subtasks.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedSubtasksCount / subtasks.length) * 100);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleStatusChange = (status: 'pendiente' | 'terminada') => {
    setCurrentStatus(status);
    const updated = {
      ...task,
      status: status,
      progressPercent: status === 'terminada' ? 100 : progressPercent,
    };
    onUpdateTask(updated);
    showToast(status === 'terminada' ? 'Tarea marcada como Terminada' : 'Tarea restablecida como Pendiente');
  };

  const handleSubtaskToggle = (subtaskId: string) => {
    const updatedSubtasks = subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    setSubtasks(updatedSubtasks);

    const newDoneCount = updatedSubtasks.filter((s) => s.completed).length;
    const newPercent = Math.round((newDoneCount / updatedSubtasks.length) * 100);
    const allDone = newDoneCount === updatedSubtasks.length;

    const newStatus = allDone ? 'terminada' : currentStatus;
    if (allDone && currentStatus !== 'terminada') {
      setCurrentStatus('terminada');
      showToast('¡Todas las subtareas listas! Tarea completada.');
    }

    onUpdateTask({
      ...task,
      subtasks: updatedSubtasks,
      progressPercent: newPercent,
      status: newStatus,
    });
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    showToast('Tarea eliminada correctamente del sílabo');
    setTimeout(() => {
      onDeleteTask(task.id);
      onNavigate('calendario');
    }, 800);
  };

  return (
    <main className="flex flex-col relative w-full pt-16 pb-24 bg-surface min-h-screen">
      <div className="flex flex-col w-full pb-28 max-w-2xl mx-auto px-margin-mobile pt-2">
        {/* Header Breadcrumb / Course */}
        <div className="pt-space-sm pb-space-xs flex flex-col gap-space-2xs">
          <div className="flex items-center justify-between gap-space-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm tracking-wider uppercase font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              {task.courseName} • {task.code}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[14px]">group</span> En binas
            </span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1 font-bold">
            {task.title}
          </h2>
        </div>

        {/* Interactive Status Banner */}
        <div className="px-margin-mobile my-space-sm">
          <div className="relative overflow-hidden rounded-xl bg-surface-container-low p-space-md shadow-xs transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`material-symbols-outlined text-[20px] transition-transform duration-300 ${
                    currentStatus === 'terminada' ? 'text-tertiary-container scale-110' : 'text-secondary'
                  }`}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {currentStatus === 'terminada' ? 'task_alt' : 'pending_actions'}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                  Estado de la Entrega
                </span>
              </div>
              <span
                className={`font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-semibold transition-colors ${
                  currentStatus === 'terminada'
                    ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                    : 'bg-secondary-fixed text-on-secondary-fixed'
                }`}
              >
                {currentStatus === 'terminada' ? 'Terminada' : 'Pendiente'}
              </span>
            </div>

            {/* Segmented State Switcher (1 Tap) */}
            <div className="bg-surface-container rounded-lg p-1 flex relative select-none">
              <button
                type="button"
                onClick={() => handleStatusChange('pendiente')}
                className={`flex-1 py-2.5 rounded-md flex items-center justify-center gap-1.5 font-label-lg text-label-lg transition-all duration-200 cursor-pointer ${
                  currentStatus === 'pendiente'
                    ? 'bg-surface-container-lowest text-on-secondary-container shadow-xs font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
                <span>Pendiente</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('terminada')}
                className={`flex-1 py-2.5 rounded-md flex items-center justify-center gap-1.5 font-label-lg text-label-lg transition-all duration-200 cursor-pointer ${
                  currentStatus === 'terminada'
                    ? 'bg-surface-container-lowest text-tertiary-container shadow-xs font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Terminada</span>
              </button>
            </div>

            {/* Live celebratory micro-message */}
            <div
              className={`mt-2.5 flex items-center gap-1.5 font-body-sm text-body-sm ${
                currentStatus === 'terminada' ? 'text-tertiary-container' : 'text-secondary'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {currentStatus === 'terminada' ? 'celebration' : 'alarm'}
              </span>
              <span>
                {currentStatus === 'terminada'
                  ? '¡Excelente trabajo! Entregable completado a tiempo.'
                  : 'Aún requiere revisión previa a la subida final institucional.'}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Window Countdown Card */}
        <div className="px-margin-mobile mb-space-sm">
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs flex items-start gap-space-sm border border-surface-container">
            <div className="w-12 h-12 rounded-xl bg-error-container text-on-error-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[26px]">event_busy</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant font-medium">
                  Fecha y Hora límite
                </span>
                <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-error bg-error-container/60 px-2 py-0.5 rounded-full font-semibold">
                  <span className="material-symbols-outlined text-[14px]">timer</span> Faltan 4 horas
                </span>
              </div>
              <p className="font-headline-sm text-headline-sm text-on-surface mt-0.5 font-bold">
                Hoy, 24 Octubre 2025
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                23:59 hrs • Plataforma Institucional CampusApp
              </p>
            </div>
          </div>
        </div>

        {/* Professor & Academic Context Details */}
        <div className="px-margin-mobile mb-space-sm">
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs flex items-center justify-between gap-space-sm border border-surface-container">
            <div className="flex items-center gap-space-sm min-w-0">
              <img
                alt="Profesor Titular"
                className="w-11 h-11 rounded-full object-cover shrink-0 shadow-xs ring-1 ring-primary/10"
                src={task.professorPhoto || ASSETS.professorPhoto}
              />
              <div className="min-w-0">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">
                  Profesor Titular
                </span>
                <h3 className="font-label-lg text-label-lg text-on-surface truncate font-semibold">
                  {task.professorName || 'Dr. Fernando Méndez'}
                </h3>
                <p className="font-body-sm text-body-sm text-primary truncate font-medium">
                  {task.courseName} (Módulo 3)
                </p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Contactar Profesor"
              onClick={() => showToast('Iniciando chat institucional con el profesor...')}
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary active:scale-95 transition-transform hover:bg-surface-container-high cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
            </button>
          </div>
        </div>

        {/* Task Full Description Card */}
        <div className="px-margin-mobile mb-space-sm">
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs flex flex-col gap-space-xs border border-surface-container">
            <div className="flex items-center justify-between">
              <h4 className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5 font-semibold">
                <span className="material-symbols-outlined text-[18px] text-primary">description</span>
                Descripción completa
              </h4>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Ponderación: 15%</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {task.description}
            </p>

            {/* Attached deliverables preview */}
            <div className="mt-space-xs pt-space-xs bg-surface-container-low rounded-lg p-space-sm flex items-center justify-between">
              <div className="flex items-center gap-space-xs min-w-0">
                <span className="material-symbols-outlined text-primary text-[22px]">attachment</span>
                <div className="min-w-0">
                  <p className="font-label-md text-label-md text-on-surface truncate font-semibold">
                    {task.attachmentName || 'Plantilla_UML_v2.4.pdf'}
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {task.attachmentSize || '1.8 MB • Guía institucional'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => showToast('Descargando archivo adjunto...')}
                className="text-primary font-label-md text-label-md flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container-lowest shadow-xs active:scale-95 transition-transform font-semibold cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">download</span> Ver
              </button>
            </div>
          </div>
        </div>

        {/* Subtasks & Progress Checklist Section */}
        <div className="px-margin-mobile mb-space-sm">
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container">
            <div className="flex items-center justify-between mb-space-xs">
              <div>
                <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">Avance de Subtareas</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Control de entregables en equipo</p>
              </div>
              <span className="font-label-sm text-label-sm font-semibold px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed">
                {completedSubtasksCount} de {subtasks.length} listas
              </span>
            </div>

            {/* Linear progress indicator bar */}
            <div className="w-full h-2 rounded-full bg-surface-container mb-space-md overflow-hidden">
              <div
                className="h-full bg-tertiary-container transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            {/* Checkbox Items */}
            <div className="space-y-2.5">
              {subtasks.map((st) => (
                <label
                  key={st.id}
                  className="flex items-center gap-space-sm p-2.5 rounded-lg bg-surface-container-low/70 cursor-pointer select-none transition-colors hover:bg-surface-container-low"
                >
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => handleSubtaskToggle(st.id)}
                    className="sr-only peer"
                  />
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors shadow-xs ${
                      st.completed
                        ? 'bg-tertiary-container text-on-tertiary'
                        : 'bg-surface-container-highest text-transparent shadow-inner'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  </div>
                  <span
                    className={`font-body-md text-body-md text-on-surface flex-1 ${
                      st.completed ? 'line-through opacity-60' : ''
                    }`}
                  >
                    {st.title}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Peer Collaborator Card */}
        <div className="px-margin-mobile mb-space-md">
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs flex items-center justify-between border border-surface-container">
            <div className="flex items-center gap-space-sm">
              <img
                alt="Compañera de bina"
                className="w-10 h-10 rounded-full object-cover shadow-xs ring-1 ring-primary/10"
                src={task.partnerPhoto || ASSETS.partnerPhoto}
              />
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Compañera de bina asignada</p>
                <p className="font-label-md text-label-md text-on-surface font-semibold">
                  {task.partnerName || 'Compañero no asignado'}
                </p>
              </div>
            </div>
            <span className="font-label-sm text-label-sm px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-medium">
              Activa hace 20m
            </span>
          </div>
        </div>

        {/* Operational Action Area: Modificar / Eliminar */}
        <div className="px-margin-mobile mt-space-xs flex flex-col gap-space-xs">
          {/* Edit Primary CTA */}
          <button
            type="button"
            onClick={() => onNavigate('registro-rapido')}
            className="w-full h-12 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md active:bg-primary-container transition-all font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">edit_document</span>
            <span>Modificar / Editar Tarea</span>
          </button>

          {/* Delete Destructive Trigger */}
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="w-full h-12 rounded-xl bg-error-container/40 text-error hover:bg-error-container/70 active:bg-error-container font-label-lg text-label-lg flex items-center justify-center gap-2 transition-colors font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">delete_forever</span>
            <span>Eliminar Tarea</span>
          </button>

          {/* Institutional Policy Hint */}
          <p className="text-center font-body-sm text-body-sm text-on-surface-variant px-space-md pt-1">
            El alumno podrá eliminar tareas o actividades que ya no necesite o hayan sido dadas de baja del sílabo oficial.
          </p>
        </div>

        {/* Modal Backdrop: Confirmation Dialog for Deletion */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl p-space-lg shadow-xl flex flex-col gap-space-md border border-surface-container">
              <div className="w-14 h-14 rounded-2xl bg-error-container text-error flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[32px]">delete_sweep</span>
              </div>
              <div className="text-center">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">¿Eliminar esta tarea?</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Esta acción removerá el entregable <strong className="text-on-surface">"{task.title}"</strong> de tu agenda académica y la de tu bina.
                </p>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="w-full h-12 rounded-xl bg-error text-on-error font-label-lg text-label-lg flex items-center justify-center gap-2 active:opacity-90 transition-opacity font-semibold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  <span>Sí, eliminar actividad</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full h-12 rounded-xl bg-surface-container text-on-surface font-label-lg text-label-lg flex items-center justify-center active:bg-surface-container-high transition-colors font-semibold cursor-pointer"
                >
                  Cancelar y conservar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 inset-x-4 max-w-sm mx-auto z-50 flex items-center gap-3 p-3.5 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-lg animate-in slide-in-from-bottom duration-300">
            <span className="material-symbols-outlined text-tertiary-fixed text-[22px]">check_circle</span>
            <p className="font-body-sm text-body-sm font-medium flex-1">{toastMessage}</p>
          </div>
        )}
      </div>
    </main>
  );
};
