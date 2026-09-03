import { useState, useEffect } from 'react';
import { AcademicTask, ScreenType, UserProfile } from './types';
import { AppHeader } from './components/AppHeader';
import { BottomNav } from './components/BottomNav';
import { ScreenPickerModal } from './components/ScreenPickerModal';
import { NotificationsModal } from './components/NotificationsModal';
import { playNotificationChime, sendNativeNotification } from './utils/notifications';
import { InicioScreen } from './components/screens/InicioScreen';
import { CalendarioScreen } from './components/screens/CalendarioScreen';
import { RegistroRapidoScreen } from './components/screens/RegistroRapidoScreen';
import { DetalleTareaScreen } from './components/screens/DetalleTareaScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { RegistroScreen } from './components/screens/RegistroScreen';
import { RecuperarScreen } from './components/screens/RecuperarScreen';
import { PerfilScreen } from './components/screens/PerfilScreen';
import { TrabajoGrupalModal } from './components/TrabajoGrupalModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('login');
  const [screenHistory, setScreenHistory] = useState<ScreenType[]>(['login']);
  const [tasks, setTasks] = useState<AcademicTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<AcademicTask | null>(null);
  const [isScreenPickerOpen, setIsScreenPickerOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isTrabajoGrupalModalOpen, setIsTrabajoGrupalModalOpen] = useState(false);
  const [defaultReminderMinutes, setDefaultReminderMinutes] = useState(10);
  const [notificationToast, setNotificationToast] = useState<{ title: string; body: string } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setCurrentScreen('inicio');
      setScreenHistory(['inicio']);
    }
    fetchTasks();
  }, []);

  // Motor de notificaciones en tiempo real (revisa tareas cada 3 segundos)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      tasks.forEach((task) => {
        if (task.status === 'terminada' || task.notified) return;
        if (!task.dueDate || !task.dueTime) return;

        const parts = task.dueDate.split('-');
        const timeParts = task.dueTime.split(':');
        if (parts.length < 3 || timeParts.length < 2) return;

        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        const hh = parseInt(timeParts[0], 10);
        const mm = parseInt(timeParts[1], 10);

        const taskTime = new Date(y, m, d, hh, mm, 0);
        if (isNaN(taskTime.getTime())) return;

        const diffMs = taskTime.getTime() - now.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const leadMins = task.reminderMinutes !== undefined ? task.reminderMinutes : defaultReminderMinutes;

        // Disparar alarma si faltan <= leadMins minutos
        if (diffMins <= leadMins && diffMins >= -60) {
          playNotificationChime();
          sendNativeNotification(
            `🔔 ALARMA: Entrega en ${leadMins} min`,
            `"${task.title}" (${task.courseName}) vence a las ${task.dueTime} hrs.`
          );
          setNotificationToast({
            title: `🔔 ALARMA: ${task.title}`,
            body: `Vence a las ${task.dueTime} hrs (${task.courseName}) — Avisado ${leadMins} min antes`,
          });
          setTimeout(() => setNotificationToast(null), 10000);

          // Actualizar estado local inmediatamente para evitar duplicados
          setTasks((prev) =>
            prev.map((t) => (t.id === task.id ? { ...t, notified: true } : t))
          );
        }
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [tasks, defaultReminderMinutes]);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    fetchTasks(user.studentId);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setCurrentScreen('login');
    setScreenHistory(['login']);
    setTasks([]);
  };

  const fetchTasks = async (userStudentId?: string) => {
    try {
      const targetId = userStudentId || currentUser?.studentId || '';
      const url = targetId ? `/api/tasks?userId=${encodeURIComponent(targetId)}` : '/api/tasks';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const navigateTo = (screen: ScreenType) => {
    setScreenHistory((prev) => [...prev, screen]);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateBack = () => {
    if (screenHistory.length > 1) {
      const newHistory = [...screenHistory];
      newHistory.pop();
      const prev = newHistory[newHistory.length - 1];
      setScreenHistory(newHistory);
      setCurrentScreen(prev);
    } else {
      setCurrentScreen('inicio');
    }
  };

  const handleAddTask = async (newTask: AcademicTask) => {
    try {
      const taskWithUser = {
        ...newTask,
        userId: currentUser?.studentId || currentUser?.id || '',
      };
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskWithUser),
      });
      if (res.ok) {
        setTasks((prev) => [taskWithUser, ...prev]);
        setSelectedTask(taskWithUser);
      }
    } catch (error) {
      console.error('Failed to add task', error);
    }
  };

  const handleUpdateTask = async (updatedTask: AcademicTask) => {
    try {
      const res = await fetch(`/api/tasks/${updatedTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
      if (res.ok) {
        setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
        setSelectedTask(updatedTask);
      }
    } catch (error) {
      console.error('Failed to update task', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        if (selectedTask?.id === taskId) {
          setSelectedTask(null);
          navigateBack();
        }
      }
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  const handleToggleTaskCompleted = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const isDone = task.status === 'terminada';
    const newStatus = isDone ? 'pendiente' : 'terminada';
    const updatedTask = {
      ...task,
      status: newStatus as any,
      progressPercent: isDone ? 50 : 100,
    };
    handleUpdateTask(updatedTask);
  };

  const showBottomNav = currentScreen !== 'registro-rapido' && currentScreen !== 'detalle-tarea';

  return (
    <div className="w-full max-w-7xl mx-auto relative bg-surface min-h-screen text-on-surface flex flex-col font-sans shadow-2xl xl:rounded-xl xl:my-4 overflow-hidden">
      {/* Top persistent header */}
      {currentUser && (
        <AppHeader
          currentUser={currentUser}
          currentScreen={currentScreen}
          onNavigate={navigateTo}
          onBack={navigateBack}
          onLogout={handleLogout}
          onOpenScreenPicker={() => setIsScreenPickerOpen(true)}
        />
      )}

      {/* Screen Views matching user specifications EXACTLY */}
      <div className="flex-1 flex flex-col">
        {currentScreen === 'inicio' && currentUser && (
          <InicioScreen
            currentUser={currentUser}
            tasks={tasks}
            onNavigate={navigateTo}
            onSelectTask={(task) => {
              setSelectedTask(task);
              navigateTo('detalle-tarea');
            }}
            onToggleTaskCompleted={handleToggleTaskCompleted}
            onOpenNotifications={() => setIsNotificationsModalOpen(true)}
            onOpenTrabajoGrupal={() => setIsTrabajoGrupalModalOpen(true)}
          />
        )}

        {currentScreen === 'calendario' && (
          <CalendarioScreen
            tasks={tasks}
            onNavigate={navigateTo}
            onSelectTask={(task) => {
              setSelectedTask(task);
              navigateTo('detalle-tarea');
            }}
            onToggleTaskCompleted={handleToggleTaskCompleted}
          />
        )}

        {currentScreen === 'registro-rapido' && (
          <RegistroRapidoScreen
            onNavigate={navigateTo}
            onAddTask={handleAddTask}
          />
        )}

        {currentScreen === 'detalle-tarea' && selectedTask && (
          <DetalleTareaScreen
            task={selectedTask}
            onNavigate={navigateTo}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {currentScreen === 'login' && (
          <LoginScreen
            onNavigate={navigateTo}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {currentScreen === 'registro' && (
          <RegistroScreen onNavigate={navigateTo} onLoginSuccess={handleLoginSuccess} />
        )}

        {currentScreen === 'recuperar' && (
          <RecuperarScreen onNavigate={navigateTo} />
        )}

        {currentScreen === 'perfil' && currentUser && (
          <PerfilScreen
            currentUser={currentUser}
            onNavigate={navigateTo}
            onLogout={handleLogout}
          />
        )}
      </div>

      {/* Persistent bottom navigation bar when appropriate */}
      {showBottomNav && currentUser && (
        <BottomNav currentScreen={currentScreen} onNavigate={navigateTo} />
      )}

      {/* Notifications & Audio Chime Modal */}
      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        tasks={tasks}
        defaultReminderMinutes={defaultReminderMinutes}
        onChangeDefaultReminder={setDefaultReminderMinutes}
      />

      {/* Trabajo Grupal & Bina Sync Modal */}
      <TrabajoGrupalModal
        isOpen={isTrabajoGrupalModalOpen}
        onClose={() => setIsTrabajoGrupalModalOpen(false)}
        tasks={tasks}
        onUpdateTask={handleUpdateTask}
      />

      {/* Floating In-App Toast Banner Notification */}
      {notificationToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md p-4 rounded-xl bg-primary text-on-primary shadow-2xl flex items-center gap-3 animate-bounce border border-white/20">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">notifications_active</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-label-md text-label-md font-bold truncate">{notificationToast.title}</h4>
            <p className="font-body-xs text-body-xs text-on-primary/90 truncate">{notificationToast.body}</p>
          </div>
          <button
            type="button"
            onClick={() => setNotificationToast(null)}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 text-on-primary cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Screen Explorer Modal for easy 1-click inspection of all 7 screens */}
      <ScreenPickerModal
        isOpen={isScreenPickerOpen}
        currentScreen={currentScreen}
        onClose={() => setIsScreenPickerOpen(false)}
        onSelectScreen={navigateTo}
      />
    </div>
  );
}
