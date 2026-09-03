export type ScreenType = 
  | 'inicio' 
  | 'calendario' 
  | 'registro-rapido' 
  | 'detalle-tarea' 
  | 'login' 
  | 'registro' 
  | 'recuperar'
  | 'perfil';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface AcademicTask {
  id: string;
  code: string; // e.g., 'ING-302', 'HUM-110'
  courseName: string; // e.g., 'Ingeniería de Software'
  moduleOrDetail: string; // e.g., 'Módulo 3: Requisitos'
  title: string;
  description: string;
  dueTimeText: string; // e.g., 'Hoy, 23:59 hrs', '23:59 hrs'
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:mm
  status: 'pendiente' | 'en_progreso' | 'terminada';
  priority: 'baja' | 'media' | 'urgente';
  urgentBadge?: string; // '¡Cierra hoy!', 'Urgente'
  timeRemaining?: string; // 'Quedan 28 hrs', 'Faltan 4 horas'
  attachmentsCount?: number;
  attachmentName?: string;
  attachmentSize?: string;
  progressPercent?: number;
  collaborators?: string[];
  partnerName?: string;
  partnerPhoto?: string;
  professorName?: string;
  professorPhoto?: string;
  grade?: string; // e.g., 'Nota: 10/10'
  subtasks?: Subtask[];
  timelineSection?: 'hoy' | 'manana' | 'proxima' | 'reciente';
  category?: 'dev' | 'humanities' | 'networks' | 'math' | 'all';
  reminderMinutes?: number; // Minutes before due date/time to alert (default 10)
  notified?: boolean; // Flag if reminder chime/notification was already sent
}

export interface UserProfile {
  name: string;
  studentId: string;
  program: string;
  semester: string;
  campus: string;
  avatarUrl: string;
  streakDays: number;
}
