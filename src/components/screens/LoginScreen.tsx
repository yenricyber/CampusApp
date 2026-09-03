import React, { useState } from 'react';
import { ScreenType } from '../../types';
import { ASSETS } from '../../data/mockData';

interface LoginScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate, onLoginSuccess }) => {
  const [studentId, setStudentId] = useState('al220914@universidad.edu.mx');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
      onNavigate('inicio');
    }, 600);
  };

  const handleBiometric = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
      onNavigate('inicio');
    }, 500);
  };

  return (
    <main className="flex flex-col relative w-full pt-16 pb-24 bg-surface min-h-screen">
      <div className="flex flex-col w-full px-margin-mobile pb-space-2xl max-w-md mx-auto pt-2">
        {/* Brand and Title Header */}
        <div className="flex flex-col items-center text-center mt-space-md mb-space-xl">
          <div className="relative w-20 h-20 rounded-xl bg-surface-container shadow-md flex items-center justify-center p-space-xs mb-space-md">
            <img
              alt="UniTask Brand Logo"
              className="w-full h-full object-contain rounded-lg"
              src={ASSETS.logo}
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-tertiary-container rounded-full flex items-center justify-center shadow-xs">
              <span
                className="material-symbols-outlined text-[10px] text-on-tertiary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
          </div>
          <span className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider mb-space-2xs bg-secondary-fixed/50 px-space-xs py-0.5 rounded-full">
            Acceso Seguro
          </span>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
            Portal Estudiantil de Tareas
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-2xs max-w-xs">
            Ingresa con tu correo institucional o matrícula
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-md p-space-lg flex flex-col gap-space-lg border border-surface-container">
          <form onSubmit={handleLogin} className="flex flex-col gap-space-md" id="loginForm">
            {/* Matrícula o Correo Institucional */}
            <div className="flex flex-col gap-space-2xs">
              <label
                className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-space-2xs"
                htmlFor="studentId"
              >
                <span>Matrícula o Correo Institucional</span>
                <span className="text-error">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-[20px] text-outline absolute left-space-md pointer-events-none">
                  badge
                </span>
                <input
                  id="studentId"
                  name="studentId"
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="ej. a01234567@institucion.edu.mx"
                  className="w-full h-12 pl-11 pr-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-colors shadow-xs"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="flex flex-col gap-space-2xs">
              <div className="flex items-center justify-between">
                <label
                  className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-space-2xs"
                  htmlFor="password"
                >
                  <span>Contraseña</span>
                  <span className="text-error">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('recuperar')}
                  className="font-label-sm text-label-sm text-primary hover:underline transition-all cursor-pointer"
                >
                  ¿Olvidaste tu contraseña? Restablecer aquí
                </button>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-[20px] text-outline absolute left-space-md pointer-events-none">
                  lock
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-12 pl-11 pr-12 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-colors shadow-xs"
                />
                <button
                  type="button"
                  aria-label="Mostrar u ocultar contraseña"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center text-outline hover:text-on-surface transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-space-xs mt-space-2xs">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer"
              />
              <label htmlFor="rememberMe" className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer select-none">
                Recordar mi sesión en este dispositivo institucional
              </label>
            </div>

            {/* Submit Button */}
            <button
              id="submitBtn"
              type="submit"
              disabled={isLoading}
              className="relative overflow-hidden w-full h-12 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg shadow-md flex items-center justify-center gap-space-xs mt-space-xs active:bg-primary-container transition-all cursor-pointer font-semibold"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-space-md my-space-2xs">
            <div className="h-px bg-surface-variant flex-1"></div>
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">o ingresa con</span>
            <div className="h-px bg-surface-variant flex-1"></div>
          </div>

          {/* Biometric Auth Button */}
          <button
            type="button"
            onClick={handleBiometric}
            className="w-full h-12 rounded-lg bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-lg text-label-lg shadow-xs flex items-center justify-center gap-space-sm active:scale-[0.99] transition-all font-semibold cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-[22px] text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              fingerprint
            </span>
            <span>Ingresar con Face ID / Huella</span>
          </button>
        </div>

        {/* Switch to Register link */}
        <div className="text-center mt-4">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            ¿No tienes cuenta todavía?{' '}
            <button
              type="button"
              onClick={() => onNavigate('registro')}
              className="font-semibold text-primary hover:underline cursor-pointer"
            >
              Crea tu Cuenta Estudiantil
            </button>
          </p>
        </div>

        {/* Institutional SSL Banner */}
        <div className="mt-space-lg flex flex-col items-center gap-space-xs text-center px-space-md">
          <div className="flex items-center gap-space-2xs text-on-tertiary-container bg-tertiary-container/10 px-space-sm py-1 rounded-full">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span className="font-label-sm text-label-sm font-semibold">
              Conexión segura SSL - Sistema compatible con Android e iOS
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-outline mt-space-2xs">
            Protección de identidad y privacidad de datos estudiantiles bajo normativa universitaria vigente.
          </p>
        </div>
      </div>
    </main>
  );
};
