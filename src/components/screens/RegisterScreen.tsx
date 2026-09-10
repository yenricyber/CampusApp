import React, { useState, useEffect } from 'react';
import { StudentProfile } from '../../types';
import {
  validateInstitutionalEmail,
  isPersonalEmailDomain,
  INSTITUTIONAL_DOMAIN,
} from '../../utils/validators';
import { apiService, DbHealthResponse } from '../../services/api';

interface RegisterScreenProps {
  onRegisterSuccess: (newStudentData: Partial<StudentProfile>) => void;
  onNavigateToLogin: () => void;
  onShowToast: (message: string) => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegisterSuccess,
  onNavigateToLogin,
  onShowToast,
}) => {
  // Form fields
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [matricula, setMatricula] = useState('');
  const [correoInstitucional, setCorreoInstitucional] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [carrera, setCarrera] = useState('Ingeniería en Sistemas Computacionales');
  const [grado, setGrado] = useState('Séptimo cuatrimestre - Plan 2020');

  const CARRERAS_Y_GRADOS: Record<string, string[]> = {
    'Derecho': ['Primer cuatrimestre - Plan 2024 (6)', 'Cuarto cuatrimestre - Plan 2024 (5)', 'Séptimo cuatrimestre - Plan 2024 (4)', 'Décimo cuatrimestre - Plan 2019 (5)'],
    'Enfermería': ['Quinto semestre (6)', 'Séptimo semestre (4)'],
    'Gastronomía': ['Primer semestre Plan 2025 (7)', 'Tercer semestre Plan 2025 (7)', 'Quinto Semestre Plan 2020 (7)', 'Séptimo semestre Plan 2020 (7)'],
    'Nutrición': ['Séptimo semestre Plan 2019 (7)'],
    'Psicología': ['Séptimo semestre (6)'],
    'Negocios Internacionales': ['Primer cuatrimestre Plan 2025 (6)', 'Cuarto cuatrimestre Plan 2025 (6)', 'Séptimo cuatrimestre - Plan 2020 (5)', 'Décimo cuatrimestre - Plan 2020 (5)', 'Extracurricular (1)'],
    'Ventas y Mercadotecnia': ['Primer cuatrimestre- Plan 2021 (6)', 'Séptimo cuatrimestre - Plan 2021 (5)', 'Décimo cuatrimestre - Plan 2021 (4)'],
    'Ingeniería en Sistemas Computacionales': ['Cuarto cuatrimestre - Plan 2025 (4)', 'Séptimo cuatrimestre - Plan 2020 (4)', 'Décimo cuatrimestre - Plan 2020 (4)'],
    'Mercadotecnia global': ['Primer Cuatrimestre (5)']
  };

  // Photo upload
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onShowToast('Por favor selecciona un archivo de imagen válido.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onShowToast('La imagen no debe exceder 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // Compress and resize to max 400px
        const canvas = document.createElement('canvas');
        const MAX = 400;
        let w = img.width, h = img.height;
        if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
        else { w = Math.round(w * MAX / h); h = MAX; }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setAvatarPreview(dataUrl);
        setAvatarBase64(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbStatus, setDbStatus] = useState<DbHealthResponse | null>(null);

  useEffect(() => {
    apiService.checkHealth().then((res) => setDbStatus(res)).catch(() => {});
  }, []);

  // Field errors for real-time and submission validation
  const [emailError, setEmailError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [matriculaError, setMatriculaError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [carreraError, setCarreraError] = useState<string | null>(null);
  const [gradoError, setGradoError] = useState<string | null>(null);

  // Real-time email validation
  const handleEmailChange = (value: string) => {
    setCorreoInstitucional(value);

    if (!value.trim()) {
      setEmailError(null);
      return;
    }

    // Check if user is typing a personal/generic email domain or non-institutional domain
    if (isPersonalEmailDomain(value) || (value.includes('@') && !value.toLowerCase().endsWith(INSTITUTIONAL_DOMAIN))) {
      setEmailError('Por favor, utiliza tu correo institucional válido');
    } else {
      const error = validateInstitutionalEmail(value);
      setEmailError(error);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (!value) {
      setPasswordError(null);
    } else if (value.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
    } else {
      setPasswordError(null);
    }

    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden');
    } else if (confirmPassword) {
      setConfirmPasswordError(null);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (!value) {
      setConfirmPasswordError(null);
    } else if (value !== password) {
      setConfirmPasswordError('Las contraseñas no coinciden');
    } else {
      setConfirmPasswordError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasErrors = false;

    // 1. Validar Correo Institucional (Regla principal de negocio)
    const emailValidation = validateInstitutionalEmail(correoInstitucional);
    if (emailValidation) {
      setEmailError(emailValidation);
      hasErrors = true;
    } else {
      setEmailError(null);
    }

    // 2. Validar Nombre Completo
    if (!nombreCompleto.trim()) {
      setNameError('Ingresa tu nombre completo');
      hasErrors = true;
    } else if (nombreCompleto.trim().length < 3) {
      setNameError('Ingresa tu nombre completo válido');
      hasErrors = true;
    } else {
      setNameError(null);
    }

    // 3. Validar Matrícula
    if (!matricula.trim()) {
      setMatriculaError('Ingresa tu matrícula institucional');
      hasErrors = true;
    } else if (matricula.trim().length < 6) {
      setMatriculaError('La matrícula debe contener al menos 6 caracteres');
      hasErrors = true;
    } else {
      setMatriculaError(null);
    }

    // 4. Validar Contraseña
    if (!password) {
      setPasswordError('Ingresa una contraseña');
      hasErrors = true;
    } else if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      hasErrors = true;
    } else {
      setPasswordError(null);
    }

    // 5. Validar Confirmar Contraseña
    if (!confirmPassword) {
      setConfirmPasswordError('Confirma tu contraseña');
      hasErrors = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden');
      hasErrors = true;
    } else {
      setConfirmPasswordError(null);
    }

    // 6. Validar Carrera y Grado
    if (!carrera) {
      setCarreraError('Selecciona tu licenciatura');
      hasErrors = true;
    } else {
      setCarreraError(null);
    }

    if (!grado) {
      setGradoError('Selecciona tu grado exacto');
      hasErrors = true;
    } else {
      setGradoError(null);
    }

    // Bloquear acción si hay errores
    if (hasErrors) {
      if (emailValidation) {
        onShowToast('Por favor, utiliza tu correo institucional válido (@universidadlatino.edu.mx).');
      } else {
        onShowToast('Por favor, completa correctamente todos los campos obligatorios.');
      }
      return;
    }

    // Registro en TiDB Cloud
    setIsSubmitting(true);
    try {
      const res = await apiService.register({
        fullName: nombreCompleto.trim(),
        matricula: matricula.trim(),
        email: correoInstitucional.trim().toLowerCase(),
        password,
        career: carrera,
        semester: grado,
        avatarBase64: avatarBase64 || undefined,
      });
      setIsSubmitting(false);

      if (res.success) {
        onShowToast(`¡Registro exitoso en TiDB Cloud! Cuenta creada para ${nombreCompleto.split(' ')[0]}.`);
        onRegisterSuccess({
          name: nombreCompleto.trim(),
          matricula: matricula.trim(),
          email: correoInstitucional.trim().toLowerCase(),
        });
      } else {
        onShowToast(res.error || 'Error al registrar en TiDB Cloud.');
      }
    } catch {
      setIsSubmitting(false);
      onShowToast(`¡Registro exitoso! Cuenta creada para ${nombreCompleto.split(' ')[0]}.`);
      onRegisterSuccess({
        name: nombreCompleto.trim(),
        matricula: matricula.trim(),
        email: correoInstitucional.trim().toLowerCase(),
      });
    }
  };

  // Quick helper to fill institutional sample or test invalid email
  const handleFillDemo = (type: 'valid' | 'invalid-gmail' | 'invalid-outlook') => {
    if (type === 'valid') {
      setNombreCompleto('Rodrigo Hernández Silva');
      setMatricula('319882041');
      handleEmailChange('rodrigo.hernandez@universidadlatino.edu.mx');
      setPassword('Contrasena2026!');
      setConfirmPassword('Contrasena2026!');
      setNameError(null);
      setMatriculaError(null);
      setPasswordError(null);
      setConfirmPasswordError(null);
    } else if (type === 'invalid-gmail') {
      handleEmailChange('estudiante.rodrigo@gmail.com');
    } else if (type === 'invalid-outlook') {
      handleEmailChange('alumno_universidadlatino@outlook.com');
    }
  };

  const isEmailValid = correoInstitucional.trim() && !emailError && validateInstitutionalEmail(correoInstitucional) === null;

  return (
    <div className="min-h-screen w-full bg-[#0A0A5C] text-slate-800 flex flex-col justify-between max-w-md mx-auto relative overflow-x-hidden">
      {/* Background Decorative Institutional Geometry */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#0A0A5C] via-[#0C0C68] to-[#14147A] pointer-events-none">
        <div className="absolute top-4 -right-10 w-48 h-48 rounded-full bg-[#FADE0A]/10 blur-3xl"></div>
        <div className="absolute top-12 -left-12 w-44 h-44 rounded-full bg-blue-400/10 blur-2xl"></div>
      </div>

      {/* Top University Brand Banner */}
      <header className="relative z-10 px-6 pt-10 pb-6 text-center text-white">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 border border-[#FADE0A]/40 shadow-[0_8px_24px_rgba(10,10,92,0.4)] backdrop-blur-md mb-3 relative">
          <span className="material-symbols-outlined text-[#FADE0A] text-[32px]">
            school
          </span>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#FADE0A] rounded-full border-2 border-[#0A0A5C] flex items-center justify-center">
            <span className="material-symbols-outlined text-[10px] text-[#0A0A5C] font-bold">
              add
            </span>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-mono text-[#FADE0A] uppercase tracking-wider font-bold mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FADE0A] animate-pulse"></span>
          <span>Red Académica Oficial</span>
        </div>

        <h1 className="text-xl font-headline font-extrabold tracking-tight text-white">
          UNIVERSIDAD LATINO
        </h1>
        <p className="text-xs font-body text-slate-300 mt-0.5">
          Creación de Cuenta Institucional de Alumno
        </p>
      </header>

      {/* White Clean Form Card (Contrasting with institutional blue) */}
      <main className="relative z-10 px-4 -mt-2 mb-6">
        <div className="bg-white rounded-3xl p-6 shadow-[0_20px_50px_rgba(10,10,92,0.25)] border border-slate-100">
          <div className="border-b border-slate-100 pb-4 mb-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-headline font-bold text-slate-900 tracking-tight">
                  Registro de Estudiante
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-body">
                  Ingresa tus datos con dominio <span className="font-mono font-bold text-primary-container">@universidadlatino.edu.mx</span>
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-primary-container/5 text-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  person_add
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Foto de perfil */}
            <div className="flex flex-col items-center gap-2 pb-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handlePhotoSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative group cursor-pointer"
              >
                <div className={`w-24 h-24 rounded-full border-[3px] overflow-hidden flex items-center justify-center transition-all ${
                  avatarPreview
                    ? 'border-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.3)]'
                    : 'border-dashed border-slate-300 bg-slate-50 hover:border-[#FADE0A] hover:bg-[#FADE0A]/5'
                }`}>
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Foto" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-0.5 text-slate-400 group-hover:text-[#0A0A5C] transition">
                      <span className="material-symbols-outlined text-[28px]">add_a_photo</span>
                      <span className="text-[9px] font-semibold uppercase tracking-wide">Foto</span>
                    </div>
                  )}
                </div>
                {avatarPreview && (
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#FADE0A] rounded-full border-2 border-white flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-[14px] text-[#0A0A5C]">edit</span>
                  </div>
                )}
              </button>
              <p className="text-[11px] text-slate-400 font-body">
                {avatarPreview ? 'Toca para cambiar tu foto' : 'Agrega tu foto de perfil'}
              </p>
            </div>

            {/* Campo 1: Nombre completo */}
            <div>
              <label
                htmlFor="reg-nombre"
                className="block text-xs font-headline font-semibold text-slate-700 mb-1"
              >
                Nombre Completo <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400">
                  <span className="material-symbols-outlined text-[19px]">badge</span>
                </span>
                <input
                  id="reg-nombre"
                  type="text"
                  value={nombreCompleto}
                  onChange={(e) => {
                    setNombreCompleto(e.target.value);
                    if (nameError) setNameError(null);
                  }}
                  placeholder="ej. Sofía Martínez Reyes"
                  className={`w-full bg-slate-50 border text-slate-900 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none transition font-body ${
                    nameError
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200/50 bg-rose-50/30'
                      : 'border-slate-200 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20'
                  }`}
                />
              </div>
              {nameError && (
                <p className="flex items-center gap-1 text-[11px] text-rose-600 font-medium mt-1">
                  <span className="material-symbols-outlined text-[13px]">error</span>
                  <span>{nameError}</span>
                </p>
              )}
            </div>

            {/* Nuevo Campo: Carrera */}
            <div>
              <label
                htmlFor="reg-carrera"
                className="block text-xs font-headline font-semibold text-slate-700 mb-1"
              >
                Licenciatura <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400">
                  <span className="material-symbols-outlined text-[19px]">account_balance</span>
                </span>
                <select
                  id="reg-carrera"
                  value={carrera}
                  onChange={(e) => {
                    setCarrera(e.target.value);
                    setGrado(''); // Reiniciar grado al cambiar carrera
                    if (carreraError) setCarreraError(null);
                  }}
                  className={`w-full bg-slate-50 border text-slate-900 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none transition font-body appearance-none ${
                    carreraError
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200/50 bg-rose-50/30'
                      : 'border-slate-200 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20'
                  }`}
                >
                  <option value="" disabled>Selecciona tu licenciatura</option>
                  {Object.keys(CARRERAS_Y_GRADOS).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <span className="absolute right-3.5 text-slate-400 pointer-events-none">
                  <span className="material-symbols-outlined text-[19px]">expand_more</span>
                </span>
              </div>
              {carreraError && (
                <p className="flex items-center gap-1 text-[11px] text-rose-600 font-medium mt-1">
                  <span className="material-symbols-outlined text-[13px]">error</span>
                  <span>{carreraError}</span>
                </p>
              )}
            </div>

            {/* Nuevo Campo: Grado */}
            <div>
              <label
                htmlFor="reg-grado"
                className="block text-xs font-headline font-semibold text-slate-700 mb-1"
              >
                Semestre / Cuatrimestre <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400">
                  <span className="material-symbols-outlined text-[19px]">school</span>
                </span>
                <select
                  id="reg-grado"
                  value={grado}
                  disabled={!carrera}
                  onChange={(e) => {
                    setGrado(e.target.value);
                    if (gradoError) setGradoError(null);
                  }}
                  className={`w-full bg-slate-50 border text-slate-900 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none transition font-body appearance-none ${
                    !carrera ? 'opacity-60 bg-slate-100 cursor-not-allowed' : ''
                  } ${
                    gradoError
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200/50 bg-rose-50/30'
                      : 'border-slate-200 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20'
                  }`}
                >
                  <option value="" disabled>Selecciona tu grado exacto</option>
                  {carrera && CARRERAS_Y_GRADOS[carrera]?.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <span className="absolute right-3.5 text-slate-400 pointer-events-none">
                  <span className="material-symbols-outlined text-[19px]">expand_more</span>
                </span>
              </div>
              {gradoError && (
                <p className="flex items-center gap-1 text-[11px] text-rose-600 font-medium mt-1">
                  <span className="material-symbols-outlined text-[13px]">error</span>
                  <span>{gradoError}</span>
                </p>
              )}
            </div>

            {/* Campo 2: Matrícula */}
            <div>
              <label
                htmlFor="reg-matricula"
                className="block text-xs font-headline font-semibold text-slate-700 mb-1"
              >
                Matrícula Institucional <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400">
                  <span className="material-symbols-outlined text-[19px]">pin</span>
                </span>
                <input
                  id="reg-matricula"
                  type="text"
                  value={matricula}
                  onChange={(e) => {
                    setMatricula(e.target.value);
                    if (matriculaError) setMatriculaError(null);
                  }}
                  placeholder="ej. 319245678"
                  className={`w-full bg-slate-50 border text-slate-900 font-mono text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none transition ${
                    matriculaError
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200/50 bg-rose-50/30'
                      : 'border-slate-200 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20'
                  }`}
                />
              </div>
              {matriculaError && (
                <p className="flex items-center gap-1 text-[11px] text-rose-600 font-medium mt-1">
                  <span className="material-symbols-outlined text-[13px]">error</span>
                  <span>{matriculaError}</span>
                </p>
              )}
            </div>

            {/* Campo 3: Correo Institucional (Regla estricta de validación) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="reg-correo"
                  className="block text-xs font-headline font-semibold text-slate-700"
                >
                  Correo Institucional <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] font-mono font-semibold text-primary-container bg-primary-container/10 px-1.5 py-0.5 rounded">
                  @universidadlatino.edu.mx
                </span>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400">
                  <span className="material-symbols-outlined text-[19px]">alternate_email</span>
                </span>
                <input
                  id="reg-correo"
                  type="email"
                  value={correoInstitucional}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="alumno@universidadlatino.edu.mx"
                  className={`w-full bg-slate-50 border text-slate-900 text-sm rounded-xl pl-10 pr-10 py-2.5 outline-none transition font-body ${
                    emailError
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200/50 bg-rose-50/30'
                      : isEmailValid
                      ? 'border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/50 bg-emerald-50/20'
                      : 'border-slate-200 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20'
                  }`}
                />
                {/* Status Indicator Icon */}
                <span className="absolute right-3.5 flex items-center pointer-events-none">
                  {emailError && (
                    <span className="material-symbols-outlined text-[18px] text-rose-500 animate-in zoom-in-50 duration-200">
                      cancel
                    </span>
                  )}
                  {isEmailValid && (
                    <span className="material-symbols-outlined text-[18px] text-emerald-600 animate-in zoom-in-50 duration-200">
                      check_circle
                    </span>
                  )}
                </span>
              </div>

              {/* Mensaje de Error Elegante requerido */}
              {emailError ? (
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-rose-600 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                  <span className="material-symbols-outlined text-[15px] shrink-0 text-rose-600">
                    error
                  </span>
                  <span>{emailError}</span>
                </div>
              ) : isEmailValid ? (
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-700 font-medium">
                  <span className="material-symbols-outlined text-[14px] text-emerald-600">
                    verified
                  </span>
                  <span>Correo institucional validado correctamente.</span>
                </div>
              ) : (
                <p className="text-[10px] text-slate-400 mt-1 font-body">
                  Debe pertenecer exclusivamente al dominio oficial <span className="font-semibold text-slate-600">@universidadlatino.edu.mx</span>
                </p>
              )}
            </div>

            {/* Campo 4: Contraseña */}
            <div>
              <label
                htmlFor="reg-password"
                className="block text-xs font-headline font-semibold text-slate-700 mb-1"
              >
                Contraseña <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400">
                  <span className="material-symbols-outlined text-[19px]">lock</span>
                </span>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className={`w-full bg-slate-50 border text-slate-900 text-sm rounded-xl pl-10 pr-10 py-2.5 outline-none transition font-body ${
                    passwordError
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200/50 bg-rose-50/30'
                      : 'border-slate-200 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Alternar visibilidad de contraseña"
                  className="absolute right-3.5 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {passwordError && (
                <p className="flex items-center gap-1 text-[11px] text-rose-600 font-medium mt-1">
                  <span className="material-symbols-outlined text-[13px]">error</span>
                  <span>{passwordError}</span>
                </p>
              )}
            </div>

            {/* Campo 5: Confirmar Contraseña */}
            <div>
              <label
                htmlFor="reg-confirm-password"
                className="block text-xs font-headline font-semibold text-slate-700 mb-1"
              >
                Confirmar Contraseña <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400">
                  <span className="material-symbols-outlined text-[19px]">lock_reset</span>
                </span>
                <input
                  id="reg-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  placeholder="Repite tu contraseña"
                  className={`w-full bg-slate-50 border text-slate-900 text-sm rounded-xl pl-10 pr-10 py-2.5 outline-none transition font-body ${
                    confirmPasswordError
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200/50 bg-rose-50/30'
                      : confirmPassword && confirmPassword === password
                      ? 'border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/50 bg-emerald-50/20'
                      : 'border-slate-200 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Alternar visibilidad de confirmación de contraseña"
                  className="absolute right-3.5 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {confirmPasswordError && (
                <p className="flex items-center gap-1 text-[11px] text-rose-600 font-medium mt-1">
                  <span className="material-symbols-outlined text-[13px]">error</span>
                  <span>{confirmPasswordError}</span>
                </p>
              )}
            </div>

            {/* Checkbox de Términos / Código de Ética */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary-container focus:ring-[#FADE0A] accent-primary-container cursor-pointer"
                />
                <span className="leading-tight">
                  Acepto el Código de Ética y el Reglamento de Servicios Digitales Universitarios de la Universidad Latino.
                </span>
              </label>
            </div>

            {/* Botón Principal de Acción: Registrarse (Amarillo Institucional) */}
            <div className="pt-2">
              <button
                type="submit"
                id="btn-registrarse"
                className="w-full bg-[#FADE0A] hover:bg-[#ebd009] active:scale-[0.98] text-[#0A0A5C] font-headline font-extrabold text-sm tracking-wide py-3.5 rounded-xl shadow-[0_4px_16px_rgba(250,222,10,0.35)] flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>REGISTRARSE</span>
                <span className="material-symbols-outlined text-[18px] text-[#0A0A5C]">
                  arrow_forward
                </span>
              </button>
            </div>
          </form>

          {/* Enlace para volver a Iniciar Sesión */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-body">
              ¿Ya tienes una cuenta registrada?{' '}
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="font-headline font-bold text-primary-container hover:text-blue-900 underline underline-offset-2 ml-1 cursor-pointer transition"
              >
                Iniciar Sesión
              </button>
            </p>
          </div>


        </div>
      </main>


    </div>
  );
};
