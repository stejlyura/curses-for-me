'use client';

import { coursesData } from '@/shared/data/courses';
import { allLessonsData } from '@/shared/data/lessons';
import {
  ACTIVE_COURSE_EVENT,
  ACTIVE_COURSE_STORAGE_KEY,
  ActiveCourseState,
  LEARNING_MODE_STORAGE_KEY,
  LearningMode,
  mergeActiveCourseUpdate,
  parseActiveCourseState,
  parseLearningMode,
} from './active-course';
import {
  LocalLearningSnapshot,
  QuizAttemptRecord,
  createEmptySnapshot,
  makeAttemptKey,
} from './learning-types';

export const AUTH_CACHED_STORAGE_KEY = 'marketolog_auth_cached';
export const SESSION_TOKEN_STORAGE_KEY = 'marketolog_session_token';
export const DIRTY_OFFLINE_STORAGE_KEY = 'marketolog_dirty_offline';

export const COMPLETED_LESSONS_STORAGE_KEY = 'marketolog_completed_lessons';
export const COMPLETED_AT_STORAGE_KEY = 'marketolog_completed_at';
export const LAST_VIEWED_AT_STORAGE_KEY = 'marketolog_last_viewed_at';
export const QUIZ_ATTEMPTS_STORAGE_KEY = 'marketolog_quiz_attempts';
export const ACTIVE_MODULE_PREFIX = 'marketolog_active_module_';

export const LEARNING_STATE_EVENT = 'marketolog:learning-state-updated';

export const VALID_COURSE_SLUGS = coursesData.map((c) => c.slug);

export const VALID_LESSON_SLUGS_BY_COURSE: Record<string, string[]> = {};
export const FIRST_LESSON_BY_COURSE: Record<string, string> = {};

for (const course of coursesData) {
  const courseLessons = allLessonsData.filter(
    (l) => (l.courseSlug ?? 'senior-marketing') === course.slug
  );
  VALID_LESSON_SLUGS_BY_COURSE[course.slug] = courseLessons.map((l) => l.slug);
  if (courseLessons.length > 0) {
    FIRST_LESSON_BY_COURSE[course.slug] = courseLessons[0].slug;
  }
}

const safeParseRecord = <T>(raw: string | null): Record<string, T> => {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, T>;
    }
    return {};
  } catch {
    return {};
  }
};

export const isAuthCacheAllowed = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(AUTH_CACHED_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

export const markAuthCacheEnabled = (enabled: boolean): void => {
  if (typeof window === 'undefined') return;
  try {
    if (enabled) {
      window.localStorage.setItem(AUTH_CACHED_STORAGE_KEY, '1');
    } else {
      window.localStorage.removeItem(AUTH_CACHED_STORAGE_KEY);
    }
  } catch {
    // ignore storage failures
  }
};

export const readSessionToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const token = window.localStorage.getItem(SESSION_TOKEN_STORAGE_KEY);
    return token && token.length > 0 ? token : null;
  } catch {
    return null;
  }
};

export const writeSessionToken = (token: string | null): void => {
  if (typeof window === 'undefined') return;
  try {
    if (token && token.length > 0) {
      window.localStorage.setItem(SESSION_TOKEN_STORAGE_KEY, token);
    } else {
      window.localStorage.removeItem(SESSION_TOKEN_STORAGE_KEY);
    }
  } catch {
    // ignore storage failures
  }
};

export const isDirtyOffline = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(DIRTY_OFFLINE_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

export const markDirtyOffline = (dirty: boolean): void => {
  if (typeof window === 'undefined') return;
  try {
    if (dirty) {
      window.localStorage.setItem(DIRTY_OFFLINE_STORAGE_KEY, '1');
    } else {
      window.localStorage.removeItem(DIRTY_OFFLINE_STORAGE_KEY);
    }
  } catch {
    // ignore storage failures
  }
};

export const notifyLearningStateUpdated = (emitActiveCourseEvent = false): void => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(LEARNING_STATE_EVENT));
  if (emitActiveCourseEvent) {
    window.dispatchEvent(new Event(ACTIVE_COURSE_EVENT));
  }
};

