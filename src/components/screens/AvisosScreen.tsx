import React, { useState } from 'react';
import { initialNotices } from '../../data/mockData';
import { Notice } from '../../types';

interface AvisosScreenProps {
  onShowToast: (message: string) => void;
  onDownloadPdf: (filename: string) => void;
}

export const AvisosScreen: React.FC<AvisosScreenProps> = ({
  onShowToast,
  onDownloadPdf,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [notices, setNotices] = useState<Notice[]>(initialNotices);

  const categories = [
    'Todos (3)',
    'Cambios de Aula',
    'Servicios Escolares',
    'Avisos de Dirección',
    'Fechas de Pago',
  ];

  const handleMarkAllAsRead = () => {
    setNotices((prev) => prev.map((n) => ({ ...n, read: true })));
    onShowToast('Todos los comunicados marcados como leídos');
  };

  const handleShareNotice = (title: string) => {
    if (navigator.share) {
      navigator
        .share({
          title: `Aviso Institucional - ${title}`,
          text: 'Consulta este aviso oficial en la plataforma universitaria Campus Conectado.',
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      onShowToast('Enlace de comunicado copiado al portapapeles');
    }
  };

  const filteredNotices = notices.filter((notice) => {
    if (selectedCategory === 'Todos' || selectedCategory === 'Todos (3)') return true;
    return notice.category === selectedCategory;
  });

  return (
    <div className="flex flex-col w-full px-4 gap-4 pb-28 pt-20 max-w-md mx-auto">
      {/* Verified Institutional Banner */}
      <section className="w-full bg-primary-container text-on-secondary rounded-xl p-4 shadow-[0_4px_14px_rgba(10,10,92,0.12)] relative overflow-hidden border border-white/10">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 pointer-events-none">
          <svg className="w-full h-full text-secondary-container" fill="currentColor" viewBox="0 0 100 100">
            <path d="M50 0 L93 25 L93 75 L50 100 L7 75 L7 25 Z" />
          </svg>
        </div>

        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
              <svg
                className="w-5 h-5 text-secondary-container"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-headline text-[16px] text-white font-bold tracking-tight">
                  Canal Oficial Institucional
                </h2>
                <svg
                  className="w-4 h-4 text-secondary-container inline-block shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  />
                </svg>
              </div>
              <p className="font-body text-[11px] text-surface-container-high/80 leading-snug">
                Sincronización directa y validada por Rectoría y Servicios Escolares
              </p>
            </div>
          </div>
        </div>

        {/* Quick Status Counter */}
        <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-surface-variant">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse shadow-[0_0_6px_#fce010]"></span>
            <span className="font-headline text-[10px] text-secondary-container uppercase font-bold tracking-wider">
              Transmisión Activa
            </span>
          </div>

          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-1.5 text-surface-container-highest hover:text-secondary-container transition-colors py-1 px-2 rounded-lg active:bg-white/10 cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <polyline points="20 6 9 17 4 12" />
              <polyline points="20 12 11 21 8 18" />
            </svg>
            <span className="font-headline text-[10px] tracking-wide font-bold">Marcar leídos</span>
          </button>
        </div>
      </section>

      {/* Horizontal Filter Bar */}
      <section className="w-full">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isActive =
              selectedCategory === cat || (cat === 'Todos (3)' && selectedCategory === 'Todos');
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat.replace(/\s\(\d+\)$/, ''))}
                className={`shrink-0 px-3.5 py-1.5 rounded-full font-headline text-[11px] tracking-wide transition-all ${
                  isActive
                    ? 'bg-primary-container text-secondary-container font-bold shadow-[0_2px_8px_rgba(10,10,92,0.18)]'
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest font-semibold'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Notice Feed List */}
      <section className="w-full flex flex-col gap-3">
        {filteredNotices.map((notice) => {
          if (notice.id === 'not-1') {
            return (
              <article
                key={notice.id}
                className="group relative bg-surface-container-lowest rounded-xl p-4 shadow-[0_4px_14px_rgba(10,10,92,0.06)] border border-[#e3e8f3] flex flex-col gap-2.5 transition-all active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-secondary-container/20 text-[#0c0c5d]">
                      <svg
                        className="w-4 h-4 font-bold"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.25"
                        viewBox="0 0 24 24"
                      >
                        <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                        <line x1="12" x2="12" y1="8" y2="12" />
                        <line x1="12" x2="12.01" y1="16" y2="16" />
                      </svg>
                    </span>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-secondary-container text-on-secondary-container font-headline text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                          Urgente
                        </span>
                        <span className="text-on-surface-variant font-headline text-[11px] font-semibold">
                          Cambio de Aula
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-on-surface-variant">Hace 15 min</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleShareNotice(notice.title)}
                    aria-label="Compartir comunicado"
                    className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
                    </svg>
                  </button>
                </div>

                <div className="pl-10 flex flex-col gap-1">
                  <h3 className="font-headline text-[15px] text-on-surface font-bold leading-snug">
                    {notice.title}
                  </h3>
                  <p className="font-body text-[13px] text-on-surface-variant leading-relaxed">
                    La sesión de hoy se impartirá excepcionalmente en el{' '}
                    <span className="font-bold text-on-surface">Laboratorio 4, Edificio C</span> por mantenimiento de proyectores en aula habitual.
                  </p>
                  <div className="mt-2 flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low text-on-surface border border-slate-100">
                    <svg
                      className="w-4 h-4 text-primary-container shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="font-mono text-[11px] font-semibold text-slate-800">
                      Edificio C - Planta Alta (Lab 4)
                    </span>
                  </div>
                </div>
              </article>
            );
          }

          if (notice.id === 'not-2') {
            return (
              <article
                key={notice.id}
                className="group relative bg-surface-container-lowest rounded-xl p-4 shadow-[0_4px_14px_rgba(10,10,92,0.06)] border border-[#e3e8f3] flex flex-col gap-2.5 transition-all active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-container text-secondary-container">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="m10 15 5-3-5-3v6Z" />
                      </svg>
                    </span>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-surface-container-high text-primary-container font-headline text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                          Dirección
                        </span>
                        <span className="text-on-surface-variant font-headline text-[11px] font-semibold">
                          Internacional
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-on-surface-variant">Hoy 08:30 AM</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleShareNotice(notice.title)}
                    aria-label="Compartir comunicado"
                    className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
                    </svg>
                  </button>
                </div>

                <div className="pl-10 flex flex-col gap-1">
                  <h3 className="font-headline text-[15px] text-on-surface font-bold leading-snug">
                    {notice.title}
                  </h3>
                  <p className="font-body text-[13px] text-on-surface-variant leading-relaxed">
                    {notice.content}
                  </p>
                  <div className="mt-2 flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low border border-slate-100">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-primary-container"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                      </svg>
                      <span className="font-mono text-[11px] text-on-surface font-medium">
                        Cierre: 31 de Marzo, 2027
                      </span>
                    </div>

                    <button
                      onClick={() => onDownloadPdf('Convocatoria_Santander_2027.pdf')}
                      className="font-headline text-[11px] text-primary-container font-bold underline flex items-center gap-1"
                    >
                      <span>Bases PDF</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M7 17l9.2-9.2M17 17V7H7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            );
          }

          // Default / Card 3 (Servicios Escolares)
          return (
            <article
              key={notice.id}
              className="group relative bg-surface-container-lowest rounded-xl p-4 shadow-[0_4px_14px_rgba(10,10,92,0.06)] border border-[#e3e8f3] flex flex-col gap-2.5 transition-all active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-surface-container text-primary-container">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" x2="8" y1="13" y2="13" />
                      <line x1="16" x2="8" y1="17" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-surface-container-high text-on-surface-variant font-headline text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        Servicios Escolares
                      </span>
                      <span className="text-on-surface-variant font-headline text-[11px] font-semibold">
                        Trámites
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-on-surface-variant">Ayer</span>
                  </div>
                </div>

                <button
                  onClick={() => handleShareNotice(notice.title)}
                  aria-label="Compartir comunicado"
                  className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
                  </svg>
                </button>
              </div>

              <div className="pl-10 flex flex-col gap-1">
                <h3 className="font-headline text-[15px] text-on-surface font-bold leading-snug">
                  {notice.title}
                </h3>
                <p className="font-body text-[13px] text-on-surface-variant leading-relaxed">
                  {notice.content}
                </p>
                <div className="mt-2 flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low border border-slate-100">
                  <svg
                    className="w-4 h-4 text-primary-container shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="font-mono text-[11px] text-on-surface font-medium">
                    Citas asignadas en portal a partir de las 18:00 hrs
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
};
