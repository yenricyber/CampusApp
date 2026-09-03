/**
 * Módulo de utilidades para notificaciones de audio sintetizado y alertas nativas del navegador.
 */

let audioContextInstance: AudioContext | null = null;

// Inicializar y reanudar el AudioContext tras cualquier interacción del usuario
export const unlockAudio = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      if (!audioContextInstance) {
        audioContextInstance = new AudioCtx();
      }
      if (audioContextInstance.state === 'suspended') {
        audioContextInstance.resume();
      }
    }
  } catch (err) {
    console.warn('AudioContext error:', err);
  }
};

if (typeof window !== 'undefined') {
  ['click', 'touchstart', 'keydown'].forEach((evt) => {
    window.addEventListener(evt, unlockAudio, { once: false, passive: true });
  });
}

/**
 * Reproduce un timbre armónico de notificaciones (Tono de campana de 3 notas: E5 -> G5 -> B5)
 * usando la Web Audio API nativa sin requerir archivos MP3 externos.
 */
export const playNotificationChime = () => {
  try {
    unlockAudio();
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = audioContextInstance || new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle'; // Sonido más brillante tipo timbre / carillón
      osc.frequency.setValueAtTime(freq, startTime);

      // Envelope de campana resonante
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.6, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    // Nota 1: E5 (659.25 Hz)
    playTone(659.25, now, 0.6);
    // Nota 2: G5 (783.99 Hz)
    playTone(783.99, now + 0.15, 0.6);
    // Nota 3: B5 (987.77 Hz)
    playTone(987.77, now + 0.30, 1.2);
  } catch (err) {
    console.error('Error al reproducir el timbre de audio:', err);
  }
};

/**
 * Solicita permiso al usuario para notificaciones nativas del navegador.
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (err) {
    console.error('Error solicitando permisos de notificación:', err);
    return false;
  }
};

/**
 * Lanza una notificación flotante del sistema operativo.
 */
export const sendNativeNotification = (title: string, body: string) => {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/logo.png',
        tag: 'campusapp-task-reminder'
      });
    } catch (e) {
      console.error('Error al enviar notificación nativa:', e);
    }
  }
};