export const clearAllLocalLearningState = (): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(AUTH_CACHED_STORAGE_KEY);
    window.localStorage.removeItem(SESSION_TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(DIRTY_OFFLINE_STORAGE_KEY);
    window.localStorage.removeItem(ACTIVE_COURSE_STORAGE_KEY);
    window.localStorage.removeItem(LEARNING_MODE_STORAGE_KEY);
    window.localStorage.removeItem(COMPLETED_LESSONS_STORAGE_KEY);
    window.localStorage.removeItem(COMPLETED_AT_STORAGE_KEY);
    window.localStorage.removeItem(LAST_VIEWED_AT_STORAGE_KEY);
    window.localStorage.removeItem(QUIZ_ATTEMPTS_STORAGE_KEY);
    for (const cSlug of VALID_COURSE_SLUGS) {
      window.localStorage.removeItem(`${ACTIVE_MODULE_PREFIX}${cSlug}`);
    }
  } catch {
    // ignore storage failures
  }
  notifyLearningStateUpdated(true);
};

export const readCompletedSlugs = (): string[] => {
  if (!isAuthCacheAllowed()) return [];
  try {
    const raw = window.localStorage.getItem(COMPLETED_LESSONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === 'string')
      : [];
  } catch {
    return [];
  }
};

export const readCompletedAtMap = (): Record<string, number> => {
  if (!isAuthCacheAllowed()) return {};
  return safeParseRecord<number>(window.localStorage.getItem(COMPLETED_AT_STORAGE_KEY));
};

export const toggleCompletedLessonInStore = (
  slug: string,
  now = Date.now()
): string[] => {
  if (!isAuthCacheAllowed()) return [];
  const current = readCompletedSlugs();
  const completedAt = readCompletedAtMap();
  const exists = current.includes(slug);

  const updated = exists ? current.filter((s) => s !== slug) : [...current, slug];
  if (exists) {
    delete completedAt[slug];
  } else {
    completedAt[slug] = now;
  }

  try {
    window.localStorage.setItem(COMPLETED_LESSONS_STORAGE_KEY, JSON.stringify(updated));
    window.localStorage.setItem(COMPLETED_AT_STORAGE_KEY, JSON.stringify(completedAt));
    markDirtyOffline(true);
    notifyLearningStateUpdated(false);
  } catch {
    // ignore storage failures
  }

  return updated;
};

export const readStoredActiveCourseState = (): ActiveCourseState | null => {
  if (!isAuthCacheAllowed()) return null;
  try {
    const raw = window.localStorage.getItem(ACTIVE_COURSE_STORAGE_KEY);
    return parseActiveCourseState(raw, VALID_COURSE_SLUGS, VALID_LESSON_SLUGS_BY_COURSE);
  } catch {
    return null;
  }
};

export const writeActiveCourseToStore = (
  courseSlug: string,
  lessonSlug?: string,
  now = Date.now()
): ActiveCourseState | null => {
  if (!isAuthCacheAllowed() || !VALID_COURSE_SLUGS.includes(courseSlug)) return null;

  const current = readStoredActiveCourseState();
  const validLesson =
    lessonSlug && (VALID_LESSON_SLUGS_BY_COURSE[courseSlug] ?? []).includes(lessonSlug)
      ? lessonSlug
      : undefined;

  if (
    current &&
    current.courseSlug === courseSlug &&
    current.lessonSlug === validLesson
  ) {
    return current;
  }

  const next = mergeActiveCourseUpdate(current, courseSlug, validLesson, now);
  try {
    window.localStorage.setItem(ACTIVE_COURSE_STORAGE_KEY, JSON.stringify(next));
    markDirtyOffline(true);
    notifyLearningStateUpdated(true);
  } catch {
    // ignore storage failures
  }
  return next;
};

