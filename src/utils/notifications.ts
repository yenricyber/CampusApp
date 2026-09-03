/**
 * Módulo de utilidades para notificaciones de audio sintetizado y alertas nativas del navegador.
 */

let audioContextInstance: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioContextInstance) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      audioContextInstance = new AudioCtx();
    }
  }
  if (audioContextInstance && audioContextInstance.state === 'suspended') {
    audioContextInstance.resume();
  }
  return audioContextInstance;
};

/**
 * Reproduce un timbre armónico de notificaciones (Tono de 2 campanas armónicas E5 -> B5)
 * usando la Web Audio API nativa sin requerir archivos MP3 externos.
 */
export const playNotificationChime = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      // Envelope de ataque suave y resonancia tipo campana
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.35, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    // Nota 1: Mi (E5 - 659.25 Hz)
    playTone(659.25, now, 0.7);
    // Nota 2: Si (B5 - 987.77 Hz)
    playTone(987.77, now + 0.18, 1.1);
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
