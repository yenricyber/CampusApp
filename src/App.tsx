import { useState, useEffect } from 'react';
import { AcademicTask, ScreenType, UserProfile } from './types';
import { AppHeader } from './components/AppHeader';
import { BottomNav } from './components/BottomNav';
import { ScreenPickerModal } from './components/ScreenPickerModal';
import { InicioScreen } from './components/screens/InicioScreen';
import { CalendarioScreen } from './components/screens/CalendarioScreen';
import { RegistroRapidoScreen } from './components/screens/RegistroRapidoScreen';
import { DetalleTareaScreen } from './components/screens/DetalleTareaScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { RegistroScreen } from './components/screens/RegistroScreen';
import { RecuperarScreen } from './components/screens/RecuperarScreen';
import { PerfilScreen } from './components/screens/PerfilScreen';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('login');
  const [screenHistory, setScreenHistory] = useState<ScreenType[]>(['login']);
  const [tasks, setTasks] = useState<AcademicTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<AcademicTask | null>(null);
  const [isScreenPickerOpen, setIsScreenPickerOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setCurrentScreen('inicio');
      setScreenHistory(['inicio']);
    }
    fetchTasks();
  }, []);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentScreen('login');
    setScreenHistory(['login']);
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
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
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      if (res.ok) {
        setTasks((prev) => [newTask, ...prev]);
        setSelectedTask(newTask);
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
      </div>

      {/* Persistent bottom navigation bar when appropriate */}
      {showBottomNav && currentUser && (
        <BottomNav currentScreen={currentScreen} onNavigate={navigateTo} />
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