export const clearActiveCourseInStore = (): void => {
  if (!isAuthCacheAllowed()) return;
  try {
    window.localStorage.removeItem(ACTIVE_COURSE_STORAGE_KEY);
    markDirtyOffline(true);
    notifyLearningStateUpdated(true);
  } catch {
    // ignore storage failures
  }
};

export const readStoredLearningMode = (): LearningMode => {
  if (!isAuthCacheAllowed()) return 'all';
  try {
    return parseLearningMode(window.localStorage.getItem(LEARNING_MODE_STORAGE_KEY));
  } catch {
    return 'all';
  }
};

export const writeLearningModeToStore = (mode: LearningMode): void => {
  if (!isAuthCacheAllowed()) return;
  try {
    window.localStorage.setItem(LEARNING_MODE_STORAGE_KEY, mode);
    markDirtyOffline(true);
    notifyLearningStateUpdated(false);
  } catch {
    // ignore storage failures
  }
};

export const readLastViewedAtMap = (): Record<string, number> => {
  if (!isAuthCacheAllowed()) return {};
  return safeParseRecord<number>(window.localStorage.getItem(LAST_VIEWED_AT_STORAGE_KEY));
};

export const recordLessonViewed = (lessonSlug: string, now = Date.now()): void => {
  if (!isAuthCacheAllowed() || !lessonSlug) return;
  try {
    const current = readLastViewedAtMap();
    const prevTs = current[lessonSlug] ?? 0;
    if (now - prevTs < 30_000) return;
    current[lessonSlug] = now;
    window.localStorage.setItem(LAST_VIEWED_AT_STORAGE_KEY, JSON.stringify(current));
    markDirtyOffline(true);
    notifyLearningStateUpdated(false);
  } catch {
    // ignore storage failures
  }
};

export const readQuizAttempts = (): Record<string, QuizAttemptRecord> => {
  if (!isAuthCacheAllowed()) return {};
  return safeParseRecord<QuizAttemptRecord>(
    window.localStorage.getItem(QUIZ_ATTEMPTS_STORAGE_KEY)
  );
};

export const saveQuizAttempt = (
  lessonSlug: string,
  courseSlug: string,
  questionId: string,
  selectedOptionIndex: number,
  isCorrect: boolean,
  now = Date.now()
): Record<string, QuizAttemptRecord> => {
  if (!isAuthCacheAllowed()) return {};
  const attempts = readQuizAttempts();
  const attemptKey = makeAttemptKey(lessonSlug, questionId);
  attempts[attemptKey] = {
    attemptKey,
    lessonSlug,
    courseSlug,
    questionId,
    selectedOptionIndex,
    isCorrect,
    answeredAt: now,
  };
  try {
    window.localStorage.setItem(QUIZ_ATTEMPTS_STORAGE_KEY, JSON.stringify(attempts));
    markDirtyOffline(true);
    notifyLearningStateUpdated(false);
  } catch {
    // ignore storage failures
  }
  return attempts;
};

export const deleteQuizAttempt = (
  lessonSlug: string,
  questionId: string
): Record<string, QuizAttemptRecord> => {
  if (!isAuthCacheAllowed()) return {};
  const attempts = readQuizAttempts();
  const attemptKey = makeAttemptKey(lessonSlug, questionId);
  delete attempts[attemptKey];
  try {
    window.localStorage.setItem(QUIZ_ATTEMPTS_STORAGE_KEY, JSON.stringify(attempts));
    markDirtyOffline(true);
    notifyLearningStateUpdated(false);
  } catch {
    // ignore storage failures
  }
  return attempts;
};

export const readActiveModuleForCourse = (courseSlug: string): number | null => {
  if (!isAuthCacheAllowed()) return null;
  try {
    const raw = window.localStorage.getItem(`${ACTIVE_MODULE_PREFIX}${courseSlug}`);
    if (raw === null) return null;
    const parsed = Number(raw);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  } catch {
    return null;
  }
};

