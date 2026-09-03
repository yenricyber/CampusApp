import React, { useState, useEffect } from 'react';
import { AcademicTask } from '../types';

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

// Fallback real registered classmates from database
const DEFAULT_CLASSMATES: ClassmateUser[] = [
  {
    username: 'alex@universidad.edu.mx',
    name: 'Alexander Ramírez Soberanes',
    program: 'Ingeniería en Sistemas Computacionales',
    campus: '10º Cuatrimestre',
    photo: '',
  },
  {
    username: 'david.may@alumno.universidadlatino.edu.mx',
    name: 'David May',
    program: 'Ingeniería en Sistemas Computacionales',
    campus: '10º Cuatrimestre',
    photo: '',
  },
  {
    username: 'juan@universidadlatino.edu.mx',
    name: 'Juan Pérez',
    program: 'Mercadotecnia Global',
    campus: '3º Semestre',
    photo: '',
  },
  {
    username: 'Goku@universidadlatino.edu.mx',
    name: 'Goku',
    program: 'Derecho',
    campus: '3º Semestre',
    photo: '',
  },
  {
    username: 'yenri.moo@universidadlatino.edu.mx',
    name: 'Yenri Efrén Moo May',
    program: 'Ingeniería en Sistemas Computacionales',
    campus: '10º Cuatrimestre',
    photo: '',
  },
];

