import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UniversidadLatinoLogo } from '../common/UniversidadLatinoLogo';

interface SplashScreenProps {
  onFinish: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = 2400,
}) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Increment loading progress smoothly
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, durationMs / 22);

    // Trigger exit transition before finishing
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, durationMs - 350);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, durationMs);

    return () => {
      clearInterval(interval);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [durationMs, onFinish]);

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      onFinish();
    }, 150);
  };

  return (
    <AnimatePresence>
      <motion.div
        id="splash-screen"
        onClick={handleSkip}
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-primary-container text-white select-none cursor-pointer overflow-hidden"
        style={{ backgroundColor: '#0c0c5d' }}
      >
        {/* Subtle Decorative Background Rings (Academic Seal Motif) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-10">
          <div className="w-[520px] h-[520px] rounded-full border border-white/20 animate-spin" style={{ animationDuration: '45s' }}></div>
          <div className="w-[380px] h-[380px] rounded-full border border-dashed border-white/30 absolute"></div>
          <div className="w-[240px] h-[240px] rounded-full border border-white/20 absolute"></div>
        </div>


        {/* Center: Logo & CampusApp Brand */}
        <div className="flex flex-col items-center justify-center z-10 px-4 text-center my-auto">
          {/* Emblem Icon with Subtle Spring Scale In */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: 0.1,
            }}
            className="relative mb-5"
          >
            {/* Soft Glow behind Emblem */}
            <div className="absolute -inset-2 rounded-3xl bg-secondary-container/20 blur-xl"></div>

            {/* Emblem Card */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white/95 p-2 border border-white/30 shadow-[0_16px_40px_rgba(0,0,0,0.5)] flex items-center justify-center backdrop-blur-md">
              <UniversidadLatinoLogo size={100} />
            </div>
          </motion.div>

          {/* Typography: CampusApp */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <h1 className="font-headline font-black text-4xl sm:text-5xl tracking-tight text-white flex items-center">
              <span>Campus</span>
              <span className="text-secondary-container drop-shadow-[0_2px_10px_rgba(252,224,16,0.3)]">
                App
              </span>
            </h1>

            <p className="font-body text-xs sm:text-sm text-slate-300 mt-2 font-medium tracking-wide">
              Portal Estudiantil &amp; Credencial Digital
            </p>

            <div className="flex items-center gap-2 mt-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-secondary-container/90 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                Ciclo Otoño 2026
              </span>
            </div>
          </motion.div>
        </div>

        {/* Bottom Loading Progress & Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="w-full max-w-xs px-6 pb-12 flex flex-col items-center gap-3 z-10"
        >
          {/* Slim Progress Bar */}
          <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-secondary-container rounded-full shadow-[0_0_8px_#fce010]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          <div className="flex items-center justify-between w-full text-[11px] font-mono text-white/65">
            <span className="flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Iniciando servicios...</span>
            </span>
            <span>{progress}%</span>
          </div>

          <span className="text-[10px] font-body text-white/40 mt-1">
            Toca en cualquier parte para continuar
          </span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
