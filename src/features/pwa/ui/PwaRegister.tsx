'use client';

import { useEffect, useRef, useState } from 'react';
import { WifiOff, RefreshCw, X } from 'lucide-react';
import { allLessonsData } from '@/shared/data/lessons';
import { useActiveCourse } from '@/features/progress-tracker';

export const PwaRegister = (): React.JSX.Element | null => {
  const [mounted, setMounted] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const { activeCourse } = useActiveCourse();
  const warmedCoursesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    setMounted(true);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    let refreshing = false;
    const hadController =
      typeof navigator !== 'undefined' &&
      'serviceWorker' in navigator &&
      Boolean(navigator.serviceWorker.controller);

    const handleControllerChange = () => {
      if (!hadController || refreshing) return;
      refreshing = true;
      window.location.reload();
    };

    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { updateViaCache: 'none' })
        .then((reg) => {
          setRegistration(reg);

          if (reg.waiting && navigator.serviceWorker.controller) {
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

      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      }
    };
  }, []);

  // Warm active course routes + /offline-shell/ in background once SW is ready and online
  useEffect(() => {
    if (!mounted || typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    if (isOffline) return;

    const courseSlug = activeCourse?.courseSlug;
    if (!courseSlug || warmedCoursesRef.current.has(courseSlug)) return;

    warmedCoursesRef.current.add(courseSlug);

    const lessonRoutes = allLessonsData
      .filter((lesson) => (lesson.courseSlug ?? 'senior-marketing') === courseSlug)
      .slice(0, 10)
      .map((lesson) => `/courses/${courseSlug}/lessons/${lesson.slug}/`);

    const routesToWarm = [
      '/',
      '/?source=pwa',
      '/offline-shell/',
      `/courses/${courseSlug}/`,
      ...lessonRoutes,
    ];

    navigator.serviceWorker.ready
      .then((readyReg) => {
        const target = readyReg.active || navigator.serviceWorker.controller;
        if (target) {
          target.postMessage({
            type: 'CACHE_ROUTES',
            routes: routesToWarm,
          });
        }
      })
      .catch(() => {
        // Ignore background warm failures
      });
  }, [mounted, isOffline, activeCourse?.courseSlug]);

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
      {isOffline && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs">
          <WifiOff className="w-4 h-4 text-zinc-400 shrink-0" />
          <span>Оффлайн-режим: курсы, прогресс и тренажёры работают без интернета.</span>
        </div>
      )}

      {isUpdateAvailable && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-3 p-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-xs">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-zinc-300" />
            <span>Доступно обновление платформы</span>
          </div>
          <button
            onClick={handleUpdate}
            type="button"
            className="px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-semibold transition-colors"
          >
            Обновить
          </button>
          <button
            onClick={() => setIsUpdateAvailable(false)}
            type="button"
            className="p-1 rounded-md text-zinc-400 hover:text-white"
            aria-label="Закрыть"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </>
  );
};
