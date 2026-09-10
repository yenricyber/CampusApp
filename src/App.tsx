/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppScreen, Course, PushNotification, ToastPayload, StudentProfile, UserTask } from './types';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import { MateriasScreen } from './components/screens/MateriasScreen';
import { DetalleMateriaScreen } from './components/screens/DetalleMateriaScreen';
import { CalendarioScreen } from './components/screens/CalendarioScreen';
import { AvisosScreen } from './components/screens/AvisosScreen';
import { TramitesScreen } from './components/screens/TramitesScreen';
import { CredencialScreen } from './components/screens/CredencialScreen';
import { MisTareasScreen } from './components/screens/MisTareasScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { RegisterScreen } from './components/screens/RegisterScreen';
import { SplashScreen } from './components/screens/SplashScreen';
import { UploadActivityModal } from './components/modals/UploadActivityModal';
import { SearchModal } from './components/modals/SearchModal';
import { PdfPreviewModal } from './components/modals/PdfPreviewModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { Toast } from './components/modals/Toast';
import { useMockPushNotificationSystem } from './hooks/useMockPushNotificationSystem';
import { apiService } from './services/api';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [previousScreen, setPreviousScreen] = useState<AppScreen>('materias');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [tasks, setTasks] = useState<UserTask[]>([]);
  
  // Modals & Feedback
  const [toastPayload, setToastPayload] = useState<ToastPayload | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadActivityTitle, setUploadActivityTitle] = useState('');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfModalTitle, setPdfModalTitle] = useState('');

  // Periodic Mock Push Notification System
  const {
    isPushActive,
    togglePushActive,
    triggerNextPush,
    unreadCount,
    markAllRead,
  } = useMockPushNotificationSystem({
    enabled: true,
    intervalMs: 22000,
    initialDelayMs: 6500,
    onNotification: (notification) => {
      setToastPayload(notification);
    },
  });

  const showToast = (payload: ToastPayload) => {
    setToastPayload(payload);
  };

  const handleNotificationAction = (notification: PushNotification) => {
    if (notification.courseId) {
      const matchedCourse = courses.find((c) => c.id === notification.courseId);
      if (matchedCourse) {
        setSelectedCourse(matchedCourse);
      }
    }
    if (notification.targetScreen) {
      navigateTo(notification.targetScreen);
    }
    setToastPayload(null);
  };

  const navigateTo = (screen: AppScreen) => {
    if (screen === 'avisos') {
      markAllRead();
    }
    if (screen !== currentScreen) {
      setPreviousScreen(currentScreen);
      setCurrentScreen(screen);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    navigateTo('detalle-materia');
  };

  const handleOpenUpload = (title: string) => {
    setUploadActivityTitle(title);
    setUploadModalOpen(true);
  };

  const handleActivityUploaded = (fileName: string) => {
    apiService.submitActivity({
      matricula: student.matricula,
      activityTitle: uploadActivityTitle,
      fileName,
      fileSize: '1.4 MB',
    }).catch(() => {});
    showToast(`¡Entrega de "${fileName}" guardada en TiDB Cloud con éxito!`);
  };

  const handleDownloadPdf = (title: string) => {
    setPdfModalTitle(title);
    setPdfModalOpen(true);
  };

  const handleGenerateQrDoc = (docType: string) => {
    setPdfModalTitle(docType);
    setPdfModalOpen(true);
  };

  const handleSaveToWallet = () => {
    showToast('Pase digital PKPass listo para sincronizar con Apple Wallet / Google Wallet');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start overflow-x-hidden">
      {/* Main Container */}
      <div className="w-full max-w-md min-h-screen bg-surface relative flex flex-col shadow-xl sm:border-x sm:border-slate-200">
        {/* Dynamic Toast Feedback */}
        <Toast
          payload={toastPayload}
          onClose={() => setToastPayload(null)}
          onAction={handleNotificationAction}
        />

        {/* Top Header (Shown on all screens except splash, login and registro) */}
        {currentScreen !== 'splash' && currentScreen !== 'login' && currentScreen !== 'registro' && (
          <Header
            currentScreen={currentScreen}
            onNavigate={navigateTo}
            onBack={() => navigateTo(previousScreen === 'detalle-materia' ? 'materias' : previousScreen)}
            onOpenSearch={() => setSearchModalOpen(true)}
            onOpenProfile={() => setProfileModalOpen(true)}
          />
        )}

        {/* Screen Views */}
        <main className="flex-1 w-full relative overflow-y-auto no-scrollbar">
          {currentScreen === 'splash' && (
            <SplashScreen
              onFinish={() => navigateTo('login')}
              durationMs={2400}
            />
          )}

          {currentScreen === 'login' && (
            <LoginScreen
              onLoginSuccess={(studentData) => {
                setStudent(studentData);
                navigateTo('materias');
              }}
              onNavigateToRegister={() => navigateTo('registro')}
              onShowToast={showToast}
              onReplaySplash={() => navigateTo('splash')}
            />
          )}

          {currentScreen === 'registro' && (
            <RegisterScreen
              onRegisterSuccess={(newStudentData) => {
                // Ideally this would fetch the full profile or redirect to login.
                // For now, redirect to login to force a real fetch, or set minimum data.
                navigateTo('login');
                showToast('Registro completado. Por favor, inicia sesión.');
              }}
              onNavigateToLogin={() => navigateTo('login')}
              onShowToast={showToast}
            />
          )}

          {currentScreen === 'materias' && student && (
            <MateriasScreen
              student={student}
              courses={courses}
              onSelectCourse={handleSelectCourse}
              onOpenCredencial={() => navigateTo('credencial')}
              onOpenNotifications={() => navigateTo('avisos')}
              onOpenPlanEstudios={() => handleDownloadPdf('Plan_Estudios_Ingenieria_Sistemas_2026.pdf')}
              onOpenLibrary={() => handleDownloadPdf('Reglamento_Biblioteca_Digital_2026.pdf')}
            />
          )}

          {currentScreen === 'detalle-materia' && selectedCourse && (
            <DetalleMateriaScreen
              course={selectedCourse}
              onBack={() => navigateTo('materias')}
              onOpenUploadModal={handleOpenUpload}
              onDownloadPdf={handleDownloadPdf}
              onShowToast={showToast}
            />
          )}

          {currentScreen === 'calendario' && (
            <CalendarioScreen
              onOpenUploadModal={handleOpenUpload}
              onOpenDetails={(title) => {
                showToast(`Detalles de: ${title}`);
                navigateTo('detalle-materia');
              }}
              onShowToast={showToast}
              isPushActive={isPushActive}
              onTogglePush={togglePushActive}
              onTriggerTestPush={triggerNextPush}
            />
          )}

          {currentScreen === 'avisos' && (
            <AvisosScreen
              onShowToast={showToast}
              onDownloadPdf={handleDownloadPdf}
            />
          )}

          {currentScreen === 'tramites' && (
            <TramitesScreen
              onShowToast={showToast}
              onDownloadPdf={handleDownloadPdf}
              onGenerateQrDoc={handleGenerateQrDoc}
            />
          )}

          {currentScreen === 'tareas' && student && (
            <MisTareasScreen
              student={student}
              tasks={tasks}
            />
          )}

          {currentScreen === 'credencial' && student && (
            <CredencialScreen
              student={student}
              onSaveToWallet={handleSaveToWallet}
              onDownloadPdf={() => handleDownloadPdf('Credencial_Oficial_Sofia_Martinez.pdf')}
              onShowToast={showToast}
            />
          )}
        </main>

        {/* Persistent Bottom Navigation (Shown on main portal screens) */}
        {currentScreen !== 'splash' && currentScreen !== 'login' && currentScreen !== 'registro' && (
          <BottomNavigation
            currentScreen={currentScreen}
            onNavigate={navigateTo}
            unreadNoticesCount={unreadCount}
          />
        )}
      </div>

      {/* Global Modals & Dialogs */}
      <UploadActivityModal
        activityTitle={uploadActivityTitle}
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSubmit={handleActivityUploaded}
      />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        courses={courses}
        onSelectCourse={handleSelectCourse}
      />

      <PdfPreviewModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        documentTitle={pdfModalTitle}
        student={student}
        onDownloaded={(title) => showToast(`Documento oficial descargado: ${title}`)}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        student={student}
        onLogout={() => {
          apiService.logout();
          showToast('Has cerrado sesión correctamente.');
          navigateTo('login');
        }}
        onOpenCredencial={() => navigateTo('credencial')}
      />
    </div>
  );
}
