import React, { useEffect, useState } from 'react';
import { PushNotification, ToastPayload } from '../../types';

interface ToastProps {
  payload: ToastPayload | null;
  onClose: () => void;
  onAction?: (notification: PushNotification) => void;
  durationMs?: number;
}

export const Toast: React.FC<ToastProps> = ({
  payload,
  onClose,
  onAction,
  durationMs = 6500,
}) => {
  const [progress, setProgress] = useState(100);

  // Auto-dismiss countdown
  useEffect(() => {
    if (!payload) return;

    setProgress(100);
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPct = Math.max(0, 100 - (elapsed / durationMs) * 100);
      setProgress(remainingPct);
      if (remainingPct <= 0) {
        clearInterval(interval);
        onClose();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [payload, durationMs, onClose]);

  if (!payload) return null;

  const isPushNotification = typeof payload !== 'string';
  const notification = isPushNotification ? (payload as PushNotification) : null;
  const simpleMessage = typeof payload === 'string' ? payload : null;

  // Render 1: Push Notification Banner (Top-docked mobile push style)
  if (notification) {
    const isExam = notification.category === 'exam';
    const isAnnouncement = notification.category === 'announcement';
    const isPayment = notification.category === 'payment';

    return (
      <div className="absolute top-3 left-3 right-3 z-50 animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
        <div
          role="alert"
          className="w-full bg-primary-container text-white rounded-2xl p-3.5 shadow-[0_12px_32px_rgba(10,10,92,0.4)] border border-white/15 backdrop-blur-xl relative overflow-hidden flex flex-col gap-2.5 transition-all"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-secondary-container/15 blur-xl pointer-events-none"></div>

          {/* Top Brand & Metadata Ribbon */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              {/* Institutional Crest Icon */}
              <div className="w-6 h-6 rounded-lg bg-secondary-container text-primary-container flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[15px] text-[#0c0c5d] font-bold">
                  {isExam ? 'alarm' : isAnnouncement ? 'campaign' : isPayment ? 'account_balance_wallet' : 'notifications'}
                </span>
              </div>
              <span className="font-headline text-[10px] uppercase tracking-wider text-slate-200 font-bold truncate">
                PORTAL ESTUDIANTIL
              </span>
              <span className="text-white/40 text-[9px]">•</span>
              <span className="font-mono text-[10px] text-secondary-container font-semibold shrink-0">
                {notification.timestamp || 'Ahora'}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {notification.badge && (
                <span
                  className={`font-headline text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md tracking-tight ${
                    isExam
                      ? 'bg-secondary-container text-[#0c0c5d]'
                      : isPayment
                      ? 'bg-amber-300 text-amber-950'
                      : 'bg-white/20 text-white'
                  }`}
                >
                  {notification.badge}
                </span>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                aria-label="Cerrar notificación"
                className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </div>
          </div>

          {/* Notification Title & Body */}
          <div className="flex flex-col gap-0.5 pr-2">
            <h4 className="font-headline text-[13px] font-bold text-white tracking-tight leading-snug">
              {notification.title}
            </h4>
            <p className="font-body text-[12px] text-slate-200 leading-relaxed">
              {notification.message}
            </p>
          </div>

          {/* Quick Action Button & Navigation Trigger */}
          {notification.actionText && (
            <div className="flex items-center justify-between pt-1 border-t border-white/10">
              <span className="font-mono text-[9px] text-slate-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse"></span>
                Toca para ir a la sección
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onAction) onAction(notification);
                  onClose();
                }}
                className="px-2.5 py-1 rounded-lg bg-secondary-container text-primary-container font-headline text-[11px] font-bold flex items-center gap-1 hover:brightness-105 active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                <span>{notification.actionText}</span>
                <span className="material-symbols-outlined text-[13px] text-[#0c0c5d]">
                  arrow_forward
                </span>
              </button>
            </div>
          )}

          {/* Subtle Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <div
              className="h-full bg-secondary-container transition-all ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Render 2: Simple Feedback Pill (Bottom-docked for standard micro-actions)
  return (
    <div
      onClick={onClose}
      className="absolute bottom-20 left-4 right-4 z-50 max-w-sm mx-auto bg-primary-container text-secondary-container px-4 py-2.5 rounded-xl shadow-2xl font-headline text-xs font-bold flex items-center justify-between gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-secondary-container/30 cursor-pointer"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-5 h-5 rounded-full bg-secondary-container/20 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[16px] text-secondary-container">
            check_circle
          </span>
        </div>
        <span className="truncate text-white">{simpleMessage}</span>
      </div>
      <button
        onClick={onClose}
        className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 flex items-center justify-center shrink-0 text-xs"
      >
        <span className="material-symbols-outlined text-[14px]">close</span>
      </button>
    </div>
  );
};
