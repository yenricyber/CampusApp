import React from 'react';
import { Course, StudentProfile } from '../../types';

interface MateriasScreenProps {
  student: StudentProfile;
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onOpenCredencial: () => void;
  onOpenNotifications: () => void;
  onOpenPlanEstudios: () => void;
  onOpenLibrary: () => void;
}

export const MateriasScreen: React.FC<MateriasScreenProps> = ({
  student,
  courses,
  onSelectCourse,
  onOpenCredencial,
  onOpenNotifications,
  onOpenPlanEstudios,
  onOpenLibrary,
}) => {
  if (!student || !student.name) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center text-slate-800">
        <span className="material-symbols-outlined text-[64px] text-rose-500 mb-4 bg-rose-50 rounded-full p-4">person_off</span>
        <h2 className="text-xl font-headline font-bold mb-2">Usuario no encontrado</h2>
        <p className="text-sm text-slate-500 font-body">
          No pudimos cargar los datos de tu cuenta. Es posible que tu sesión haya expirado o haya un problema de conexión.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full px-4 gap-4 pb-28 pt-20 max-w-md mx-auto">
      {/* Institutional Hero Panel */}
      <section className="bg-primary-container text-on-primary rounded-2xl p-4 shadow-md relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-secondary-container/10 pointer-events-none blur-2xl"></div>
        
        <div className="flex items-center justify-between relative z-10 mb-3">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-sm bg-surface-container-high border border-white/20">
              <img
                className="w-full h-full object-cover"
                alt={student.name}
                src={student.avatarUrl}
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse shadow-[0_0_6px_#fce010]"></span>
                <span className="font-headline text-[10px] uppercase tracking-wider text-secondary-container font-bold">
                  {student.status}
                </span>
              </div>
              <h2 className="font-headline text-[17px] font-bold text-on-primary leading-snug">
                Hola, {student?.name ? student.name.split(' ').slice(0, 2).join(' ') : 'Alumno'}
              </h2>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-on-primary-container">
                <span className="truncate max-w-[140px]">Ingeniería en Sistemas</span>
                <span className="w-1 h-1 rounded-full bg-on-primary-container/60"></span>
                <span className="text-secondary-container font-semibold">{student.semester}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenNotifications}
              aria-label="Notificaciones pendientes"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative hover:bg-white/20 active:scale-95 transition-all text-white"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary-container"></span>
            </button>
            <button
              onClick={onOpenCredencial}
              aria-label="Ver credencial digital"
              className="w-10 h-10 rounded-full bg-secondary-container text-[#0c0c5d] flex items-center justify-center hover:brightness-105 active:scale-95 transition-all shadow-[0_2px_8px_rgba(250,222,10,0.35)]"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                badge
              </span>
            </button>
          </div>
        </div>

        {/* Live Status Quick Bar */}
        <div className="grid grid-cols-3 gap-2 pt-2 bg-black/20 rounded-xl px-3 py-2 border border-white/5">
          <div className="flex flex-col">
            <span className="font-headline text-[10px] text-on-primary-container uppercase tracking-tight font-semibold">
              Promedio
            </span>
            <span className="font-mono text-[16px] font-bold text-secondary-container">
              {Number(student.gpa || 0).toFixed(2)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-[10px] text-on-primary-container uppercase tracking-tight font-semibold">
              Créditos
            </span>
            <span className="font-mono text-[16px] font-bold text-on-primary">
              {student.credits?.earned ?? 0} / {student.credits?.total ?? 0}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-[10px] text-on-primary-container uppercase tracking-tight font-semibold">
              Asistencia
            </span>
            <span className="font-mono text-[16px] font-bold text-on-primary">
              {student.attendance}%
            </span>
          </div>
        </div>
      </section>

      {/* Urgent Official Notice Banner */}
      <section
        aria-label="Avisos institucionales urgentes"
        className="bg-secondary-container text-on-secondary-fixed rounded-xl p-3 shadow-sm flex items-start gap-2.5 border border-amber-300/40"
      >
        <div className="w-9 h-9 rounded-lg bg-primary-container text-secondary-container flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <span className="material-symbols-outlined text-[20px]">campaign</span>
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-headline text-[11px] uppercase tracking-wider text-on-secondary-fixed font-bold">
              Cambio Oficial de Aula
            </span>
            <span className="font-mono text-[11px] text-on-secondary-fixed/80">Hoy 09:40</span>
          </div>
          <p className="font-body text-[13px] text-on-secondary-fixed font-medium mt-0.5 leading-snug">
            La sesión de <span className="font-bold">Base de Datos II</span> se traslada temporalmente al{' '}
            <span className="font-bold underline">Laboratorio Central L-102</span> por mantenimiento de redes.
          </p>
        </div>
      </section>

      {/* Real-time Class Widget */}
      <section className="bg-surface-container-lowest rounded-xl p-4 shadow-[0_4px_14px_rgba(10,10,92,0.06)] border border-[#e3e8f3] relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary-container shadow-[0_0_8px_rgba(252,224,16,0.9)] animate-ping"></span>
            <span className="font-headline text-[11px] uppercase tracking-wider text-primary-container font-bold">
              Próxima Clase (en 15 min)
            </span>
          </div>
          <span className="font-mono text-[11px] bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full font-medium">
            Semana 11
          </span>
        </div>

        <div className="flex items-start justify-between gap-2 mt-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-headline text-[19px] font-bold text-on-surface truncate">
              Ingeniería de Software
            </h3>
            <div className="flex items-center gap-2 text-on-surface-variant mt-1">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-primary-container">person</span>
                <span className="font-body text-[12px]">Dr. Carlos Mendoza</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-error">location_on</span>
                <span className="font-mono text-[12px] text-on-surface font-bold">Aula B-204</span>
              </div>
            </div>
          </div>

          <div className="text-right shrink-0 bg-primary-container text-on-primary px-3 py-1.5 rounded-lg shadow-sm">
            <div className="font-headline text-[10px] text-secondary-container uppercase font-bold tracking-wider">
              Horario
            </div>
            <div className="font-mono text-[12px] font-bold tracking-tight">10:00 - 11:30</div>
          </div>
        </div>

        <div className="mt-3 pt-2 flex items-center justify-between bg-surface-container-low p-2.5 rounded-lg border border-slate-100">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px] text-primary-container">
              assignment_turned_in
            </span>
            <span className="font-body text-[12px] font-medium text-slate-700">
              Entregable sprint activo
            </span>
          </div>
          <button
            onClick={() => onSelectCourse(courses[0])}
            className="bg-secondary-container text-[#0c0c5d] font-headline text-[11px] px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 shadow-sm hover:brightness-105 active:scale-95 transition-all"
          >
            <span>Asistir</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* Enrolled Courses Header */}
      <section className="flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-headline text-[17px] font-bold text-on-surface">
              Materias Inscritas
            </h3>
            <span className="font-mono text-[11px] bg-primary-container text-secondary-container px-2 py-0.5 rounded-full font-bold shadow-xs">
              {courses.length} Cursando
            </span>
          </div>
          <button
            onClick={onOpenPlanEstudios}
            className="font-body text-[12px] text-primary-container font-semibold flex items-center gap-0.5 hover:underline"
          >
            <span>Plan de estudios</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        {/* Course Cards Stack */}
        <div className="flex flex-col gap-2.5">
          {courses.map((course) => (
            <article
              key={course.id}
              onClick={() => onSelectCourse(course)}
              className="bg-surface-container-lowest rounded-xl p-4 shadow-[0_4px_14px_rgba(10,10,92,0.04)] border border-[#e3e8f3] hover:shadow-[0_8px_20px_rgba(10,10,92,0.1)] hover:border-primary-container/30 transition-all cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-mono text-[11px] bg-surface-container-high text-on-surface-variant px-1.5 py-0.5 rounded font-semibold">
                      {course.code}
                    </span>
                    <span className="font-headline text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
                      {course.type}
                    </span>
                  </div>
                  <h4 className="font-headline text-[16px] font-bold text-on-surface truncate group-hover:text-primary-container transition-colors">
                    {course.name}
                  </h4>
                </div>

                <span className="bg-secondary-container text-on-secondary-fixed font-mono text-[11px] font-bold px-2 py-1 rounded-lg shrink-0 flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                  {course.pendingCount} Pendientes
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 text-on-surface-variant">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="material-symbols-outlined text-[17px] text-primary-container">person</span>
                  <span className="font-body text-[12px] truncate">{course.professor}</span>
                </div>
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="material-symbols-outlined text-[17px] text-outline">
                    {course.isRelocated ? 'swap_horiz' : 'meeting_room'}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-on-surface">
                    {course.classroom}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-headline text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
                    Avance del Curso
                  </span>
                  <span className="font-mono text-[11px] font-bold text-primary-container">
                    {course.progress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-container rounded-full transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Campus Resource Quick Card */}
      <section
        onClick={onOpenLibrary}
        className="bg-surface-container-high rounded-xl p-3.5 flex items-center justify-between border border-[#dfe1f9] hover:bg-surface-container-highest transition-colors cursor-pointer active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-container text-secondary-container flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[22px]">menu_book</span>
          </div>
          <div>
            <h4 className="font-headline text-[15px] font-bold text-on-surface">Biblioteca Digital</h4>
            <p className="font-body text-[12px] text-on-surface-variant">3 préstamos activos por vencer</p>
          </div>
        </div>
        <button
          className="w-9 h-9 rounded-lg bg-surface-container-lowest text-primary-container flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </section>
    </div>
  );
};
