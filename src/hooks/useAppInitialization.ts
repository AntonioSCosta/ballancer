
import { useState, useEffect } from 'react';
import { ServiceWorkerManager } from '@/utils/serviceWorkerManager';
import { OfflineStorage } from '@/utils/offlineStorage';
import { ErrorHandler } from '@/utils/errorHandler';

interface AppInitializationState {
  isLoading: boolean;
  isOnline: boolean;
  hasError: boolean;
  errorMessage: string | null;
  isServiceWorkerReady: boolean;
}

export const useAppInitialization = () => {
  const [state, setState] = useState<AppInitializationState>({
    isLoading: true,
    isOnline: navigator.onLine,
    hasError: false,
    errorMessage: null,
    isServiceWorkerReady: false
  });

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Register service worker
        const swManager = ServiceWorkerManager.getInstance();
        const swRegistered = await swManager.register();
        
        setState(prev => ({ ...prev, isServiceWorkerReady: swRegistered }));

        // Set up connection monitoring
        const cleanup = swManager.onConnectionChange((isOnline) => {
          setState(prev => ({ ...prev, isOnline }));
          
          if (isOnline) {
            OfflineStorage.syncWhenOnline();
          } else {
            ErrorHandler.warning('You are now offline', 'Some features may be limited');
          }
        });

        // Check for pending sync
        if (navigator.onLine) {
          await OfflineStorage.syncWhenOnline();
        }

        setState(prev => ({ ...prev, isLoading: false }));

        return cleanup;
      } catch (error) {
        console.error('App initialization failed:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          hasError: true,
          errorMessage: 'Failed to initialize application'
        }));
      }
    };

    const cleanup = initializeApp();

    return () => {
      if (cleanup instanceof Promise) {
        cleanup.then(fn => fn && fn());
      }
    };
  }, []);

  const retry = () => {
    setState(prev => ({ ...prev, isLoading: true, hasError: false, errorMessage: null }));
    window.location.reload();
  };

  return {
    ...state,
    retry
  };
};
