'use client';

import { useEffect, useState } from 'react';
import { WifiOff, RefreshCw, X } from 'lucide-react';

export const PwaRegister = (): React.JSX.Element | null => {
  const [mounted, setMounted] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    setMounted(true);
    // 1. Online / Offline network status listeners
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    // 2. Service Worker registration & updates
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          setRegistration(reg);

          // Check if a new worker is waiting
          if (reg.waiting) {
            setIsUpdateAvailable(true);
          }

          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setIsUpdateAvailable(true);
                }
              });
            }
          });
        })
        .catch((error: unknown) => {
          console.error('Service Worker registration failed:', error);
        });

      // Reload page when new worker takes over
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Offline Status Toast */}
      {isOffline && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-amber-950/90 border border-amber-800 text-amber-200 text-xs shadow-2xl backdrop-blur-md">
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Вы оффлайн: все курсы, симуляторы и резюме работают автономно (PWA).</span>
        </div>
      )}

      {/* New Version Update Toast */}
      {isUpdateAvailable && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900 border border-brand-500/50 text-white text-xs shadow-2xl backdrop-blur-md animate-fade-in">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-brand-400 animate-spin" />
            <span>Доступна новая версия платформы!</span>
          </div>
          <button
            onClick={handleUpdate}
            type="button"
            className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-colors shadow-sm"
          >
            Обновить
          </button>
          <button
            onClick={() => setIsUpdateAvailable(false)}
            type="button"
            className="p-1 rounded-lg text-zinc-400 hover:text-white"
            aria-label="Закрыть"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </>
  );
};