export const TrabajoGrupalModal: React.FC<TrabajoGrupalModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onUpdateTask,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [availableClassmates, setAvailableClassmates] = useState<ClassmateUser[]>(DEFAULT_CLASSMATES);
  const [selectedTeam, setSelectedTeam] = useState<ClassmateUser[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [isSyncSuccess, setIsSyncSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Cargar lista de compañeros registrados desde la base de datos
      fetch('/api/users/search?q=')
        .then((res) => res.json())
        .then((dbUsers) => {
          if (Array.isArray(dbUsers) && dbUsers.length > 0) {
            const formatted: ClassmateUser[] = dbUsers.map((u: any) => {
              let cleanName = u.name;
              if (!cleanName || cleanName.includes('@')) {
                const part = (cleanName || u.studentId).split('@')[0].replace(/[._]/g, ' ');
                cleanName = part
                  .split(' ')
                  .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(' ');
              }
              return {
                username: u.studentId,
                name: cleanName,
                program: u.program || 'Carrera Académica',
                campus: u.semester || 'Campus Principal',
                photo: u.avatarUrl || '',
              };
            });
            setAvailableClassmates(formatted);
          }
        })
        .catch(() => {});

      const pendingIds = tasks.filter((t) => t.status !== 'terminada').map((t) => t.id);
      setSelectedTaskIds(pendingIds);
    }
  }, [isOpen, tasks]);

  if (!isOpen) return null;

  const handleAddMember = (user: ClassmateUser) => {
    if (!selectedTeam.some((member) => member.username.toLowerCase() === user.username.toLowerCase())) {
      setSelectedTeam((prev) => [...prev, user]);
    }
    setSearchError(null);
  };

  const handleRemoveMember = (username: string) => {
    setSelectedTeam((prev) => prev.filter((m) => m.username.toLowerCase() !== username.toLowerCase()));
  };

  const handleAddAllClassmates = () => {
    setSelectedTeam(availableClassmates);
    setSearchError(null);
  };

  const handleClearTeam = () => {
    setSelectedTeam([]);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    const queryClean = searchQuery.trim().toLowerCase();

    if (!queryClean) {
      setSearchError('Por favor ingresa el usuario, nombre o correo del compañero.');
      return;
    }

    const found = availableClassmates.find(
      (u) =>
        u.username.toLowerCase().includes(queryClean) ||
        u.name.toLowerCase().includes(queryClean) ||
        queryClean.includes(u.username.split('@')[0].toLowerCase())
    );

    if (found) {
      handleAddMember(found);
      setSearchQuery('');
    } else {
      setSearchError('Compañero no encontrado en la base de datos real.');
    }
  };

  const toggleTaskSelection = (taskId: string) => {
    if (selectedTaskIds.includes(taskId)) {
      setSelectedTaskIds(selectedTaskIds.filter((id) => id !== taskId));
    } else {
      setSelectedTaskIds([...selectedTaskIds, taskId]);
    }
  };

  const handleReset = () => {
    setIsSyncSuccess(false);
    setSelectedTeam([]);
    setSearchQuery('');
    setSearchError(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleConfirmSync = () => {
    if (selectedTeam.length === 0 || selectedTaskIds.length === 0) return;

    const partnerNames = selectedTeam.map((m) => m.name).join(', ');
    const partnerIds = selectedTeam.map((m) => m.username).join(', ');
    const allCollaborators = Array.from(
      new Set(selectedTeam.flatMap((m) => [m.name, m.username]))
    );

    selectedTaskIds.forEach((id) => {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        const updated: AcademicTask = {
          ...task,
          partnerId: partnerIds,
          partnerName: partnerNames,
          partnerPhoto: selectedTeam[0]?.photo || '',
          collaborators: allCollaborators,
        };
        onUpdateTask(updated);
      }
    });

    setIsSyncSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in" onClick={handleClose}>
      <div className="bg-surface-container-lowest border border-surface-container rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-primary text-on-primary p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-on-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">groups</span>
            </div>
            <div>
              <h3 className="font-title-md text-title-md font-bold">Trabajo Grupal & Equipos</h3>
              <p className="font-body-xs text-body-xs text-on-primary/80">Selecciona o agrega a tu equipo completo para sincronizar tareas</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-on-primary/10 flex items-center justify-center hover:bg-on-primary/20 transition-colors cursor-pointer text-on-primary"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {isSyncSuccess ? (
            <div className="text-center py-8 space-y-4 animate-scale-up flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <span className="material-symbols-outlined text-[36px]">groups_3</span>
              </div>
              <div>
                <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">¡Equipo Sincronizado!</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 max-w-sm mx-auto">
                  Se vincularon <strong>{selectedTaskIds.length} {selectedTaskIds.length === 1 ? 'tarea' : 'tareas'}</strong> con el equipo completo (<strong>{selectedTeam.length} integrantes</strong>).
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center mt-3 max-w-md mx-auto">
                  {selectedTeam.map((m) => (
                    <span key={m.username} className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 font-label-xs text-label-xs font-bold border border-emerald-500/20">
                      ✓ {m.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-primary-container transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">group_add</span>
                  <span>Sincronizar otro equipo / tareas</span>
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  Entendido / Finalizar
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Option 1: Quick Button to Add ALL Team Members at once */}
              <div className="bg-primary-container/20 border border-primary/20 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-[22px]">group_add</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-label-lg text-label-lg font-bold text-on-surface truncate">
                      ¿Agregar a TODO el equipo?
                    </h4>
                    <p className="font-body-xs text-body-xs text-on-surface-variant truncate">
                      Selecciona a los {availableClassmates.length} compañeros registrados
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddAllClassmates}
                  className="px-3.5 py-2 rounded-xl bg-primary text-on-primary font-label-sm text-label-sm font-bold shadow-xs hover:bg-primary-container transition-all cursor-pointer shrink-0 flex items-center gap-1.5 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">select_all</span>
                  <span>Agregar Todo el Equipo</span>
                </button>
              </div>

              {/* Search or Quick Toggle Classmates */}
              <div className="space-y-3">
                <label className="font-label-md text-label-md font-bold text-on-surface flex items-center justify-between">
                  <span>1. Seleccionar o Buscar Integrantes ({selectedTeam.length} seleccionados)</span>
                  {selectedTeam.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearTeam}
                      className="font-label-xs text-label-xs text-error font-semibold hover:underline"
                    >
                      Limpiar selección
                    </button>
                  )}
                </label>

                {/* Quick Toggle Chips of Available Classmates */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {availableClassmates.map((c) => {
                    const isSelected = selectedTeam.some((m) => m.username.toLowerCase() === c.username.toLowerCase());
                    return (
                      <button
                        key={c.username}
                        type="button"
                        onClick={() => (isSelected ? handleRemoveMember(c.username) : handleAddMember(c))}
                        className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs border ${
                          isSelected
                            ? 'bg-primary text-on-primary border-primary shadow-sm font-bold scale-[1.02]'
                            : 'bg-surface-container-low text-on-surface-variant border-surface-container hover:border-primary/40 hover:bg-surface-container'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {isSelected ? 'check_circle' : 'add_circle'}
                        </span>
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Manual Search Bar */}
                <form onSubmit={handleSearch} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar otro compañero por nombre o correo..."
                    className="flex-1 h-11 px-3.5 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <button
                    type="submit"
                    className="px-4 h-11 rounded-xl bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary font-label-md text-label-md font-semibold flex items-center gap-1 transition-all cursor-pointer shrink-0"
                  >
                    <span className="material-symbols-outlined text-[18px]">search</span>
                    <span>Buscar</span>
                  </button>
                </form>
                {searchError && (
                  <p className="font-body-xs text-body-xs text-error font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    <span>{searchError}</span>
                  </p>
                )}
              </div>

              {/* Selected Team Members Card */}
              {selectedTeam.length > 0 && (
                <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h5 className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[18px]">groups</span>
                      <span>Equipo Configurado ({selectedTeam.length} integrantes)</span>
                    </h5>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTeam.map((m) => (
                      <div
                        key={m.username}
                        className="px-3 py-1.5 rounded-xl bg-surface-container-lowest border border-surface-container text-on-surface flex items-center gap-2 shadow-2xs"
                      >
                        <div className="w-5 h-5 rounded-full bg-primary text-on-primary font-label-xs text-[10px] font-bold flex items-center justify-center uppercase">
                          {m.name.charAt(0)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-label-sm text-label-sm font-bold truncate leading-tight">{m.name}</span>
                          <span className="font-body-xs text-[10px] text-on-surface-variant truncate">{m.username}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(m.username)}
                          className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-error/10 text-outline hover:text-error transition-colors"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Task Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-surface-container">
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

              {/* Primary Sync Button */}
              <button
                type="button"
                onClick={handleConfirmSync}
                disabled={selectedTeam.length === 0 || selectedTaskIds.length === 0}
                className={`w-full py-3.5 rounded-xl font-label-md text-label-md font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                  selectedTeam.length > 0 && selectedTaskIds.length > 0
                    ? 'bg-primary text-on-primary hover:bg-primary-container active:scale-98'
                    : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">sync</span>
                <span>
                  Sincronizar {selectedTaskIds.length} {selectedTaskIds.length === 1 ? 'Tarea' : 'Tareas'} con{' '}
                  {selectedTeam.length === 0
                    ? 'el Equipo'
                    : `${selectedTeam.length} ${selectedTeam.length === 1 ? 'Integrante' : 'Integrantes del Equipo'}`}
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
