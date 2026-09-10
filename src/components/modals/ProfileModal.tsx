import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { apiService } from '../../services/api';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  onLogout: () => void;
  onOpenCredencial: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  student,
  onLogout,
  onOpenCredencial,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await apiService.deleteAccount(student.matricula);
      if (res.success) {
        apiService.logout();
        onLogout();
        onClose();
      } else {
        alert(`Error al eliminar: ${res.error}`);
      }
    } catch (err) {
      alert('Error de conexión al intentar eliminar la cuenta.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl border border-slate-200 flex flex-col gap-4">
        {showDeleteConfirm ? (
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-rose-600 text-[28px]">warning</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Eliminar cuenta</h3>
                <p className="text-xs text-slate-500">Esta acción es irreversible</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-5">
              Se eliminarán permanentemente todos tus datos, incluyendo tu perfil, tareas y entregas. 
              <span className="font-bold text-rose-600"> No se puede deshacer.</span>
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 h-11 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-bold text-sm transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 h-11 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Eliminando...
                  </>
                ) : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-headline text-[16px] font-bold text-slate-900">
                Perfil Estudiantil
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <img
                src={student.avatarUrl}
                alt={student.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-primary-container"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-headline text-[15px] font-bold text-slate-900 truncate">
                  {student.name}
                </h4>
                <p className="font-body text-[11px] text-slate-500 truncate">{student.career}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="font-mono text-[10px] text-primary-container font-bold bg-primary-container/10 px-2 py-0.5 rounded inline-block">
                    Matrícula: {student.matricula}
                  </span>
                  {student.email && (
                    <span className="font-mono text-[10px] text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded inline-block border border-emerald-200/60">
                      {student.email}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-body text-slate-700">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Semestre Cursando:</span>
                <span className="font-mono font-bold text-slate-800">{student.semester}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Promedio General Ponderado:</span>
                <span className="font-mono font-bold text-emerald-700">{Number(student.gpa || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Créditos Acumulados:</span>
                <span className="font-mono font-bold text-slate-800">{student.credits?.earned || 0} / {student.credits?.total || 0}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Seguro Facultativo:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Vigente IMSS
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  onOpenCredencial();
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-primary-container text-secondary-container font-headline text-xs font-bold flex items-center justify-center gap-2 hover:bg-black transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">badge</span>
                <span>Ver Credencial Digital</span>
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-headline text-xs font-bold flex items-center justify-center gap-2 hover:bg-rose-100 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                <span>Eliminar Cuenta</span>
              </button>

              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-headline text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
