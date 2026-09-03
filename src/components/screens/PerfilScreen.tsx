import React, { useState } from 'react';
import { UserProfile, ScreenType } from '../../types';
import { ASSETS } from '../../data/mockData';

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

  const handleDeleteAccount = async () => {
    if (confirm('¿Estás seguro de que deseas eliminar tu cuenta permanentemente? Todos tus datos serán borrados y esta acción no se puede deshacer.')) {
      setIsDeleting(true);
      try {
        const res = await fetch(`/api/users/${currentUser.studentId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          alert('Cuenta eliminada con éxito.');
          onLogout();
        } else {
          const data = await res.json();
          alert(`Error al eliminar: ${data.error}`);
        }
      } catch (err) {
        alert('Error de conexión al intentar eliminar la cuenta.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <main className="flex flex-col relative w-full pt-16 pb-24 bg-surface min-h-screen">
      <div className="flex flex-col w-full px-margin-mobile pt-space-md max-w-md mx-auto gap-space-lg">
        
        {/* Profile Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-xs p-space-lg flex flex-col items-center gap-space-md">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary-container shadow-md">
            <img
              src={currentUser.avatarUrl || ASSETS.userAvatar}
              alt="Avatar de usuario"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              {currentUser.name}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {currentUser.studentId}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="px-3 py-1 bg-primary-container text-on-primary-container rounded-full font-label-sm text-label-sm font-semibold">
              {currentUser.program}
            </span>
            <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full font-label-sm text-label-sm font-semibold">
              {currentUser.semester}
            </span>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-surface-container-lowest rounded-xl shadow-xs p-space-lg flex flex-col gap-space-sm">
          <h3 className="font-label-lg text-label-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">lock</span>
            Seguridad y Acceso
          </h3>
          <div className="h-[1px] bg-surface-container w-full my-1"></div>
          <div className="flex flex-col gap-1">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Contraseña</span>
            <div className="flex items-center justify-between bg-surface-container-low px-3 py-2 rounded-lg">
              <span className="font-body-md text-body-md tracking-[0.2em] text-on-surface">
                ••••••••
              </span>
              <button type="button" className="text-primary font-label-sm font-semibold hover:underline">
                Cambiar
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-space-md mt-space-sm">
          <button
            type="button"
            onClick={() => { if (confirm('¿Deseas cerrar sesión?')) onLogout(); }}
            className="w-full h-12 bg-surface-container hover:bg-surface-container-high rounded-xl text-on-surface font-label-lg font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Cerrar Sesión
          </button>
          
          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="w-full h-12 border-2 border-error text-error hover:bg-error hover:text-white rounded-xl font-label-lg font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">delete_forever</span>
            {isDeleting ? 'Eliminando...' : 'Eliminar Cuenta Permanentemente'}
          </button>
        </div>

      </div>
    </main>
  );
};
