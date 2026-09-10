import { StudentProfile } from '../types';

export interface DbHealthResponse {
  status: 'ok' | 'error';
  database: 'connected' | 'disconnected';
  provider: string;
  version: string;
  databaseName: string;
  latencyMs?: number;
  isDbReady?: boolean;
  error?: string;
}

export const apiService = {
  /**
   * Check connection health with TiDB Cloud
   */
  async checkHealth(): Promise<DbHealthResponse> {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return await res.json();
    } catch (err: any) {
      return {
        status: 'error',
        database: 'disconnected',
        provider: 'TiDB Cloud',
        version: 'Unknown',
        databaseName: 'campus_app',
        error: err.message,
      };
    }
  },

  /**
   * Authenticate student with TiDB Cloud database
   */
  async login(email: string, password: string): Promise<{ success: boolean; studentProfile?: StudentProfile; message?: string; error?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Error al iniciar sesión' };
      }

      if (data.token) {
        localStorage.setItem('campus_app_token', data.token);
      }

      return {
        success: true,
        studentProfile: data.studentProfile,
        message: data.message,
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error de conexión con el servidor' };
    }
  },

  /**
   * Register new student in TiDB Cloud database
   */
  async register(params: {
    fullName: string;
    matricula: string;
    email: string;
    password: string;
    career: string;
    semester: string;
  }): Promise<{ success: boolean; student?: any; message?: string; error?: string }> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: params.fullName,
          matricula: params.matricula,
          email: params.email,
          password: params.password,
          career: params.career,
          semester: params.semester,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Error al registrar' };
      }

      if (data.token) {
        localStorage.setItem('campus_app_token', data.token);
      }

      return {
        success: true,
        student: data.student,
        message: data.message,
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error de conexión con el servidor' };
    }
  },

  /**
   * Fetch current student profile from TiDB Cloud
   */
  async getStudent(matricula?: string): Promise<StudentProfile | null> {
    try {
      const token = localStorage.getItem('campus_app_token');
      const res = await fetch(`/api/student`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  /**
   * Record activity submission into TiDB Cloud
   */
  async submitActivity(payload: {
    matricula: string;
    activityTitle: string;
    fileName: string;
    fileSize: string;
    comments?: string;
  }): Promise<{ success: boolean; message?: string }> {
    try {
      const token = localStorage.getItem('campus_app_token');
      const res = await fetch('/api/activities/submit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          activity_title: payload.activityTitle,
          file_name: payload.fileName,
          file_size: payload.fileSize,
          comments: payload.comments,
        }),
      });

      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },

  /**
   * Delete student account permanently from TiDB Cloud
   */
  async deleteAccount(matricula: string): Promise<{ success: boolean; error?: string }> {
    try {
      const token = localStorage.getItem('campus_app_token');
      const res = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ matricula }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Error al eliminar cuenta' };
      }

      localStorage.removeItem('campus_app_token');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error de conexión' };
    }
  },

  /**
   * Log out the current student
   */
  logout() {
    localStorage.removeItem('campus_app_token');
  }
};
