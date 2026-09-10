import React, { useState } from 'react';
import { Course } from '../../types';

interface DetalleMateriaScreenProps {
  course: Course;
  onBack: () => void;
  onOpenUploadModal: (activityTitle: string) => void;
  onDownloadPdf: (fileName: string) => void;
  onShowToast: (message: string) => void;
}

export const DetalleMateriaScreen: React.FC<DetalleMateriaScreenProps> = ({
  course,
  onBack,
  onOpenUploadModal,
  onDownloadPdf,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'actividades' | 'materiales' | 'calificaciones'>('actividades');

  return (
    <div className="flex flex-col w-full pb-28 pt-16 max-w-md mx-auto">
      {/* Course Hero Banner */}
      <div className="bg-primary-container text-on-secondary px-4 pt-4 pb-6 shadow-sm border-b border-white/5">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-[11px] text-secondary-fixed tracking-wider uppercase font-semibold">
            {course.code || 'IS-402'} • SEMESTRE 2026-2
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 font-headline text-[10px] text-surface-variant font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed shadow-[0_0_6px_#ffe31e]"></span>
            Curso Activo
          </span>
        </div>
        <h2 className="font-headline text-[22px] font-bold text-white leading-tight mb-1">
          {course.name}
        </h2>
        <p className="font-body text-[12px] text-surface-variant">
          Facultad de Ingeniería y Ciencias Computacionales
        </p>
      </div>

      <div className="px-4 flex flex-col gap-4 -mt-3">
        {/* Teacher Card */}
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-[#e3e8f3]">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary-container shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[26px]">school</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="font-headline text-[16px] font-bold text-on-surface truncate">
                  {course.professor}
                </h3>
                <span
                  className="material-symbols-outlined text-[16px] text-primary-container"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </div>
              <span className="font-body text-[12px] text-outline truncate">{course.professorEmail}</span>
              <span className="font-headline text-[10px] text-primary-container uppercase font-bold tracking-wider mt-0.5">
                {course.professorTitle}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-2 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2 px-1.5 py-1">
              <span className="material-symbols-outlined text-[18px] text-primary-container">schedule</span>
              <div className="flex flex-col min-w-0">
                <span className="font-headline text-[10px] text-outline uppercase font-bold">Horario</span>
                <span className="font-mono text-[11px] text-on-surface truncate font-semibold">
                  {course.schedule}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-1.5 py-1">
              <span className="material-symbols-outlined text-[18px] text-primary-container">meeting_room</span>
              <div className="flex flex-col min-w-0">
                <span className="font-headline text-[10px] text-outline uppercase font-bold">Ubicación</span>
                <span className="font-mono text-[11px] text-on-surface truncate font-semibold">
                  {course.classroom}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-tabs Navigation */}
        <div className="bg-surface-container-high p-1 rounded-xl flex items-center gap-1 shadow-xs border border-[#dfe1f9]">
          <button
            onClick={() => setActiveTab('actividades')}
            className={`flex-1 py-2 px-2 rounded-lg font-headline text-[12px] transition-all duration-200 flex items-center justify-center gap-1.5 ${
              activeTab === 'actividades'
                ? 'bg-surface-container-lowest text-primary-container font-bold shadow-sm'
                : 'text-outline hover:text-on-surface font-medium'
            }`}
          >
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ fontVariationSettings: activeTab === 'actividades' ? "'FILL' 1" : "'FILL' 0" }}
            >
              assignment
            </span>
            <span>Actividades</span>
          </button>

          <button
            onClick={() => setActiveTab('materiales')}
            className={`flex-1 py-2 px-2 rounded-lg font-headline text-[12px] transition-all duration-200 flex items-center justify-center gap-1.5 ${
              activeTab === 'materiales'
                ? 'bg-surface-container-lowest text-primary-container font-bold shadow-sm'
                : 'text-outline hover:text-on-surface font-medium'
            }`}
          >
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ fontVariationSettings: activeTab === 'materiales' ? "'FILL' 1" : "'FILL' 0" }}
            >
              folder_open
            </span>
            <span>Materiales</span>
          </button>

          <button
            onClick={() => setActiveTab('calificaciones')}
            className={`flex-1 py-2 px-2 rounded-lg font-headline text-[12px] transition-all duration-200 flex items-center justify-center gap-1.5 ${
              activeTab === 'calificaciones'
                ? 'bg-surface-container-lowest text-primary-container font-bold shadow-sm'
                : 'text-outline hover:text-on-surface font-medium'
            }`}
          >
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ fontVariationSettings: activeTab === 'calificaciones' ? "'FILL' 1" : "'FILL' 0" }}
            >
              military_tech
            </span>
            <span>Calificaciones</span>
          </button>
        </div>

        {/* TAB 1: ACTIVIDADES */}
        {activeTab === 'actividades' && (
          <section className="flex flex-col gap-4">
            {/* Unit Header */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-primary-container"></span>
                <h4 className="font-headline text-[15px] font-bold text-on-surface">
                  Unidad 1: Requerimientos y Análisis del Software
                </h4>
              </div>
              <span className="font-mono text-[11px] text-outline font-semibold">2 Tareas</span>
            </div>

            {/* Activity 1.2: Matriz de Trazabilidad (Pendiente) */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-[#e3e8f3] flex flex-col gap-3 relative">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-mono text-[11px] text-primary-container font-bold">
                    ACTIVIDAD 1.2
                  </span>
                  <h5 className="font-headline text-[16px] font-bold text-on-surface mt-0.5">
                    Matriz de Trazabilidad de Requisitos
                  </h5>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-secondary-container text-[#0c0c5d] font-headline text-[11px] font-extrabold tracking-wide uppercase shrink-0 shadow-xs">
                  Pendiente
                </span>
              </div>

              <p className="font-body text-[13px] text-on-surface-variant leading-relaxed">
                Estructurar la matriz de trazabilidad bidireccional conectando requerimientos de usuario, casos de uso y pruebas unitarias preliminares según IEEE 830.
              </p>

              {/* Time Metadata Box */}
              <div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col gap-1.5 border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-body text-[12px] text-outline flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px]">calendar_today</span>
                    Subido
                  </span>
                  <span className="font-mono text-[11px] text-on-surface font-semibold">15 Oct 2026</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                  <span className="font-body text-[12px] text-error flex items-center gap-1.5 font-semibold">
                    <span className="material-symbols-outlined text-[15px]">timer</span>
                    Vence
                  </span>
                  <span className="font-mono text-[11px] text-error font-bold">
                    25 Oct 2026 • 23:59 hrs
                  </span>
                </div>
              </div>

              {/* Download Rubric File */}
              <div
                onClick={() => onDownloadPdf('Rubrica_Evaluacion_Matriz_v2.pdf')}
                className="bg-surface-container-high/60 rounded-lg p-2.5 flex items-center justify-between hover:bg-surface-container-high transition-colors cursor-pointer border border-[#dfe1f9]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-md bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-body text-[12px] text-on-surface font-bold truncate">
                      Rubrica_Evaluacion_Matriz_v2.pdf
                    </span>
                    <span className="font-mono text-[10px] text-outline">540 KB • Documento Oficial</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[20px] text-primary-container shrink-0 ml-2">
                  download
                </span>
              </div>

              {/* CTA Upload Activity Button */}
              <button
                onClick={() => onOpenUploadModal('Matriz de Trazabilidad de Requisitos')}
                className="w-full h-12 bg-primary-container hover:bg-black active:scale-[0.98] transition-all rounded-xl flex items-center justify-center gap-2 shadow-md"
              >
                <span className="material-symbols-outlined text-[20px] text-secondary-container">
                  upload_file
                </span>
                <span className="font-headline text-[13px] font-bold text-secondary-container tracking-wide">
                  Subir Entrega de Actividad
                </span>
              </button>
            </div>

            {/* Activity 1.1: Diagrama de Casos de Uso (Calificado) */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-[#e3e8f3] flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-mono text-[11px] text-outline font-semibold">ACTIVIDAD 1.1</span>
                  <h5 className="font-headline text-[15px] font-bold text-on-surface mt-0.5">
                    Diagrama de Casos de Uso y Escenarios
                  </h5>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-primary-fixed text-primary-container font-mono text-[11px] font-bold tracking-tight shrink-0 flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-[13px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  Calificado • 98/100
                </span>
              </div>

              <p className="font-body text-[13px] text-on-surface-variant leading-relaxed">
                Modelado formal en notación UML de los módulos de autenticación, gestión de reservas y roles jerárquicos.
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-outline">
                <span className="font-mono text-[11px] flex items-center gap-1 text-emerald-700 font-semibold">
                  <span className="material-symbols-outlined text-[15px]">task_alt</span>
                  Entregado a tiempo
                </span>
                <button
                  onClick={() => onShowToast('Retroalimentación: Excelente nivel de abstracción y especificación UML.')}
                  className="font-mono text-[11px] text-primary-container font-bold hover:underline"
                >
                  Ver Retroalimentación
                </button>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: MATERIALES */}
        {activeTab === 'materiales' && (
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between pt-1">
              <h4 className="font-headline text-[15px] font-bold text-on-surface">
                Repositorio y Documentación
              </h4>
              <span className="font-mono text-[11px] text-outline font-semibold">4 Recursos</span>
            </div>

            <div
              onClick={() => onDownloadPdf('Syllabus_2026.pdf')}
              className="bg-surface-container-lowest rounded-xl p-3.5 shadow-sm border border-[#e3e8f3] flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container shrink-0">
                  <span className="material-symbols-outlined text-[20px]">menu_book</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-headline text-[13px] font-bold text-on-surface truncate">
                    Syllabus y Programa Académico 2026
                  </span>
                  <span className="font-mono text-[11px] text-outline">PDF • 1.2 MB</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary-container">file_download</span>
            </div>

            <div
              onClick={() => onDownloadPdf('Diapositivas_Metodologias_Agiles.pptx')}
              className="bg-surface-container-lowest rounded-xl p-3.5 shadow-sm border border-[#e3e8f3] flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container shrink-0">
                  <span className="material-symbols-outlined text-[20px]">slideshow</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-headline text-[13px] font-bold text-on-surface truncate">
                    Diapositivas Unidad 1: Metodologías Ágiles
                  </span>
                  <span className="font-mono text-[11px] text-outline">PPTX • 8.4 MB</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary-container">file_download</span>
            </div>

            <div
              onClick={() => onShowToast('Abriendo repositorio GitHub institucional...')}
              className="bg-surface-container-lowest rounded-xl p-3.5 shadow-sm border border-[#e3e8f3] flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container shrink-0">
                  <span className="material-symbols-outlined text-[20px]">terminal</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-headline text-[13px] font-bold text-on-surface truncate">
                    Repositorio GitHub Oficial del Laboratorio
                  </span>
                  <span className="font-mono text-[11px] text-outline">Enlace Externo • Git CLI</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary-container">open_in_new</span>
            </div>
          </section>
        )}

        {/* TAB 3: CALIFICACIONES */}
        {activeTab === 'calificaciones' && (
          <section className="flex flex-col gap-3 pb-6">
            <div className="bg-primary-container text-on-primary rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <span className="font-headline text-[10px] text-secondary-container uppercase font-bold tracking-wider">
                  Promedio Acumulado
                </span>
                <h4 className="font-headline text-[26px] font-bold text-white mt-0.5">
                  9.8 <span className="text-[14px] font-normal text-surface-variant">/ 10.0</span>
                </h4>
              </div>
              <div className="text-right">
                <span className="font-headline text-[10px] text-surface-variant uppercase font-bold">
                  Estatus
                </span>
                <p className="font-mono text-[13px] text-secondary-container font-bold">
                  Aprobatorio
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-[#e3e8f3] flex flex-col gap-2.5">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="font-body text-[13px] text-on-surface font-medium">Actividad 1.1 Diagrama UML</span>
                <span className="font-mono text-[13px] text-primary-container font-bold">98 / 100</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="font-body text-[13px] text-outline">Actividad 1.2 Matriz Trazabilidad</span>
                <span className="font-mono text-[12px] text-secondary-container bg-primary-container px-2 py-0.5 rounded font-bold">
                  Pendiente
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="font-body text-[13px] text-outline">Examen Parcial Teórico</span>
                <span className="font-mono text-[11px] text-outline font-semibold">No iniciado</span>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
