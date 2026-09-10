import React, { useState } from 'react';
import { UserProfile, ScreenType } from '../../types';
import { apiService } from '../../services/api';

interface PerfilScreenProps {
  currentUser: UserProfile;
  onNavigate: (screen: ScreenType) => void;
  onLogout: () => void;
}

export const PerfilScreen: React.FC<PerfilScreenProps> = ({
  currentUser,
  onNavigate,
  onLogout
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await apiService.deleteAccount(currentUser.matricula);
      if (res.success) {
        apiService.logout();
        onLogout();
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
    <main className="flex flex-col relative w-full pt-16 pb-24 bg-surface min-h-screen">
      <div className="flex flex-col w-full px-4 pt-6 max-w-md mx-auto gap-5">
        
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center gap-4 border border-slate-100">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-[#0A0A5C]/20 shadow-md bg-[#0A0A5C] flex items-center justify-center">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt="Avatar de usuario"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full text-white font-bold text-[36px] flex items-center justify-center uppercase select-none">
                {currentUser.name ? currentUser.name.charAt(0) : <span className="material-symbols-outlined text-[48px]">person</span>}
              </div>
            )}
          </div>
          <div className="text-center">
            <h2 className="text-lg font-bold text-slate-900">
              {currentUser.name}
            </h2>
            <p className="text-sm text-slate-500 font-mono">
              {currentUser.matricula}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentUser.email}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="px-3 py-1 bg-[#0A0A5C]/10 text-[#0A0A5C] rounded-full text-xs font-semibold">
              {currentUser.career}
            </span>
            <span className="px-3 py-1 bg-[#FADE0A]/20 text-[#0A0A5C] rounded-full text-xs font-semibold">
              {currentUser.semester}
            </span>
          </div>
        </div>

        {/* Academic Info */}
        <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-[20px] text-[#0A0A5C]">school</span>
            Información Académica
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-slate-50 rounded-xl">
              <p className="text-lg font-bold text-[#0A0A5C] font-mono">{Number(currentUser.gpa || 0).toFixed(2)}</p>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Promedio</p>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-xl">
              <p className="text-lg font-bold text-[#0A0A5C] font-mono">{currentUser.credits?.earned ?? 0}</p>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Créditos</p>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-xl">
              <p className="text-lg font-bold text-[#0A0A5C] font-mono">{currentUser.attendance}%</p>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Asistencia</p>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-[20px] text-[#0A0A5C]">lock</span>
            Seguridad y Acceso
          </h3>
          <div className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-xl">
            <div>
              <span className="text-xs text-slate-500">Contraseña</span>
              <p className="font-mono tracking-[0.2em] text-slate-800">••••••••</p>
            </div>
            <button type="button" className="text-[#0A0A5C] text-xs font-bold hover:underline">
              Cambiar
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-1">
          <button
            type="button"
            onClick={() => { if (confirm('¿Deseas cerrar sesión?')) onLogout(); }}
            className="w-full h-12 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Cerrar Sesión
          </button>
          
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full h-12 border-2 border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">delete_forever</span>
            Eliminar Cuenta Permanentemente
          </button>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
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
        </div>
      )}
    </main>
  );
};
