'use client';

import { useState, useEffect, useCallback } from 'react';
import { useOptionalAuthSync } from '@/features/auth';
import {
  COMPLETED_LESSONS_STORAGE_KEY,
  LEARNING_STATE_EVENT,
  readCompletedSlugs,
  toggleCompletedLessonInStore,
} from './learning-store';

export const useProgress = () => {
  const auth = useOptionalAuthSync();
  const isAuthenticated = auth?.isAuthenticated ?? false;
  const openAuthModal = auth?.openAuthModal;

  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const sync = () => {
      if (!isAuthenticated) {
        setCompletedSlugs([]);
        setIsLoaded(true);
        return;
      }
      setCompletedSlugs(readCompletedSlugs());
      setIsLoaded(true);
    };

    sync();

    const handleStorage = (e: StorageEvent) => {
      if (!e.key || e.key === COMPLETED_LESSONS_STORAGE_KEY) {
        sync();
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(LEARNING_STATE_EVENT, sync);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(LEARNING_STATE_EVENT, sync);
    };
  }, [isAuthenticated]);

  const toggleLesson = useCallback(
    (slug: string) => {
      if (!isAuthenticated) {
        openAuthModal?.();
        return;
      }
      const updated = toggleCompletedLessonInStore(slug);
      setCompletedSlugs(updated);
    },
    [isAuthenticated, openAuthModal]
  );

  const isCompleted = useCallback(
    (slug: string): boolean => completedSlugs.includes(slug),
    [completedSlugs]
  );

  return {
    completedSlugs,
    isLoaded,
    toggleLesson,
    isCompleted,
  };
};
