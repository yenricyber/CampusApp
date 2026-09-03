import React, { useState } from 'react';
import { ScreenType } from '../../types';
import { ASSETS } from '../../data/mockData';

import { UserProfile } from '../../types';

interface RegistroScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const RegistroScreen: React.FC<RegistroScreenProps> = ({ onNavigate, onLoginSuccess }) => {
  const [studentId, setStudentId] = useState('');
  const [fullName, setFullName] = useState('');
  const [career, setCareer] = useState('');
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const hasEdu = studentId.includes('@') && studentId.includes('.edu');
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms || !passwordsMatch) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          password,
          name: fullName,
          program: career,
          semester: `${selectedSemester}º Semestre`,
          avatarUrl: avatarBase64 || ASSETS.userAvatar
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMessage(true);
        setTimeout(() => {
          onLoginSuccess(data.user);
          onNavigate('inicio');
        }, 1200);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col relative w-full pt-16 pb-24 bg-surface min-h-screen">
      <div className="flex flex-col w-full px-margin-mobile pb-space-3xl max-w-md mx-auto">
        {/* Academic Welcome Hero / Header Card */}
        <div className="relative overflow-hidden bg-primary-container text-on-primary rounded-xl p-space-lg shadow-md mt-space-sm mb-space-lg">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-surface-variant/10 pointer-events-none blur-xl"></div>
          <div className="absolute top-2 right-4 text-on-primary/10 select-none pointer-events-none">
            <span className="material-symbols-outlined text-[88px]">school</span>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-space-2xs px-space-xs py-1 rounded-full bg-on-primary/15 text-on-primary font-label-sm text-label-sm mb-space-xs uppercase tracking-wider backdrop-blur-xs font-semibold">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <span>Portal Académico Oficial</span>
            </div>
            <h1 className="font-headline-xl-mobile text-headline-xl-mobile font-bold tracking-tight text-on-primary">
              Crea tu Cuenta Estudiantil
            </h1>
            <p className="font-body-md text-body-md text-on-primary/85 mt-space-2xs max-w-[280px]">
              Registra tu perfil para sincronizar materias, avisos y entregas del ciclo escolar.
            </p>
          </div>

          {/* Student Community Visual Strip */}
          <div className="relative z-10 mt-space-md pt-space-sm border-t border-on-primary/10 flex items-center justify-between">
            <div className="flex -space-x-2 overflow-hidden">
              <img
                alt="Estudiante"
                className="inline-block h-7 w-7 rounded-full ring-2 ring-primary-container object-cover"
                src={ASSETS.studentThumb1}
              />
              <img
                alt="Estudiante"
                className="inline-block h-7 w-7 rounded-full ring-2 ring-primary-container object-cover"
                src={ASSETS.studentThumb2}
              />
              <img
                alt="Estudiante"
                className="inline-block h-7 w-7 rounded-full ring-2 ring-primary-container object-cover"
                src={ASSETS.studentThumb3}
              />
            </div>
            <span className="font-label-sm text-label-sm text-on-primary/90 font-medium">+14,500 estudiantes activos</span>
          </div>
        </div>

        {/* Registration Form Card Container */}
        <div className="bg-surface-container-lowest rounded-xl shadow-xs p-space-lg flex flex-col gap-space-lg">
          {/* Step Counter / Friendly Progress */}
          <div className="flex items-center justify-between bg-surface-container-low px-space-sm py-space-xs rounded-lg">
            <div className="flex items-center gap-space-xs">
              <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-sm text-label-sm font-bold">
                1
              </div>
              <span className="font-label-md text-label-md text-on-surface font-semibold">Datos Institucionales</span>
            </div>
            <span className="font-label-sm text-label-sm text-outline">Paso 1 de 2</span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-space-lg" id="registerForm">
            {/* Foto de Perfil */}
            <div className="flex flex-col items-center gap-space-sm">
              <label className="relative cursor-pointer group">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-surface-container-low ring-2 ring-primary/20 flex items-center justify-center relative">
                  {avatarBase64 ? (
                    <img src={avatarBase64} alt="Avatar preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-[40px] text-outline group-hover:text-primary transition-colors">
                      add_a_photo
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white text-[24px]">
                      edit
                    </span>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Sube tu foto de perfil (Opcional)
              </span>
            </div>

            {/* 1. Matrícula o Correo Institucional */}
            <div className="flex flex-col gap-space-2xs">
              <label
                className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between"
                htmlFor="studentId"
              >
                <span>Matrícula o Correo Institucional</span>
                <span className="font-label-sm text-label-sm text-outline">Dominio .edu.mx</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-space-sm text-outline pointer-events-none text-[20px]">
                  badge
                </span>
                <input
                  id="studentId"
                  name="studentId"
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="ej. al220914@universidad.edu.mx"
                  className="w-full h-12 pl-10 pr-10 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                />
                <span
                  className={`material-symbols-outlined absolute right-space-sm text-tertiary-fixed-variant transition-opacity text-[20px] ${
                    hasEdu ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-on-surface-variant font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[15px] text-outline">info</span>
                <span>Se validará con los registros del campus escolar.</span>
              </div>
            </div>

            {/* 2. Nombre Completo */}
            <div className="flex flex-col gap-space-2xs">
              <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="fullName">
                Nombre Completo
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-space-sm text-outline pointer-events-none text-[20px]">
                  person
                </span>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nombre(s) y Apellidos"
                  className="w-full h-12 pl-10 pr-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>

            {/* 3. Carrera / Licenciatura */}
            <div className="flex flex-col gap-space-2xs">
              <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="careerSelect">
                Carrera o Licenciatura
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-space-sm text-outline pointer-events-none text-[20px]">
                  school
                </span>
                <select
                  id="careerSelect"
                  name="career"
                  value={career}
                  onChange={(e) => setCareer(e.target.value)}
                  className="w-full h-12 pl-10 pr-10 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary appearance-none transition-all cursor-pointer"
                >
                  <option value="">Selecciona tu programa académico</option>
                  <option value="Derecho (RVOE 1275)">Derecho (RVOE 1275)</option>
                  <option value="Enfermería (RVOE 2048)">Enfermería (RVOE 2048)</option>
                  <option value="Gastronomía (RVOE 1507)">Gastronomía (RVOE 1507)</option>
                  <option value="Nutrición (RVOE 1155)">Nutrición (RVOE 1155)</option>
                  <option value="Psicología (RVOE 994)">Psicología (RVOE 994)</option>
                  <option value="Negocios Internacionales (RVOE 809)">Negocios Internacionales (RVOE 809)</option>
                  <option value="Ventas y Mercadotecnia (RVOE 1828)">Ventas y Mercadotecnia (RVOE 1828)</option>
                  <option value="Ingeniería en Sistemas Computacionales">Ingeniería en Sistemas Computacionales</option>
                  <option value="Mercadotecnia Global">Mercadotecnia Global</option>
                </select>
                <span className="material-symbols-outlined absolute right-space-sm text-outline pointer-events-none text-[20px]">
                  arrow_drop_down
                </span>
              </div>
            </div>

            {/* 4. Semestre / Grado Actual */}
            <div className="flex flex-col gap-space-2xs">
              <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between">
                <span>Semestre Actual</span>
                <span className="font-label-sm text-label-sm text-primary font-bold">
                  {selectedSemester}º Semestre
                </span>
              </label>
              <div className="flex items-center gap-space-xs overflow-x-auto py-1 no-scrollbar -mx-1 px-1">
                {semesters.map((sem) => (
                  <button
                    key={sem}
                    type="button"
                    onClick={() => setSelectedSemester(sem)}
                    className={`flex-shrink-0 px-space-sm h-9 rounded-full font-label-md text-label-md font-medium transition-colors ${
                      selectedSemester === sem
                        ? 'bg-primary-container text-on-primary shadow-xs font-bold'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    {sem}º{sem === 9 ? '+' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[1px] bg-surface-container w-full my-space-2xs"></div>

            {/* 5. Contraseña */}
            <div className="flex flex-col gap-space-2xs">
              <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="password">
                Crear Contraseña
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-space-sm text-outline pointer-events-none text-[20px]">
                  lock
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full h-12 pl-10 pr-12 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center text-outline hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>

              {/* Indicador Dinámico de Fortaleza */}
              <div className="mt-space-xs bg-surface-container-low p-space-xs rounded-lg flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Nivel de seguridad:</span>
                  <span className="font-label-sm text-label-sm font-semibold text-secondary">Media</span>
                </div>
                <div className="w-full grid grid-cols-4 gap-1 h-1.5">
                  <div className="rounded-full bg-secondary transition-all"></div>
                  <div className="rounded-full bg-secondary transition-all"></div>
                  <div className="rounded-full bg-surface-container-highest transition-all"></div>
                  <div className="rounded-full bg-surface-container-highest transition-all"></div>
                </div>
                <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm pt-0.5">
                  <span className="material-symbols-outlined text-[13px] text-outline">check</span>
                  <span>Usa 8+ caracteres, mayúsculas y un número o símbolo.</span>
                </div>
              </div>
            </div>

            {/* 6. Confirmar Contraseña */}
            <div className="flex flex-col gap-space-2xs">
              <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="confirmPassword">
                Confirmar Contraseña
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-space-sm text-outline pointer-events-none text-[20px]">
                  lock_reset
                </span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu contraseña creada"
                  className="w-full h-12 pl-10 pr-10 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                />
                <span
                  className={`material-symbols-outlined absolute right-space-sm text-[20px] transition-colors ${
                    passwordsMatch ? 'text-on-tertiary-container' : 'text-outline'
                  }`}
                >
                  {passwordsMatch ? 'check_circle' : 'password'}
                </span>
              </div>
            </div>

            {/* 7. Términos y Condiciones */}
            <div className="flex items-start gap-space-xs mt-space-2xs select-none">
              <label className="relative flex items-center cursor-pointer mt-0.5">
                <input
                  id="acceptTerms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 rounded bg-surface-container-low peer-checked:bg-primary-container text-on-primary flex items-center justify-center transition-colors shadow-xs">
                  <span
                    className={`material-symbols-outlined text-[16px] text-on-primary transition-opacity font-bold ${
                      acceptTerms ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    check
                  </span>
                </div>
              </label>
              <div className="font-body-sm text-body-sm text-on-surface-variant leading-tight">
                Acepto los{' '}
                <a href="#" className="font-semibold text-primary underline">
                  Términos de Servicio Institucional
                </a>{' '}
                y el{' '}
                <a href="#" className="font-semibold text-primary underline">
                  Aviso de Privacidad Universitaria
                </a>
                .
              </div>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full h-12 rounded-lg font-label-lg text-label-lg font-semibold flex items-center justify-center gap-space-xs shadow-md active:scale-[0.98] transition-all mt-space-xs cursor-pointer ${
                successMessage
                  ? 'bg-tertiary-container text-on-tertiary'
                  : 'bg-primary-container hover:bg-primary text-on-primary'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                  <span>Creando cuenta institucional...</span>
                </>
              ) : successMessage ? (
                <>
                  <span className="material-symbols-outlined text-[20px]">task_alt</span>
                  <span>¡Bienvenido a CampusApp!</span>
                </>
              ) : (
                <>
                  <span>Completar Registro e Ingresar</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Already Have Account Link */}
          <div className="text-center pt-space-xs pb-space-2xs">
            <p className="font-body-md text-body-md text-on-surface-variant">
              ¿Ya tienes una cuenta?
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="font-label-lg text-label-lg font-bold text-primary hover:underline ml-1 cursor-pointer"
              >
                Iniciar Sesión
              </button>
            </p>
          </div>
        </div>

        {/* Security Institutional Disclaimer Banner */}
        <div className="mt-space-lg rounded-xl bg-surface-container p-space-md flex items-center gap-space-sm shadow-xs">
          <div className="w-10 h-10 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[22px]">verified_user</span>
          </div>
          <div className="flex flex-col">
            <h4 className="font-label-md text-label-md font-bold text-on-surface">Validación Académica Segura</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              CampusApp sincroniza credenciales mediante encriptación SSL bajo el estándar de identidad de tu institución.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
