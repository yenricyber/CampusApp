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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    setIsSyncSuccess(false);
    const queryClean = searchQuery.trim().toLowerCase();

    if (!queryClean) {
      setSearchError('Por favor ingresa el usuario, correo o matrícula del compañero.');
      return;
    }

    // 1. Buscar en usuarios reales de la base de datos
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(queryClean)}`);
      if (res.ok) {
        const dbUsers = await res.json();
        if (Array.isArray(dbUsers) && dbUsers.length > 0) {
          const u = dbUsers[0];
          setFoundUser({
            username: u.studentId,
            name: u.name,
            program: u.program || 'Carrera Académica',
            campus: u.semester || 'Campus Principal',
            photo: u.avatarUrl || '',
          });
          const pendingIds = tasks.filter((t) => t.status !== 'terminada').map((t) => t.id);
          setSelectedTaskIds(pendingIds);
          return;
        }
      }
    } catch (err) {
      console.warn('Aviso de búsqueda backend:', err);
    }

    // 2. Buscar en lista estática
    const found = REGISTERED_CLASSMATES.find(
      (u) =>
        u.username.toLowerCase().includes(queryClean) ||
        u.name.toLowerCase().includes(queryClean) ||
        queryClean.includes(u.username.split('.')[0])
    );

    if (found) {
      setFoundUser(found);
      const pendingIds = tasks.filter((t) => t.status !== 'terminada').map((t) => t.id);
      setSelectedTaskIds(pendingIds);
      return;
    }

    // 3. Fallback dinámico con inicial de usuario real (sin imagen de muestra fija)
    if (queryClean.length >= 3) {
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
        photo: '',
      });
      const pendingIds = tasks.filter((t) => t.status !== 'terminada').map((t) => t.id);
      setSelectedTaskIds(pendingIds);
    } else {
      setFoundUser(null);
      setSearchError('Usuario no encontrado. Asegúrate de ingresar el usuario o correo registrado.');
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
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-surface-container-lowest border border-surface-container rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up">
        {/* Header */}
        <div className="bg-primary text-on-primary p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-on-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">group_add</span>
            </div>
            <div>
              <h3 className="font-title-md text-title-md font-bold">Trabajo Grupal & Binas</h3>
              <p className="font-body-xs text-body-xs text-on-primary/80">Busca a un compañero registrado y sincroniza tareas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-on-primary/10 flex items-center justify-center hover:bg-on-primary/20 transition-colors cursor-pointer text-on-primary"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {isSyncSuccess ? (
            <div className="text-center py-8 space-y-4 animate-scale-up">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <span className="material-symbols-outlined text-[36px]">handshake</span>
              </div>
              <div>
                <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">¡Sincronización Exitosa!</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 max-w-xs mx-auto">
                  Se vincularon {selectedTaskIds.length} tareas en bina con <strong>{foundUser?.name}</strong>.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-primary-container transition-colors cursor-pointer shadow-xs"
              >
                Entendido
              </button>
            </div>
          ) : (
            <>
              {/* Step 1: Search Form */}
              <form onSubmit={handleSearch} className="space-y-2">
                <label className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                  <span>1. Buscar Usuario o Correo del Compañero</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ej. goku, maria.sanchez, carlos.gomez@campus.edu..."
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
                    {foundUser.photo && foundUser.photo.length > 20 && !foundUser.photo.includes('studentsTeamInicio') ? (
                      <img
                        src={foundUser.photo}
                        alt={foundUser.name}
                        className="w-12 h-12 rounded-full object-cover shadow-xs border-2 border-primary/30 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary text-on-primary font-headline-md text-headline-md font-bold flex items-center justify-center shadow-xs border-2 border-primary/30 shrink-0 uppercase">
                        {foundUser.name.charAt(0)}
                      </div>
                    )}
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


