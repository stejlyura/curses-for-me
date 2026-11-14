'use client';

import { useState, useEffect, useCallback } from 'react';
import { useOptionalAuthSync } from '@/features/auth';
import {
  ACTIVE_COURSE_STORAGE_KEY,
  ACTIVE_COURSE_EVENT,
  ActiveCourseState,
  resolveResumeHref,
} from './active-course';
import {
  FIRST_LESSON_BY_COURSE,
  LEARNING_STATE_EVENT,
  clearActiveCourseInStore,
  readStoredActiveCourseState,
  writeActiveCourseToStore,
} from './learning-store';

export const useActiveCourse = () => {
  const auth = useOptionalAuthSync();
  const isAuthenticated = auth?.isAuthenticated ?? false;

  const [activeCourse, setActiveCourseState] = useState<ActiveCourseState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const syncFromStorage = () => {
      if (!isAuthenticated) {
        setActiveCourseState(null);
        setIsLoaded(true);
        return;
      }
      setActiveCourseState(readStoredActiveCourseState());
      setIsLoaded(true);
    };

    syncFromStorage();

    const handleStorage = (e: StorageEvent) => {
      if (!e.key || e.key === ACTIVE_COURSE_STORAGE_KEY) {
        syncFromStorage();
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(ACTIVE_COURSE_EVENT, syncFromStorage);
    window.addEventListener(LEARNING_STATE_EVENT, syncFromStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(ACTIVE_COURSE_EVENT, syncFromStorage);
      window.removeEventListener(LEARNING_STATE_EVENT, syncFromStorage);
    };
  }, [isAuthenticated]);

  const setActiveCourse = useCallback(
    (courseSlug: string, lessonSlug?: string) => {
      if (!isAuthenticated) return;
      const next = writeActiveCourseToStore(courseSlug, lessonSlug);
      if (next) {
        setActiveCourseState(next);
      }
    },
    [isAuthenticated]
  );

  const clearActiveCourse = useCallback(() => {
    if (!isAuthenticated) return;
    clearActiveCourseInStore();
    setActiveCourseState(null);
  }, [isAuthenticated]);

  const resumeHref = resolveResumeHref(activeCourse, FIRST_LESSON_BY_COURSE);

  return {
    activeCourse,
    isLoaded,
    resumeHref,
    setActiveCourse,
    clearActiveCourse,
  };
};
