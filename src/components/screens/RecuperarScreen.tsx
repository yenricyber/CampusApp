import React, { useState } from 'react';
import { ScreenType } from '../../types';

interface RecuperarScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const RecuperarScreen: React.FC<RecuperarScreenProps> = ({ onNavigate }) => {
  const [institutionalId, setInstitutionalId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institutionalId.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 900);
  };

  return (
    <main className="flex flex-col relative w-full pt-16 pb-24 bg-surface min-h-screen justify-center">
      <div className="flex flex-col w-full px-margin-mobile md:px-space-2xl pb-space-3xl max-w-md mx-auto md:bg-surface-container-lowest md:py-8 md:rounded-2xl md:shadow-xl md:border md:border-surface-container md:my-8">
        {/* Top Bar Back Action */}
        <div className="flex items-center justify-between py-space-sm">
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="inline-flex items-center gap-space-xs text-primary font-label-md text-label-md py-space-2xs px-space-xs rounded-full bg-surface-container-low active:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Regresar al inicio</span>
          </button>
          <span className="inline-flex items-center gap-space-2xs text-outline text-label-sm font-label-sm">
            <span className="material-symbols-outlined text-[15px] text-tertiary-container">verified_user</span>
            Portal Seguro SSL 256-bit
          </span>
        </div>

        {/* Security Emblem / Delightful Badge */}
        <div className="flex flex-col items-center justify-center mt-space-md mb-space-lg">
          <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-surface-container-low shadow-[0_4px_16px_rgba(30,58,138,0.06)]">
            <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-surface-variant/40 to-transparent pointer-events-none"></div>

            {/* Ambient Orbit Circles (SVG) */}
            <svg className="absolute w-28 h-28 pointer-events-none" fill="none" viewBox="0 0 112 112">
              <circle
                className="text-primary/10"
                cx="56"
                cy="56"
                r="50"
                stroke="currentColor"
                strokeDasharray="4 4"
                strokeWidth="1.5"
              ></circle>
              <circle className="fill-secondary-container" cx="96" cy="36" r="3.5"></circle>
            </svg>

            {/* Key & Shield Icon Compound */}
            <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-[0_8px_20px_rgba(30,58,138,0.25)] transform transition-transform hover:scale-105 duration-200">
              <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                lock_reset
              </span>
            </div>

            {/* Micro badge institutional */}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-tertiary-container text-tertiary-fixed flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[18px]">shield</span>
            </div>
          </div>
        </div>

        {/* Header Text */}
        <div className="text-center px-space-xs mb-space-xl">
          <div className="inline-block px-space-sm py-space-2xs mb-space-xs rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
            Identidad Universitaria
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight mb-space-xs font-bold">
            Recuperar Contraseña
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Ingresa tu matrícula o correo institucional asociado a tu cuenta CampusApp. Te enviaremos un código de verificación seguro para restablecer tu acceso.
          </p>
        </div>

        {/* Main Recovery Form Card */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-[0_1px_3px_rgba(15,23,42,0.05)] mb-space-lg border border-surface-container">
          <form onSubmit={handleSubmit} className="flex flex-col gap-space-md" id="recovery-form">
            {/* Input Field */}
            <div className="flex flex-col gap-space-2xs text-left">
              <label
                className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between"
                htmlFor="institutional-id"
              >
                <span>Matrícula o Correo Institucional</span>
                <span className="text-outline font-label-sm text-label-sm">Requerido</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-space-md text-outline pointer-events-none text-[20px]">
                  badge
                </span>
                <input
                  id="institutional-id"
                  name="institutional-id"
                  type="text"
                  required
                  value={institutionalId}
                  onChange={(e) => setInstitutionalId(e.target.value)}
                  placeholder="ej. a01234567@institucion.edu.mx"
                  className="w-full h-12 pl-11 pr-space-md bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-all placeholder:text-outline/70"
                />
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant pl-space-2xs pt-space-2xs">
                Formatos válidos: Matrícula oficial (ej. A01234567) o dominio @institucion.edu.mx
              </p>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full h-12 mt-space-xs rounded-lg font-label-lg text-label-lg font-semibold flex items-center justify-center gap-space-xs shadow-[0_4px_12px_rgba(30,58,138,0.2)] active:bg-primary transition-all duration-150 cursor-pointer ${
                isSuccess
                  ? 'bg-tertiary-container text-tertiary-fixed'
                  : 'bg-primary-container text-on-primary'
              }`}
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                  <span>Enviando enlace seguro...</span>
                </>
              ) : isSuccess ? (
                <>
                  <span className="material-symbols-outlined text-[20px]">check</span>
                  <span>Código Enviado</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">send</span>
                  <span>Enviar Código de Recuperación</span>
                </>
              )}
            </button>
          </form>

          {/* Success Feedback Overlay */}
          {isSuccess && (
            <div className="mt-space-md p-space-md rounded-lg bg-surface-container-low animate-in fade-in duration-200">
              <div className="flex items-start gap-space-sm">
                <div className="w-8 h-8 rounded-full bg-tertiary-container text-tertiary-fixed flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">mark_email_read</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    Código Enviado Exitosamente
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">
                    Revisa tu bandeja institucional y carpeta de spam. El código expira en 15 minutos.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Alternative Methods Interactive Drawer/Card */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-[0_1px_3px_rgba(15,23,42,0.05)] mb-space-lg border border-surface-container">
          <div className="flex items-center gap-space-xs mb-space-sm text-secondary">
            <span className="material-symbols-outlined text-[20px]">help_outline</span>
            <h2 className="font-label-lg text-label-lg font-semibold">¿No recibiste el correo?</h2>
          </div>
          <div className="flex flex-col gap-space-xs">
            {/* Option SMS */}
            <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container active:scale-[0.99] transition-all cursor-pointer">
              <div className="flex items-center gap-space-sm">
                <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">sms</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    Verificar vía SMS Institucional
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Al número móvil vinculado (+52 ••• ••34)
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline text-[20px]">chevron_right</span>
            </div>

            {/* Option Servicios Escolares */}
            <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container active:scale-[0.99] transition-all cursor-pointer">
              <div className="flex items-center gap-space-sm">
                <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">meeting_room</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    Módulo de Servicios Escolares
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Restablecimiento presencial con ID físico
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline text-[20px]">chevron_right</span>
            </div>
          </div>
        </div>

        {/* IT Desk Support Info Card */}
        <div className="bg-surface-container-low rounded-xl p-space-md mb-space-xl">
          <div className="flex items-start gap-space-sm">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">support_agent</span>
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  Mesa de Ayuda TI y Cómputo
                </span>
                <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-full bg-surface-container-highest text-tertiary font-label-sm text-label-sm font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span>
                  En línea
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Edificio Central de Tecnologías, Campus Poniente.
              </p>
              <div className="mt-space-xs pt-space-xs flex flex-wrap items-center gap-x-space-md gap-y-1 text-outline font-label-sm text-label-sm">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">schedule</span>
                  Lun - Vie: 07:00 a 20:00 hrs
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">call</span>
                  Ext. 4090 / 4092
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Return to Login Anchor */}
        <div className="flex flex-col items-center justify-center gap-space-xs text-center">
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="inline-flex items-center gap-space-xs text-primary font-label-lg text-label-lg font-semibold hover:underline py-space-xs px-space-md rounded-lg active:bg-surface-container-low transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Volver a Iniciar Sesión</span>
          </button>
          <span className="font-label-sm text-label-sm text-outline">CampusApp Academic Platform © 2025</span>
        </div>
      </div>
    </main>
  );
};
