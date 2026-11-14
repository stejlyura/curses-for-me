'use client';

import { useState, useEffect, useCallback } from 'react';
import { useOptionalAuthSync } from '@/features/auth';
import {
  LEARNING_STATE_EVENT,
  QUIZ_ATTEMPTS_STORAGE_KEY,
  readQuizAttempts,
  saveQuizAttempt,
  deleteQuizAttempt,
} from './learning-store';
import { QuizAttemptRecord, makeAttemptKey } from './learning-types';

export const useQuizProgress = (
  lessonSlug = 'standalone',
  courseSlug = 'senior-marketing'
) => {
  const auth = useOptionalAuthSync();
  const isAuthenticated = auth?.isAuthenticated ?? false;

  const [attempts, setAttempts] = useState<Record<string, QuizAttemptRecord>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const sync = () => {
      if (!isAuthenticated) {
        setAttempts({});
        setIsLoaded(true);
        return;
      }
      setAttempts(readQuizAttempts());
      setIsLoaded(true);
    };

    sync();

    const handleStorage = (e: StorageEvent) => {
      if (!e.key || e.key === QUIZ_ATTEMPTS_STORAGE_KEY) {
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

  const submitAnswer = useCallback(
    (questionId: string, selectedOptionIndex: number, isCorrect: boolean) => {
      if (!isAuthenticated) {
        const key = makeAttemptKey(lessonSlug, questionId);
        setAttempts((prev) => ({
          ...prev,
          [key]: {
            attemptKey: key,
            lessonSlug,
            courseSlug,
            questionId,
            selectedOptionIndex,
            isCorrect,
            answeredAt: Date.now(),
          },
        }));
        return;
      }
      const next = saveQuizAttempt(
        lessonSlug,
        courseSlug,
        questionId,
        selectedOptionIndex,
        isCorrect
      );
      setAttempts(next);
    },
    [isAuthenticated, lessonSlug, courseSlug]
  );

  const resetAnswer = useCallback(
    (questionId: string) => {
      if (!isAuthenticated) {
        const key = makeAttemptKey(lessonSlug, questionId);
        setAttempts((prev) => {
          const copy = { ...prev };
          delete copy[key];
          return copy;
        });
        return;
      }
      const next = deleteQuizAttempt(lessonSlug, questionId);
      setAttempts(next);
    },
    [isAuthenticated, lessonSlug]
  );

  const getAttempt = useCallback(
    (questionId: string): QuizAttemptRecord | undefined =>
      attempts[makeAttemptKey(lessonSlug, questionId)],
    [attempts, lessonSlug]
  );

  return {
    attempts,
    isLoaded,
    submitAnswer,
    resetAnswer,
    getAttempt,
  };
};
