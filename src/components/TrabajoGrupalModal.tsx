import React, { useState } from 'react';
import { AcademicTask } from '../types';
import { ASSETS } from '../data/mockData';

interface TrabajoGrupalModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: AcademicTask[];
  onUpdateTask: (task: AcademicTask) => void;
}

interface ClassmateUser {
  username: string;
  name: string;
  program: string;
  campus: string;
  photo: string;
}

// Predefined registered classmates in database
const REGISTERED_CLASSMATES: ClassmateUser[] = [
  {
    username: 'maria.sanchez',
    name: 'María Sánchez',
    program: 'Ingeniería de Software',
    campus: 'Campus Central',
    photo: ASSETS.partnerPhoto,
  },
  {
    username: 'carlos.gomez',
    name: 'Carlos Gómez',
    program: 'Base de Datos & Sistemas',
    campus: 'Campus Norte',
    photo: ASSETS.userAvatar,
  },
  {
    username: 'ana.rodriguez',
    name: 'Ana Rodríguez',
    program: 'Redes de Computadoras',
    campus: 'Campus Central',
    photo: ASSETS.professorPhoto,
  },
];

export const TrabajoGrupalModal: React.FC<TrabajoGrupalModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onUpdateTask,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [foundUser, setFoundUser] = useState<ClassmateUser | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [isSyncSuccess, setIsSyncSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    setIsSyncSuccess(false);
    const queryClean = searchQuery.trim().toLowerCase();

    if (!queryClean) {
      setSearchError('Por favor ingresa el usuario, correo o matrícula del compañero.');
      return;
    }

    const found = REGISTERED_CLASSMATES.find(
      (u) =>
        u.username.toLowerCase().includes(queryClean) ||
        u.name.toLowerCase().includes(queryClean) ||
        queryClean.includes(u.username.split('.')[0])
    );

    if (found) {
      setFoundUser(found);
      // Select pending tasks by default
      const pendingIds = tasks.filter((t) => t.status !== 'terminada').map((t) => t.id);
      setSelectedTaskIds(pendingIds);
    } else {
      setFoundUser(null);
      // Fallback custom user if user typed a valid email format
      if (queryClean.includes('@') || queryClean.length >= 4) {
        const formattedName = queryClean.split('@')[0].replace('.', ' ');
        const capitalizedName = formattedName
          .split(' ')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        setFoundUser({
          username: queryClean,
          name: capitalizedName || 'Compañero Registrado',
          program: 'Carrera Académica',
          campus: 'Campus Principal',
          photo: ASSETS.partnerPhoto,
        });
      } else {
        setSearchError('Usuario no encontrado. Asegúrate de ingresar el usuario o correo registrado.');
      }
    }
  };

  const toggleTaskSelection = (taskId: string) => {
    if (selectedTaskIds.includes(taskId)) {
      setSelectedTaskIds(selectedTaskIds.filter((id) => id !== taskId));
    } else {
      setSelectedTaskIds([...selectedTaskIds, taskId]);
    }
  };

  const handleConfirmSync = () => {
    if (!foundUser || selectedTaskIds.length === 0) return;

    selectedTaskIds.forEach((id) => {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        const updated: AcademicTask = {
          ...task,
          partnerName: foundUser.name,
          partnerPhoto: foundUser.photo,
          collaborators: [foundUser.name],
        };
        onUpdateTask(updated);
      }
    });

    setIsSyncSuccess(true);
    setTimeout(() => {
      setIsSyncSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg bg-surface-container-lowest border border-surface-container rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-primary text-on-primary flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xs shrink-0">
              <span className="material-symbols-outlined text-[24px]">group_add</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm font-bold">Trabajo Grupal & Binas</h2>
              <p className="font-body-xs text-body-xs text-on-primary/80">
                Busca a un compañero registrado y sincroniza tareas
              </p>
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

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {isSyncSuccess ? (
            <div className="p-8 text-center bg-tertiary-container/30 border border-tertiary/20 rounded-2xl space-y-3 animate-scale-up">
              <span className="material-symbols-outlined text-[56px] text-tertiary animate-bounce">
                handshake
              </span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                ¡Bina Sincronizada Exitosamente!
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Las tareas seleccionadas ahora están sincronizadas con <strong>{foundUser?.name}</strong>.
              </p>
            </div>
          ) : (
            <>
              {/* Search Form */}
              <form onSubmit={handleSearch} className="space-y-2">
                <label className="font-label-md text-label-md font-bold text-on-surface block">
                  1. Buscar Usuario o Correo del Compañero
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ej. maria.sanchez, carlos.gomez@campus.edu..."
                    className="flex-1 h-12 px-4 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <button
                    type="submit"
                    className="px-5 h-12 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold flex items-center gap-1.5 shadow-xs hover:bg-primary-container transition-all cursor-pointer shrink-0"
                  >
                    <span className="material-symbols-outlined text-[18px]">search</span>
                    <span>Buscar</span>
                  </button>
                </div>
                {searchError && (
                  <p className="font-body-xs text-body-xs text-error font-medium flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    <span>{searchError}</span>
                  </p>
                )}
              </form>

              {/* Found User Profile Card */}
              {foundUser && (
                <div className="p-4 rounded-xl bg-primary-container/20 border border-primary/20 space-y-4 animate-fade-in">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={foundUser.photo}
                      alt={foundUser.name}
                      className="w-12 h-12 rounded-full object-cover shadow-xs border-2 border-primary/30 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-label-lg text-label-lg font-bold text-on-surface truncate">
                          {foundUser.name}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-xs text-label-xs font-bold shrink-0">
                          Registrado ✓
                        </span>
                      </div>
                      <p className="font-body-xs text-body-xs text-on-surface-variant truncate">
                        {foundUser.program} • {foundUser.campus}
                      </p>
                    </div>
                  </div>

                  {/* Step 2: Task Checkboxes */}
                  <div className="space-y-2 pt-2 border-t border-primary/10">
                    <div className="flex items-center justify-between">
                      <label className="font-label-md text-label-md font-bold text-on-surface">
                        2. Selecciona las tareas a sincronizar:
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedTaskIds.length === tasks.length) {
                            setSelectedTaskIds([]);
                          } else {
                            setSelectedTaskIds(tasks.map((t) => t.id));
                          }
                        }}
                        className="font-label-xs text-label-xs text-primary font-semibold hover:underline cursor-pointer"
                      >
                        {selectedTaskIds.length === tasks.length ? 'Desmarcar todas' : 'Seleccionar todas'}
                      </button>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {tasks.map((t) => {
                        const isChecked = selectedTaskIds.includes(t.id);
                        return (
                          <label
                            key={t.id}
                            onClick={() => toggleTaskSelection(t.id)}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                              isChecked
                                ? 'bg-surface-container-lowest border-primary shadow-xs'
                                : 'bg-surface-container-low border-transparent opacity-75'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}}
                                className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                              />
                              <div className="min-w-0">
                                <p className="font-label-md text-label-md font-semibold text-on-surface truncate">
                                  {t.title}
                                </p>
                                <p className="font-body-xs text-body-xs text-on-surface-variant truncate">
                                  {t.courseName} • Vence {t.dueDate}
                                </p>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Confirm Button */}
                  <button
                    type="button"
                    onClick={handleConfirmSync}
                    disabled={selectedTaskIds.length === 0}
                    className={`w-full py-3 rounded-xl font-label-md text-label-md font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                      selectedTaskIds.length > 0
                        ? 'bg-primary text-on-primary hover:bg-primary-container active:scale-98'
                        : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">sync</span>
                    <span>Sincronizar {selectedTaskIds.length} {selectedTaskIds.length === 1 ? 'Tarea' : 'Tareas'} con {foundUser.name}</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};


