'use client';

import { useState, useEffect, useCallback } from 'react';
import { useOptionalAuthSync } from '@/features/auth';
import {
  LEARNING_MODE_STORAGE_KEY,
  LearningMode,
} from './active-course';
import {
  LEARNING_STATE_EVENT,
  readStoredLearningMode,
  writeLearningModeToStore,
} from './learning-store';

export const useLearningMode = () => {
  const auth = useOptionalAuthSync();
  const isAuthenticated = auth?.isAuthenticated ?? false;

  const [learningMode, setLearningModeState] = useState<LearningMode>('all');

  useEffect(() => {
    const sync = () => {
      if (!isAuthenticated) {
        setLearningModeState('all');
        return;
      }
      setLearningModeState(readStoredLearningMode());
    };

    sync();

    const handleStorage = (e: StorageEvent) => {
      if (!e.key || e.key === LEARNING_MODE_STORAGE_KEY) {
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

  const setLearningMode = useCallback(
    (mode: LearningMode) => {
      setLearningModeState(mode);
      if (isAuthenticated) {
        writeLearningModeToStore(mode);
      }
    },
    [isAuthenticated]
  );

  return {
    learningMode,
    setLearningMode,
  };
};
