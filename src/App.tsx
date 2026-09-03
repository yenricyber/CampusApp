import { useState } from 'react';
import { AcademicTask, ScreenType } from './types';
import { INITIAL_TASKS } from './data/mockData';
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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('inicio');
  const [screenHistory, setScreenHistory] = useState<ScreenType[]>(['inicio']);
  const [tasks, setTasks] = useState<AcademicTask[]>(INITIAL_TASKS);
  const [selectedTask, setSelectedTask] = useState<AcademicTask>(INITIAL_TASKS[0]);
  const [isScreenPickerOpen, setIsScreenPickerOpen] = useState(false);

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

  const handleAddTask = (newTask: AcademicTask) => {
    setTasks((prev) => [newTask, ...prev]);
    setSelectedTask(newTask);
  };

  const handleUpdateTask = (updatedTask: AcademicTask) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setSelectedTask(updatedTask);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedTask.id === taskId) {
      setSelectedTask(tasks[0] || null);
    }
  };

  const handleToggleTaskCompleted = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isDone = t.status === 'terminada';
          const newStatus = isDone ? 'pendiente' : 'terminada';
          return {
            ...t,
            status: newStatus,
            progressPercent: isDone ? 50 : 100,
          };
        }
        return t;
      })
    );
  };

  const showBottomNav = currentScreen !== 'registro-rapido' && currentScreen !== 'detalle-tarea';

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col antialiased selection:bg-primary-container selection:text-on-primary">
      {/* Top persistent header */}
      <AppHeader
        currentScreen={currentScreen}
        onNavigate={navigateTo}
        onBack={navigateBack}
        onOpenScreenPicker={() => setIsScreenPickerOpen(true)}
      />

      {/* Screen Views matching user specifications EXACTLY */}
      <div className="flex-1 flex flex-col">
        {currentScreen === 'inicio' && (
          <InicioScreen
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

        {currentScreen === 'detalle-tarea' && (
          <DetalleTareaScreen
            task={selectedTask || tasks[0]}
            onNavigate={navigateTo}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {currentScreen === 'login' && (
          <LoginScreen
            onNavigate={navigateTo}
            onLoginSuccess={() => navigateTo('inicio')}
          />
        )}

        {currentScreen === 'registro' && (
          <RegistroScreen onNavigate={navigateTo} />
        )}

        {currentScreen === 'recuperar' && (
          <RecuperarScreen onNavigate={navigateTo} />
        )}
      </div>

      {/* Persistent bottom navigation bar when appropriate */}
      {showBottomNav && (
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
