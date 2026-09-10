export type AppScreen =
  | 'splash'
  | 'login'
  | 'registro'
  | 'materias'
  | 'calendario'
  | 'avisos'
  | 'tramites'
  | 'credencial'
  | 'tareas'
  | 'detalle-materia';

export type ScreenType = AppScreen | 'inicio' | 'perfil';
export type UserProfile = StudentProfile;
export type AcademicTask = UserTask;
export type Subtask = any;

export interface Course {
  id: string;
  code: string;
  name: string;
  type: 'Obligatoria' | 'Especialidad';
  professor: string;
  professorEmail: string;
  professorTitle: string;
  classroom: string;
  schedule: string;
  progress: number;
  pendingCount: number;
  isRelocated?: boolean;
  relocationText?: string;
  units: CourseUnit[];
  gradeAverage: number;
}

export interface CourseUnit {
  id: string;
  title: string;
  activities: CourseActivity[];
}

export interface CourseActivity {
  id: string;
  number: string;
  title: string;
  description: string;
  status: 'pending' | 'graded' | 'submitted' | 'urgent';
  grade?: string;
  uploadedDate: string;
  dueDate: string;
  rubricName?: string;
  rubricSize?: string;
  feedback?: string;
}

export interface UserTask {
  id: string;
  usuario_id: string; // The matricula or ID of the student
  materia: string;
  titulo: string;
  fechaEntrega: string;
  estado: 'pendiente' | 'completada';
}

export interface Notice {
  id: string;
  category: 'Cambios de Aula' | 'Servicios Escolares' | 'Avisos de Dirección' | 'Fechas de Pago';
  tag: string;
  timeAgo: string;
  title: string;
  content: string;
  location?: string;
  deadline?: string;
  pdfLink?: string;
  notes?: string;
  isUrgent?: boolean;
  verifiedStamp?: string;
  read?: boolean;
}

export interface EvaluationItem {
  id: string;
  badge: string;
  badgeType: 'normal' | 'urgent' | 'soon';
  type: 'examen' | 'entregable';
  date?: string;
  dueTime: string;
  title: string;
  subject: string;
  location: string;
  actionText: string;
  actionIcon: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  type?: 'proyecto' | 'actividad' | 'examen' | 'practica';
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  category: 'exam' | 'announcement' | 'urgent' | 'payment';
  badge?: string;
  timestamp?: string;
  targetScreen?: AppScreen;
  actionText?: string;
  courseId?: string;
}

export type ToastPayload = string | PushNotification;

export interface StudentProfile {
  name: string;
  matricula: string;
  email?: string;
  career: string;
  semester: string;
  status: string;
  gpa: number;
  credits: {
    earned: number;
    total: number;
  };
  attendance: number;
  bloodType: string;
  validity: string;
  barcode: string;
  cryptoToken: string;
  avatarUrl: string;
}
