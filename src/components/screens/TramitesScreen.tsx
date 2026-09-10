import React from 'react';

interface TramitesScreenProps {
  onShowToast: (message: string) => void;
  onDownloadPdf: (filename: string) => void;
  onGenerateQrDoc: (docType: string) => void;
}

export const TramitesScreen: React.FC<TramitesScreenProps> = ({
  onShowToast,
  onDownloadPdf,
  onGenerateQrDoc,
}) => {
  return (
    <div className="flex flex-col w-full px-4 gap-4 pb-28 pt-20 max-w-md mx-auto">
      {/* Subheader Institucional y Registro Histórico */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary-container shadow-[0_0_6px_#fce010]"></span>
            <span className="font-headline text-[10px] uppercase text-on-surface-variant font-bold tracking-wider">
              Gestión Académica
            </span>
          </div>
          <h2 className="font-headline text-[22px] font-bold text-on-surface">
            Trámites y Kárdex
          </h2>
        </div>

        <button
          onClick={() => onShowToast('Mostrando historial de 3 trámites recientes aprobados')}
          aria-label="Historial de solicitudes"
          className="flex items-center gap-1.5 px-3 h-9 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors shadow-xs active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">history</span>
          <span className="font-headline text-[11px] font-bold">Historial</span>
        </button>
      </div>

      {/* Tarjeta Resumen: Kárdex Oficial Certificado */}
      <section className="relative overflow-hidden rounded-2xl bg-primary-container text-on-primary p-5 shadow-md border border-white/10">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-surface-tint/20 blur-2xl pointer-events-none"></div>
        <div className="absolute right-3 bottom-3 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[120px] text-on-primary">verified_user</span>
        </div>

        <div className="relative z-10 flex flex-col gap-4">
          {/* Identificador de Registro y Sello */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] uppercase text-on-primary-container tracking-wider font-semibold">
                Matrícula Escolar
              </span>
              <span className="font-mono text-[18px] font-bold text-on-primary tracking-wide">
                2021-ISC-90824
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-md border border-white/10">
              <span className="material-symbols-outlined text-secondary-container text-[16px]">
                verified
              </span>
              <span className="font-headline text-[10px] uppercase text-secondary-container tracking-wider font-bold">
                Certificado SAT
              </span>
            </div>
          </div>

          {/* Métricas Kárdex */}
          <div className="grid grid-cols-3 gap-2 bg-black/20 rounded-xl p-3 backdrop-blur-sm border border-white/5 text-center">
            <div className="flex flex-col items-start pl-1">
              <span className="font-body text-[11px] text-on-primary-container">Promedio</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-headline text-[22px] font-bold text-secondary-container">
                  9.42
                </span>
                <span className="font-mono text-[11px] text-on-primary-container">/10</span>
              </div>
              <span className="font-headline text-[10px] text-secondary-container uppercase font-bold tracking-tight">
                Sobresaliente
              </span>
            </div>

            <div className="flex flex-col items-start pl-2 border-l border-white/10">
              <span className="font-body text-[11px] text-on-primary-container">Avance</span>
              <div className="flex items-baseline gap-0.5 mt-0.5">
                <span className="font-headline text-[22px] font-bold text-on-primary">74</span>
                <span className="font-mono text-[11px] text-on-primary-container">%</span>
              </div>
              <span className="font-headline text-[10px] text-on-primary-container uppercase font-bold">
                8º Semestre
              </span>
            </div>

            <div className="flex flex-col items-start pl-2 border-l border-white/10">
              <span className="font-body text-[11px] text-on-primary-container">Créditos</span>
              <div className="flex items-baseline gap-0.5 mt-0.5">
                <span className="font-headline text-[18px] font-bold text-on-primary">210</span>
                <span className="font-mono text-[11px] text-on-primary-container">/340</span>
              </div>
              <span className="font-headline text-[10px] text-on-primary-container uppercase font-bold">
                Aprobados
              </span>
            </div>
          </div>

          {/* Barra gráfica de avance */}
          <div className="w-full flex flex-col gap-1.5">
            <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-secondary-container transition-all duration-700 shadow-[0_0_8px_#fce010]"
                style={{ width: '74%' }}
              ></div>
            </div>
            <div className="flex justify-between font-mono text-[10px] text-on-primary-container">
              <span>Tronco Terminal</span>
              <span>130 Créditos restantes</span>
            </div>
          </div>

          {/* Botón de Descarga Kárdex */}
          <button
            onClick={() => onDownloadPdf('Kardex_Oficial_Sofia_Martinez_Certificado.pdf')}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-secondary-container text-[#0c0c5d] hover:brightness-105 active:scale-[0.99] transition-all font-headline text-[13px] font-bold shadow-[0_4px_14px_rgba(252,224,16,0.3)]"
          >
            <span className="material-symbols-outlined text-[20px] text-[#0c0c5d]">
              file_download
            </span>
            <span>Descargar Kárdex Certificado (PDF)</span>
          </button>

          {/* Pie de integridad institucional */}
          <div className="flex items-center justify-center gap-1.5 text-on-primary-container font-mono text-[10px]">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            <span>Firma digital SHA-256 válida para trámites externos</span>
          </div>
        </div>
      </section>

      {/* Catálogo de Constancias Oficiales */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container text-[20px]">
              description
            </span>
            <h3 className="font-headline text-[16px] font-bold text-on-surface">
              Constancias con Validación QR
            </h3>
          </div>
          <span className="font-headline text-[11px] uppercase text-[#6b5f00] font-extrabold tracking-wide bg-amber-100/80 px-2 py-0.5 rounded">
            1-Clic
          </span>
        </div>

        {/* Lista de Constancias en Stack */}
        <div className="flex flex-col gap-3">
          {/* Tarjeta 1: Simple */}
          <article className="flex flex-col p-4 rounded-xl bg-surface-container-lowest shadow-sm border border-[#e3e8f3] gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary-container text-[22px]">
                  badge
                </span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-headline text-[15px] font-bold text-on-surface truncate">
                    Constancia de Estudios Simple
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-mono text-[10px] shrink-0 font-medium">
                    Vig. 90 días
                  </span>
                </div>
                <p className="font-body text-[12px] text-on-surface-variant mt-0.5 leading-relaxed">
                  Acredita tu condición como estudiante activo del periodo escolar en curso sin desglose de materias.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2.5 bg-surface-container-low/50 -mx-4 -mb-4 px-4 pb-3 rounded-b-xl border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  qr_code_2
                </span>
                <span className="font-mono text-[11px]">Sello Criptográfico QR</span>
              </div>
              <button
                onClick={() => onGenerateQrDoc('Constancia de Estudios Simple')}
                className="px-3.5 h-9 flex items-center gap-1.5 rounded-lg bg-primary-container text-on-primary hover:bg-black transition-all active:scale-95 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary-container">
                  auto_mode
                </span>
                <span className="font-headline text-[11px] font-bold tracking-wide">
                  Generar con QR
                </span>
              </button>
            </div>
          </article>

          {/* Tarjeta 2: Calificaciones y Promedio */}
          <article className="flex flex-col p-4 rounded-xl bg-surface-container-lowest shadow-sm border border-[#e3e8f3] gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary-container text-[22px]">
                  format_list_numbered
                </span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-headline text-[15px] font-bold text-on-surface truncate">
                    Con Calificaciones y Promedio
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-mono text-[10px] shrink-0 font-medium">
                    Vig. Semestral
                  </span>
                </div>
                <p className="font-body text-[12px] text-on-surface-variant mt-0.5 leading-relaxed">
                  Incluye promedio ponderado, desglose del ciclo actual y firma electrónica de la Dirección de Servicios Escolares.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2.5 bg-surface-container-low/50 -mx-4 -mb-4 px-4 pb-3 rounded-b-xl border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  qr_code_2
                </span>
                <span className="font-mono text-[11px]">Validación Externa Activa</span>
              </div>
              <button
                onClick={() => onGenerateQrDoc('Constancia con Calificaciones y Promedio')}
                className="px-3.5 h-9 flex items-center gap-1.5 rounded-lg bg-primary-container text-on-primary hover:bg-black transition-all active:scale-95 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary-container">
                  auto_mode
                </span>
                <span className="font-headline text-[11px] font-bold tracking-wide">
                  Generar con QR
                </span>
              </button>
            </div>
          </article>

          {/* Tarjeta 3: Seguro IMSS */}
          <article className="flex flex-col p-4 rounded-xl bg-surface-container-lowest shadow-sm border border-[#e3e8f3] gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary-container text-[22px]">
                  health_and_safety
                </span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-headline text-[15px] font-bold text-on-surface truncate">
                    Vigencia Seguro Facultativo (IMSS)
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-container/30 text-[#6b5f00] font-mono text-[10px] font-bold shrink-0">
                    NSS Vigente
                  </span>
                </div>
                <p className="font-body text-[12px] text-on-surface-variant mt-0.5 leading-relaxed">
                  Comprobante de afiliación médica estudiantil reglamentaria con clave de seguridad y folio institucional.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2.5 bg-surface-container-low/50 -mx-4 -mb-4 px-4 pb-3 rounded-b-xl border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  qr_code_2
                </span>
                <span className="font-mono text-[11px]">Vinculado a Registro IMSS</span>
              </div>
              <button
                onClick={() => onGenerateQrDoc('Vigencia de Seguro Facultativo IMSS')}
                className="px-3.5 h-9 flex items-center gap-1.5 rounded-lg bg-primary-container text-on-primary hover:bg-black transition-all active:scale-95 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary-container">
                  auto_mode
                </span>
                <span className="font-headline text-[11px] font-bold tracking-wide">
                  Generar con QR
                </span>
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* Módulo de Finanzas y Colegiaturas */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-container text-[20px]">
            account_balance_wallet
          </span>
          <h3 className="font-headline text-[16px] font-bold text-on-surface">
            Finanzas y Colegiaturas
          </h3>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm border border-[#e3e8f3] flex flex-col gap-3">
          {/* Status Banner */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-[#0c0c5d]">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-[10px] uppercase text-on-surface-variant font-bold">
                  Estatus Semestral
                </span>
                <span className="font-headline text-[14px] font-bold text-on-surface">
                  Sin adeudos pendientes
                </span>
              </div>
            </div>
            <span className="font-mono text-[11px] font-bold text-secondary-container bg-primary-container px-2 py-0.5 rounded">
              Otoño 2026
            </span>
          </div>

          {/* Próximo Vencimiento & Captura */}
          <div className="flex flex-col gap-1.5 text-xs text-on-surface-variant font-body">
            <div className="flex justify-between items-center py-0.5">
              <span>Próxima inscripción regular:</span>
              <span className="font-mono text-[12px] text-on-surface font-semibold">
                15 Noviembre 2026
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-t border-slate-100">
              <span>Monto estipulado de cuota:</span>
              <span className="font-mono text-[13px] text-on-surface font-bold">
                $4,850.00 MXN
              </span>
            </div>
          </div>

          {/* Acción de captura bancaria */}
          <button
            onClick={() => onShowToast('Línea de captura bancaria generada y copiada al portapapeles: #7729-0192-3849')}
            className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-surface-container text-primary-container hover:bg-surface-container-high transition-colors font-headline text-[13px] font-bold active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            <span>Consultar Línea de Captura Bancaria</span>
          </button>
        </div>
      </section>
    </div>
  );
};
