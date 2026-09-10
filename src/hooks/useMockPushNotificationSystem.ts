import { useState, useEffect, useRef, useCallback } from 'react';
import { PushNotification } from '../types';
import { mockPushNotificationsPool } from '../data/mockPushNotifications';
import { playNotificationChime } from '../utils/notificationAudio';

interface UseMockPushNotificationOptions {
  enabled?: boolean;
  intervalMs?: number;
  initialDelayMs?: number;
  onNotification?: (notification: PushNotification) => void;
}

export function useMockPushNotificationSystem({
  enabled = true,
  intervalMs = 22000,
  initialDelayMs = 7000,
  onNotification,
}: UseMockPushNotificationOptions = {}) {
  const [isPushActive, setIsPushActive] = useState(enabled);
  const [unreadCount, setUnreadCount] = useState(1);
  const [lastNotification, setLastNotification] = useState<PushNotification | null>(null);
  const poolIndexRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const initialTimerRef = useRef<NodeJS.Timeout | null>(null);

  const deliverNotification = useCallback(
    (notification: PushNotification) => {
      setLastNotification(notification);
      setUnreadCount((prev) => prev + 1);
      playNotificationChime();
      if (onNotification) {
        onNotification(notification);
      }
    },
    [onNotification]
  );

  // Trigger next notification from pool
  const triggerNextPush = useCallback(() => {
    const notification = mockPushNotificationsPool[poolIndexRef.current];
    poolIndexRef.current = (poolIndexRef.current + 1) % mockPushNotificationsPool.length;
    deliverNotification(notification);
    return notification;
  }, [deliverNotification]);

  // Periodic timer effect
  useEffect(() => {
    if (!isPushActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (initialTimerRef.current) clearTimeout(initialTimerRef.current);
      return;
    }

    // Schedule first initial notification after page mount
    initialTimerRef.current = setTimeout(() => {
      triggerNextPush();

      // Subsequent recurring notifications
      timerRef.current = setInterval(() => {
        triggerNextPush();
      }, intervalMs);
    }, initialDelayMs);

    return () => {
      if (initialTimerRef.current) clearTimeout(initialTimerRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPushActive, intervalMs, initialDelayMs, triggerNextPush]);

  const togglePushActive = useCallback((nextState?: boolean) => {
    setIsPushActive((prev) => (typeof nextState === 'boolean' ? nextState : !prev));
  }, []);

  const markAllRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  return {
    isPushActive,
    togglePushActive,
    triggerNextPush,
    lastNotification,
    unreadCount,
    markAllRead,
  };
}
