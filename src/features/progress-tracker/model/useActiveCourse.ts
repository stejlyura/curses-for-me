'use client';

import { useState, useEffect, useCallback } from 'react';
import { coursesData } from '@/shared/data/courses';
import { allLessonsData } from '@/shared/data/lessons';
import {
  ACTIVE_COURSE_STORAGE_KEY,
  ACTIVE_COURSE_EVENT,
  ActiveCourseState,
  parseActiveCourseState,
  mergeActiveCourseUpdate,
  resolveResumeHref,
} from './active-course';

const VALID_COURSE_SLUGS = coursesData.map((c) => c.slug);

const VALID_LESSON_SLUGS_BY_COURSE: Record<string, string[]> = {};
const FIRST_LESSON_BY_COURSE: Record<string, string> = {};

for (const course of coursesData) {
  const courseLessons = allLessonsData.filter(
    (l) => (l.courseSlug ?? 'senior-marketing') === course.slug
  );
  VALID_LESSON_SLUGS_BY_COURSE[course.slug] = courseLessons.map((l) => l.slug);
  if (courseLessons.length > 0) {
    FIRST_LESSON_BY_COURSE[course.slug] = courseLessons[0].slug;
  }
}

const readStoredActiveCourse = (): ActiveCourseState | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(ACTIVE_COURSE_STORAGE_KEY);
    return parseActiveCourseState(raw, VALID_COURSE_SLUGS, VALID_LESSON_SLUGS_BY_COURSE);
  } catch {
    return null;
  }
};

export const useActiveCourse = () => {
  const [activeCourse, setActiveCourseState] = useState<ActiveCourseState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const syncFromStorage = () => {
      setActiveCourseState(readStoredActiveCourse());
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

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(ACTIVE_COURSE_EVENT, syncFromStorage);
    };
  }, []);

  const setActiveCourse = useCallback((courseSlug: string, lessonSlug?: string) => {
    if (!VALID_COURSE_SLUGS.includes(courseSlug)) return;

    const current = readStoredActiveCourse();
    const validLesson =
      lessonSlug && (VALID_LESSON_SLUGS_BY_COURSE[courseSlug] ?? []).includes(lessonSlug)
        ? lessonSlug
        : undefined;

    const next = mergeActiveCourseUpdate(current, courseSlug, validLesson);

    try {
      window.localStorage.setItem(ACTIVE_COURSE_STORAGE_KEY, JSON.stringify(next));
      setActiveCourseState(next);
      window.dispatchEvent(new Event(ACTIVE_COURSE_EVENT));
    } catch (e) {
      console.error('Failed to persist active course to localStorage', e);
    }
  }, []);

  const clearActiveCourse = useCallback(() => {
    try {
      window.localStorage.removeItem(ACTIVE_COURSE_STORAGE_KEY);
      setActiveCourseState(null);
      window.dispatchEvent(new Event(ACTIVE_COURSE_EVENT));
    } catch (e) {
      console.error('Failed to clear active course from localStorage', e);
    }
  }, []);

  const resumeHref = resolveResumeHref(activeCourse, FIRST_LESSON_BY_COURSE);

  return {
    activeCourse,
    isLoaded,
    resumeHref,
    setActiveCourse,
    clearActiveCourse,
  };
};