export const writeActiveModuleForCourse = (
  courseSlug: string,
  moduleId: number | null
): void => {
  if (!isAuthCacheAllowed()) return;
  try {
    if (moduleId !== null) {
      window.localStorage.setItem(`${ACTIVE_MODULE_PREFIX}${courseSlug}`, String(moduleId));
    } else {
      window.localStorage.removeItem(`${ACTIVE_MODULE_PREFIX}${courseSlug}`);
    }
    markDirtyOffline(true);
    notifyLearningStateUpdated(false);
  } catch {
    // ignore storage failures
  }
};

export const readActiveModulesByCourse = (): Record<string, number> => {
  if (!isAuthCacheAllowed()) return {};
  const map: Record<string, number> = {};
  for (const cSlug of VALID_COURSE_SLUGS) {
    const modId = readActiveModuleForCourse(cSlug);
    if (modId !== null) {
      map[cSlug] = modId;
    }
  }
  return map;
};

export const readLocalSnapshot = (): LocalLearningSnapshot => {
  if (!isAuthCacheAllowed()) {
    return createEmptySnapshot();
  }

  const activeCourse = readStoredActiveCourseState();
  const learningMode = readStoredLearningMode();
  const completedSlugs = readCompletedSlugs();
  const completedAtBySlug = readCompletedAtMap();
  const lastViewedAtBySlug = readLastViewedAtMap();
  const quizAttempts = readQuizAttempts();
  const activeModulesByCourse = readActiveModulesByCourse();

  const timestamps = [
    activeCourse?.updatedAt ?? 0,
    ...Object.values(completedAtBySlug),
    ...Object.values(lastViewedAtBySlug),
    ...Object.values(quizAttempts).map((a) => a.answeredAt),
  ].filter((n) => typeof n === 'number' && Number.isFinite(n));

  return {
    activeCourse,
    learningMode,
    completedSlugs,
    completedAtBySlug,
    lastViewedAtBySlug,
    quizAttempts,
    activeModulesByCourse,
    updatedAt: timestamps.length > 0 ? Math.max(...timestamps) : Date.now(),
  };
};

export const applySnapshotToLocalStorage = (snapshot: LocalLearningSnapshot): void => {
  if (typeof window === 'undefined') return;

  try {
    markAuthCacheEnabled(true);

    if (snapshot.activeCourse) {
      window.localStorage.setItem(
        ACTIVE_COURSE_STORAGE_KEY,
        JSON.stringify(snapshot.activeCourse)
      );
    } else {
      window.localStorage.removeItem(ACTIVE_COURSE_STORAGE_KEY);
    }

    window.localStorage.setItem(LEARNING_MODE_STORAGE_KEY, snapshot.learningMode);
    window.localStorage.setItem(
      COMPLETED_LESSONS_STORAGE_KEY,
      JSON.stringify(snapshot.completedSlugs)
    );
    window.localStorage.setItem(
      COMPLETED_AT_STORAGE_KEY,
      JSON.stringify(snapshot.completedAtBySlug)
    );
    window.localStorage.setItem(
      LAST_VIEWED_AT_STORAGE_KEY,
      JSON.stringify(snapshot.lastViewedAtBySlug)
    );
    window.localStorage.setItem(
      QUIZ_ATTEMPTS_STORAGE_KEY,
      JSON.stringify(snapshot.quizAttempts)
    );

    for (const cSlug of VALID_COURSE_SLUGS) {
      const modId = snapshot.activeModulesByCourse[cSlug];
      if (typeof modId === 'number' && Number.isFinite(modId)) {
        window.localStorage.setItem(`${ACTIVE_MODULE_PREFIX}${cSlug}`, String(modId));
      } else {
        window.localStorage.removeItem(`${ACTIVE_MODULE_PREFIX}${cSlug}`);
      }
    }

    notifyLearningStateUpdated(true);
  } catch (err) {
    console.error('Failed to apply snapshot to localStorage', err);
  }
};
