'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  LEARNING_MODE_STORAGE_KEY,
  LearningMode,
  parseLearningMode,
} from './active-course';

export const useLearningMode = () => {
  const [learningMode, setLearningModeState] = useState<LearningMode>('all');

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LEARNING_MODE_STORAGE_KEY);
      setLearningModeState(parseLearningMode(stored));
    } catch {
      // Ignore storage read failures
    }
  }, []);

  const setLearningMode = useCallback((mode: LearningMode) => {
    setLearningModeState(mode);
    try {
      window.localStorage.setItem(LEARNING_MODE_STORAGE_KEY, mode);
    } catch {
      // Ignore storage write failures
    }
  }, []);

  return {
    learningMode,
    setLearningMode,
  };
};
