import { PushNotification } from '../types';

export const mockPushNotificationsPool: PushNotification[] = [
  // 1. Exam / Deadline Alert (Urgent)
  {
    id: 'push-exam-1',
    category: 'exam',
    badge: 'VENCE HOY',
    title: '⏰ Entrega de Proyecto: Base de Datos II',
    message: 'Proyecto Fase 1: Arquitectura y Modelado vence hoy a las 23:59 hrs. Quedan menos de 4 horas en plataforma.',
    timestamp: 'Ahora',
    targetScreen: 'calendario',
    actionText: 'Ver Entrega en Calendario',
    courseId: 'bd-602',
  },
  // 2. Official Announcement (Classroom relocation)
  {
    id: 'push-ann-1',
    category: 'announcement',
    badge: 'AVISO RECTORÍA',
    title: '📢 Reubicación de Aula: Ing. de Software',
    message: 'La sesión extraordinaria de hoy se impartirá en el Edificio C (Lab 4) por mantenimiento programado.',
    timestamp: 'Hace 2 min',
    targetScreen: 'avisos',
    actionText: 'Ver Comunicado Oficial',
    courseId: 'is-601',
  },
  // 3. Exam / Deadline Alert (Team submission)
  {
    id: 'push-exam-2',
    category: 'exam',
    badge: 'EN 3 DÍAS',
    title: '📝 Actividad 1.2: Matriz de Trazabilidad',
    message: 'Entrega grupal de Ingeniería de Software cierra el 17 Oct a las 18:00 hrs. Revisa la rúbrica institucional.',
    timestamp: 'Ahora',
    targetScreen: 'detalle-materia',
    actionText: 'Abrir Materia y Rúbrica',
    courseId: 'is-601',
  },
  // 4. Official Announcement (Scholarship)
  {
    id: 'push-ann-2',
    category: 'announcement',
    badge: 'SERVICIOS ESCOLARES',
    title: '🏛️ Convocatoria Beca Santander 2027',
    message: 'Abierto el periodo de postulaciones de intercambio y apoyo económico para alumnos con promedio > 9.0.',
    timestamp: 'Hace 5 min',
    targetScreen: 'avisos',
    actionText: 'Consultar Requisitos',
  },
  // 5. Exam / Lab Assessment Alert
  {
    id: 'push-exam-3',
    category: 'exam',
    badge: 'PRÓXIMA EVALUACIÓN',
    title: '🔬 Evaluación Práctica: Redes de Computadoras',
    message: 'Reporte de Práctica 3 (Enrutamiento OSPF) programado para el 22 Oct en Laboratorio B-204.',
    timestamp: 'Ahora',
    targetScreen: 'calendario',
    actionText: 'Ver en Calendario',
    courseId: 'rc-603',
  },
  // 6. Official Financial / Academic Reminder
  {
    id: 'push-ann-3',
    category: 'payment',
    badge: 'FINANZAS',
    title: '💳 Próximo Periodo: Reinscripción Regular',
    message: 'Fecha límite de cuota regular sin recargo el 15 de Noviembre. Tu línea de captura ya está generada.',
    timestamp: 'Ahora',
    targetScreen: 'tramites',
    actionText: 'Ver Línea de Captura',
  },
  // 7. Security & Digital ID Notice
  {
    id: 'push-ann-4',
    category: 'announcement',
    badge: 'ACCESO AL CAMPUS',
    title: '🛡️ Torniquetes NFC y Modo Offline',
    message: 'Sincronización matutina completa. Tu credencial digital cuenta con validador criptográfico SHA-256 activo.',
    timestamp: 'Ahora',
    targetScreen: 'credencial',
    actionText: 'Ver Credencial Digital',
  },
];
