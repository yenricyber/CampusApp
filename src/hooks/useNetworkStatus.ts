import { useState, useEffect, useCallback } from 'react';

export interface NetworkStatus {
  isOnline: boolean;
  isSimulatedOffline: boolean;
  toggleSimulateOffline: () => void;
  reconnect: () => void;
}

export function useNetworkStatus(): NetworkStatus {
  const [realOnline, setRealOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setRealOnline(true);
    const handleOffline = () => setRealOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleSimulateOffline = useCallback(() => {
    setIsSimulatedOffline((prev) => !prev);
  }, []);

  const reconnect = useCallback(() => {
    setIsSimulatedOffline(false);
  }, []);

  const isOnline = realOnline && !isSimulatedOffline;

  return {
    isOnline,
    isSimulatedOffline,
    toggleSimulateOffline,
    reconnect,
  };
}
