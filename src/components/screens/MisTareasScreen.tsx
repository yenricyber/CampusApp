import React from 'react';
import { StudentProfile, UserTask } from '../../types';

interface MisTareasScreenProps {
  student: StudentProfile;
  tasks: UserTask[];
}

export const MisTareasScreen: React.FC<MisTareasScreenProps> = ({ student, tasks }) => {
  // Filter tasks belonging to the current user (using matricula as usuario_id)
  const userTasks = tasks.filter(task => task.usuario_id === student.matricula);

  return (
    <div className="w-full flex flex-col pt-4 pb-24 px-4 min-h-screen bg-slate-100">
      {/* Personalized Header */}
      <div className="mb-6 mt-4">
        <h2 className="text-2xl font-bold text-primary">
          Hola, {student.name}
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Aquí tienes tus tareas pendientes
        </p>
      </div>

      {/* Tasks List */}
      <div className="flex flex-col gap-4">
        {userTasks.length > 0 ? (
          userTasks.map(task => (
            <div 
              key={task.id} 
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col gap-3 relative overflow-hidden"
            >
              {/* Top Row: Subject & Status Pill */}
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-secondary-container bg-primary/10 px-2 py-1 rounded-md max-w-[70%] truncate">
                  {task.materia}
                </span>
                
                {task.estado === 'pendiente' ? (
                  <span className="text-[10px] uppercase font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                    Pendiente
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                    Completada
                  </span>
                )}
              </div>

              {/* Middle: Task Title */}
              <h3 className="font-semibold text-on-surface text-lg leading-tight mt-1">
                {task.titulo}
              </h3>

              {/* Bottom: Due Date */}
              <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-2">
                <span className="material-symbols-rounded text-base">schedule</span>
                <span>Entrega: {task.fechaEntrega}</span>
              </div>
              
              {/* Decorative accent bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${task.estado === 'pendiente' ? 'bg-secondary' : 'bg-green-500'}`} />
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <span className="material-symbols-rounded text-3xl">task_alt</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-800">¡Todo al día!</h3>
            <p className="text-slate-500 text-sm mt-2 max-w-[200px]">
              No tienes tareas pendientes en este momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
