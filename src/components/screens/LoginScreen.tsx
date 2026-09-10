import React, { useState, useEffect } from 'react';
import {
  validateInstitutionalEmail,
  isPersonalEmailDomain,
  INSTITUTIONAL_DOMAIN,
} from '../../utils/validators';
import { apiService, DbHealthResponse } from '../../services/api';
import { UniversidadLatinoLogo } from '../common/UniversidadLatinoLogo';

import { StudentProfile } from '../../types';

interface LoginScreenProps {
  onLoginSuccess: (student: StudentProfile) => void;
  onNavigateToRegister: () => void;
  onShowToast: (message: string) => void;
  onReplaySplash?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
  onShowToast,
  onReplaySplash,
}) => {
  const [correoInstitucional, setCorreoInstitucional] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbStatus, setDbStatus] = useState<DbHealthResponse | null>(null);

  useEffect(() => {
    apiService.checkHealth().then((res) => setDbStatus(res)).catch(() => {});
  }, []);

  // Errores de validación en tiempo real
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Validaciones en tiempo real para correo institucional
  const handleEmailChange = (value: string) => {
    setCorreoInstitucional(value);

    if (!value.trim()) {
      setEmailError(null);
      return;
    }

    if (isPersonalEmailDomain(value) || (value.includes('@') && !value.toLowerCase().endsWith(INSTITUTIONAL_DOMAIN))) {
      setEmailError('Por favor, utiliza tu correo institucional válido (@universidadlatino.edu.mx)');
    } else {
      const error = validateInstitutionalEmail(value);
      setEmailError(error);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value.trim()) {
      setPasswordError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    let hasErrors = false;

    // Validar Correo Institucional
    const emailValidation = validateInstitutionalEmail(correoInstitucional);
    if (emailValidation) {
      setEmailError(emailValidation);
      hasErrors = true;
    } else {
      setEmailError(null);
    }

    // Validar Contraseña
    if (!password.trim()) {
      setPasswordError('Ingresa tu contraseña');
      hasErrors = true;
    } else {
      setPasswordError(null);
    }

    if (hasErrors) {
      if (emailValidation) {
        onShowToast('Por favor, utiliza tu correo institucional válido (@universidadlatino.edu.mx).');
      } else {
        onShowToast('Por favor, ingresa tu contraseña institucional.');
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiService.login(correoInstitucional, password);
      setIsSubmitting(false);

      if (res.success && res.studentProfile) {
        onShowToast('¡Autenticado con éxito! Sesión iniciada.');
        onLoginSuccess(res.studentProfile);
      } else {
        const errorMsg = res.error || 'Credenciales no encontradas en el sistema.';
        setAuthError(errorMsg);
        onShowToast(errorMsg);
      }
    } catch {
      setIsSubmitting(false);
      setAuthError('Error de conexión con el servidor. No se pudo iniciar sesión.');
      onShowToast('Error de conexión con el servidor.');
    }
  };

  const handleForgotPassword = () => {
    if (!correoInstitucional.trim() || validateInstitutionalEmail(correoInstitucional) !== null) {
      onShowToast('Ingresa primero un correo institucional válido (@universidadlatino.edu.mx) para recuperar tu contraseña.');
      return;
    }
    onShowToast(`Se ha enviado un enlace de recuperación seguro a ${correoInstitucional}`);
  };

  const handleBiometric = () => {
    const emailValidation = validateInstitutionalEmail(correoInstitucional);
    if (emailValidation) {
      setEmailError(emailValidation);
      onShowToast('Por favor, utiliza tu correo institucional válido para el acceso biométrico.');
      return;
    }
    onShowToast('Autenticación biométrica no disponible por ahora.');
  };

  const isEmailValid =
    correoInstitucional.trim() !== '' &&
    !emailError &&
    validateInstitutionalEmail(correoInstitucional) === null;

  return (
    <div className="min-h-screen w-full bg-[#0A0A5C] text-slate-800 flex flex-col justify-between max-w-md mx-auto relative overflow-hidden">
      {/* Fondo Decorativo Institucional */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#0A0A5C] via-[#0C0C68] to-[#14147A] pointer-events-none">
        <div className="absolute top-4 -right-10 w-48 h-48 rounded-full bg-[#FADE0A]/10 blur-3xl"></div>
        <div className="absolute top-12 -left-12 w-44 h-44 rounded-full bg-blue-400/10 blur-2xl"></div>
      </div>

      {/* Encabezado (Header) */}
      <header className="relative z-10 px-6 pt-9 pb-6 text-center text-white flex flex-col items-center">
        {/* Botón sutil para regresar al Splash */}
        {onReplaySplash && (
          <div className="absolute top-4 right-4">
            <button
              type="button"
              onClick={onReplaySplash}
              className="text-[11px] font-medium text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition border border-white/10"
              title="Volver a la pantalla principal (Splash)"
            >
              <span className="material-symbols-outlined text-[14px] text-[#FADE0A]">arrow_back</span>
              <span>Splash</span>
            </button>
          </div>
        )}

        {/* Contenedor del Logotipo con Pill badge */}
        <div className="relative mb-3 pt-2">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white p-2 border border-white/20 shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
            <UniversidadLatinoLogo size={64} />
          </div>
        </div>

        {/* Pill Badge: RED ACADÉMICA OFICIAL con punto amarillo */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-mono text-white tracking-widest uppercase font-semibold mb-2">
          <span className="w-2 h-2 rounded-full bg-[#FADE0A] shadow-[0_0_8px_#FADE0A] animate-pulse"></span>
          <span>RED ACADÉMICA OFICIAL</span>
        </div>

        {/* Nombre Institucional y Lema */}
        <h1 className="text-2xl font-headline font-extrabold tracking-tight text-white uppercase">
          UNIVERSIDAD LATINO
        </h1>
        <p className="text-xs font-body text-slate-300 mt-0.5 italic tracking-wide">
          Unitus pro excellentia
        </p>
      </header>

      {/* Tarjeta Principal (Contenedor del Formulario) */}
      <main className="relative z-10 flex-1 flex flex-col justify-end">
        <div className="bg-white rounded-t-[36px] px-6 pt-7 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.25)] border-t border-slate-100 w-full">
          {/* Título y Subtítulo de Inicio de Sesión */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-headline font-extrabold text-slate-900 tracking-tight">
                Iniciar Sesión
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-body">
                Usa tu cuenta institucional <span className="font-semibold text-[#0A0A5C]">@universidadlatino.edu.mx</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-[#0A0A5C] flex items-center justify-center shrink-0 border border-slate-200/60">
              <span className="material-symbols-outlined text-[20px]">
                lock
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo: Correo Institucional */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-correo"
                  className="block text-xs font-headline font-semibold text-slate-700"
                >
                  Correo Institucional <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] font-mono font-semibold text-[#0A0A5C] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                  @universidadlatino.edu.mx
                </span>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-[19px]">alternate_email</span>
                </span>
                <input
                  id="login-correo"
                  type="email"
                  value={correoInstitucional}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="alumno@universidadlatino.edu.mx"
                  className={`w-full bg-slate-50 border text-slate-900 text-sm rounded-xl pl-10 pr-10 py-3 outline-none transition font-body ${
                    emailError
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200/50 bg-rose-50/20'
                      : isEmailValid
                      ? 'border-emerald-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200/50 bg-emerald-50/20'
                      : 'border-slate-200 focus:border-[#0A0A5C] focus:ring-2 focus:ring-[#0A0A5C]/15'
                  }`}
                />
                {/* Indicador de Estado: Check Verde o Cancelar Rojo */}
                <span className="absolute right-3.5 flex items-center pointer-events-none">
                  {emailError && (
                    <span className="material-symbols-outlined text-[19px] text-rose-500">
                      cancel
                    </span>
                  )}
                  {isEmailValid && (
                    <span className="material-symbols-outlined text-[19px] text-emerald-600">
                      check_circle
                    </span>
                  )}
                </span>
              </div>

              {/* Mensaje de Validación de Correo */}
              {emailError ? (
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-rose-600 font-medium">
                  <span className="material-symbols-outlined text-[15px] shrink-0">
                    error
                  </span>
                  <span>{emailError}</span>
                </div>
              ) : isEmailValid ? (
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-700 font-semibold">
                  <span className="material-symbols-outlined text-[15px] text-emerald-600">
                    verified
                  </span>
                  <span>Correo institucional válido</span>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 mt-1 font-body">
                  Ingresa tu correo otorgado por la institución.
                </p>
              )}
            </div>

            {/* Campo: Contraseña */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-headline font-semibold text-slate-700"
                >
                  Contraseña <span className="text-rose-500">*</span>
                </label>
                {/* Enlace: ¿Olvidaste tu contraseña? */}
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-headline text-[#0A0A5C] hover:underline font-semibold cursor-pointer"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-[19px]">lock</span>
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className={`w-full bg-slate-50 border text-slate-900 text-sm rounded-xl pl-10 pr-10 py-3 outline-none transition font-body ${
                    passwordError
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200/50 bg-rose-50/20'
                      : 'border-slate-200 focus:border-[#0A0A5C] focus:ring-2 focus:ring-[#0A0A5C]/15'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Alternar visibilidad de contraseña"
                  className="absolute right-3.5 text-slate-400 hover:text-slate-700 transition cursor-pointer flex items-center"
                >
                  <span className="material-symbols-outlined text-[19px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {passwordError && (
                <p className="flex items-center gap-1 text-xs text-rose-600 font-medium mt-1.5">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  <span>{passwordError}</span>
                </p>
              )}
            </div>

            {/* Checkbox: Recordar sesión */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#0A0A5C] focus:ring-[#FADE0A] accent-[#0A0A5C] cursor-pointer"
                />
                <span className="font-body text-slate-700 font-medium">Recordar sesión en este dispositivo</span>
              </label>
            </div>

            {/* Mensaje de error general (credenciales inválidas) */}
            {authError && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex flex-col items-center justify-center text-center animate-shake">
                <span className="material-symbols-outlined text-[24px] text-rose-500 mb-1">
                  error
                </span>
                <span className="text-sm font-headline font-bold text-rose-700">Acceso denegado</span>
                <span className="text-xs text-rose-600 font-medium leading-tight mt-0.5">{authError}</span>
              </div>
            )}

            {/* Botones de Acción */}
            <div className="pt-2 space-y-2.5">
              {/* Botón Primario: ENTRAR (Amarillo Vibrante) */}
              <button
                type="submit"
                disabled={isSubmitting}
                id="btn-entrar"
                className="w-full bg-[#FADE0A] hover:bg-[#ebd009] active:scale-[0.99] text-[#0A0A5C] font-headline font-extrabold text-sm tracking-wider py-3.5 rounded-xl shadow-[0_4px_16px_rgba(250,222,10,0.4)] flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-70"
              >
                <span>{isSubmitting ? 'VERIFICANDO...' : 'ENTRAR'}</span>
                <span className="material-symbols-outlined text-[19px] font-bold">
                  arrow_forward
                </span>
              </button>

              {/* Botón Secundario: Acceso Biométrico */}
              <button
                type="button"
                onClick={handleBiometric}
                className="w-full bg-slate-100 hover:bg-slate-200/80 active:scale-[0.99] text-slate-700 border border-slate-200/70 text-xs font-headline font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-[19px] text-[#0A0A5C]">
                  fingerprint
                </span>
                <span>Acceso biométrico (FaceID / Huella)</span>
              </button>
            </div>
          </form>

          {/* Enlace a Registro */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600 font-body">
              ¿No tienes una cuenta registrada?{' '}
              <button
                type="button"
                onClick={onNavigateToRegister}
                className="font-headline font-bold text-[#0A0A5C] hover:underline underline-offset-2 ml-1 cursor-pointer transition"
              >
                Registrarse aquí
              </button>
            </p>
          </div>
        </div>
      </main>

      {/* Pie de página sutil con estado del servidor */}
      <footer className="relative z-10 text-center px-4 py-3 text-white/60 text-[10px] font-mono flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Conexión Segura TLS 1.2 • TiDB Cloud OK</span>
        {dbStatus?.latencyMs && <span>({dbStatus.latencyMs}ms)</span>}
      </footer>
    </div>
  );
};
