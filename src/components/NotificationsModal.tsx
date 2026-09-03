import React, { useState, useEffect } from 'react';
import { AcademicTask } from '../types';
import { playNotificationChime, requestNotificationPermission } from '../utils/notifications';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: AcademicTask[];
  defaultReminderMinutes: number;
  onChangeDefaultReminder: (minutes: number) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  tasks,
  defaultReminderMinutes,
  onChangeDefaultReminder,
}) => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isPlayingTestSound, setIsPlayingTestSound] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setHasPermission(Notification.permission === 'granted');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setHasPermission(granted);
    if (granted) {
      playNotificationChime();
    }
  };

  const handleTestSound = () => {
    setIsPlayingTestSound(true);
    playNotificationChime();
    setTimeout(() => setIsPlayingTestSound(false), 1200);
  };

  const activeTasksWithReminders = tasks.filter((t) => t.status !== 'terminada');

  const reminderOptions = [
    { label: '5 minutos antes', value: 5 },
    { label: '10 minutos antes (Recomendado)', value: 10 },
    { label: '15 minutos antes', value: 15 },
    { label: '30 minutos antes', value: 30 },
    { label: '1 hora antes', value: 60 },
    { label: '1 día antes', value: 1440 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg bg-surface-container-lowest border border-surface-container rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-primary-container text-on-primary flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-xs">
              <span className="material-symbols-outlined text-[22px]">notifications_active</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm font-bold">Notificaciones y Timbre</h2>
              <p className="font-body-xs text-body-xs text-on-primary/80">Configura alarmas de audio y tiempo de aviso</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/15 transition-colors text-on-primary cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Audio Chime Test Section */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-tertiary-fixed-variant">volume_up</span>
                Timbre de Alerta Sonora
              </span>
              <span className="font-body-xs text-body-xs text-on-surface-variant">
                Suena un tono de campana universitaria al vencer el tiempo
              </span>
            </div>
            <button
              type="button"
              onClick={handleTestSound}
              disabled={isPlayingTestSound}
              className="px-4 py-2 rounded-lg bg-tertiary-container hover:bg-tertiary text-on-tertiary font-label-md text-label-md font-semibold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <span className={`material-symbols-outlined text-[18px] ${isPlayingTestSound ? 'animate-bounce' : ''}`}>
                notifications_active
              </span>
              <span>{isPlayingTestSound ? '¡Sonando!' : 'Probar Timbre'}</span>
            </button>
          </div>

          {/* Browser Native Permission Section */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary">devices</span>
                Notificaciones Nativas del Navegador
              </span>
              <span className="font-body-xs text-body-xs text-on-surface-variant">
                {hasPermission
                  ? '✓ Permiso concedido (Suena aunque cambies de pestaña)'
                  : 'Permite avisos flotantes en la pantalla de tu dispositivo'}
              </span>
            </div>
            {!hasPermission && (
              <button
                type="button"
                onClick={handleRequestPermission}
                className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-all shadow-xs cursor-pointer shrink-0"
              >
                Activar Permiso
              </button>
            )}
          </div>

          {/* Default Lead Time Selector */}
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-secondary">timer</span>
              Tiempo de Anticipación por Defecto
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {reminderOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChangeDefaultReminder(opt.value)}
                  className={`p-3 rounded-xl border text-left font-label-sm text-label-sm transition-all cursor-pointer flex items-center justify-between ${
                    defaultReminderMinutes === opt.value
                      ? 'bg-primary-container text-on-primary border-primary font-bold shadow-xs'
                      : 'bg-surface-container-low text-on-surface border-surface-container hover:bg-surface-container'
                  }`}
                >
                  <span>{opt.label}</span>
                  {defaultReminderMinutes === opt.value && (
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Active Task Reminders List */}
          <div className="flex flex-col gap-2 pt-2 border-t border-surface-container">
            <span className="font-label-md text-label-md font-bold text-on-surface flex items-center justify-between">
              <span>Próximas Tareas Agendadas ({activeTasksWithReminders.length})</span>
              <span className="font-label-sm text-label-sm text-outline font-normal">Timbre a los {defaultReminderMinutes} min antes</span>
            </span>
            {activeTasksWithReminders.length === 0 ? (
              <p className="font-body-sm text-body-sm text-outline italic py-3 text-center">
                No tienes tareas pendientes pendientes de aviso.
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {activeTasksWithReminders.map((task) => {
                  const leadMins = task.reminderMinutes || defaultReminderMinutes;
                  return (
                    <div
                      key={task.id}
                      className="p-3 rounded-lg bg-surface-container-low border border-surface-container flex items-center justify-between text-on-surface gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <h4 className="font-label-md text-label-md font-semibold truncate">{task.title}</h4>
                        <p className="font-body-xs text-body-xs text-on-surface-variant truncate">
                          {task.courseName} • Entrega: {task.dueDate} {task.dueTime}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-secondary-fixed/50 text-secondary font-label-xs text-label-xs font-bold shrink-0 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">alarm</span>
                        {leadMins} min antes
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-surface-container-low border-t border-surface-container flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-all cursor-pointer"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
