import {
  ActiveCourseState,
  LearningMode,
  parseLearningMode,
} from '@/features/progress-tracker/model/active-course';
import type {
  LocalLearningSnapshot,
  QuizAttemptRecord,
} from '@/features/progress-tracker/model/learning-types';

export interface FirestoreLearningStateDoc {
  owner: string;
  activeCourseSlug: string;
  activeLessonSlug: string;
  activeCourseUpdatedAt: number;
  learningMode: LearningMode;
  completedSlugs: string[];
  completedAtBySlug: Record<string, number>;
  lastViewedAtBySlug: Record<string, number>;
  quizAttempts: Record<string, QuizAttemptRecord>;
  activeModulesByCourse: Record<string, number>;
  clientUpdatedAt: number;
}

const isPlainRecord = (val: unknown): val is Record<string, unknown> =>
  Boolean(val) && typeof val === 'object' && !Array.isArray(val);

export const sanitizeLearningSnapshot = (
  raw: unknown,
  validCourseSlugs: string[],
  validLessonSlugsByCourse: Record<string, string[]>,
  now: number = Date.now()
): LocalLearningSnapshot => {
  const validCourseSet = new Set(validCourseSlugs);
  const allValidLessonsSet = new Set(Object.values(validLessonSlugsByCourse).flat());
  const data = isPlainRecord(raw) ? raw : {};

  let activeCourse: ActiveCourseState | null = null;
  if (isPlainRecord(data.activeCourse)) {
    const cSlug = data.activeCourse.courseSlug;
    if (typeof cSlug === 'string' && validCourseSet.has(cSlug)) {
      const courseLessons = validLessonSlugsByCourse[cSlug] ?? [];
      const lSlug = data.activeCourse.lessonSlug;
      const validLesson =
        typeof lSlug === 'string' && courseLessons.includes(lSlug) ? lSlug : undefined;
      const updatedAt =
        typeof data.activeCourse.updatedAt === 'number' &&
        Number.isFinite(data.activeCourse.updatedAt) &&
        data.activeCourse.updatedAt >= 0
          ? data.activeCourse.updatedAt
          : now;
      activeCourse = {
        courseSlug: cSlug,
        lessonSlug: validLesson,
        updatedAt,
      };
    }
  }

  const learningMode = parseLearningMode(
    typeof data.learningMode === 'string' ? data.learningMode : null
  );

  const completedSet = new Set<string>();
  if (Array.isArray(data.completedSlugs)) {
    for (const slug of data.completedSlugs) {
      if (typeof slug === 'string' && allValidLessonsSet.has(slug)) {
        completedSet.add(slug);
      }
      if (completedSet.size >= 500) break;
    }
  }

  const completedAtBySlug: Record<string, number> = {};
  if (isPlainRecord(data.completedAtBySlug)) {
    for (const [slug, ts] of Object.entries(data.completedAtBySlug)) {
      if (
        allValidLessonsSet.has(slug) &&
        typeof ts === 'number' &&
        Number.isFinite(ts) &&
        ts > 0
      ) {
        completedAtBySlug[slug] = ts;
      }
      if (Object.keys(completedAtBySlug).length >= 500) break;
    }
  }

  const lastViewedAtBySlug: Record<string, number> = {};
  if (isPlainRecord(data.lastViewedAtBySlug)) {
    for (const [slug, ts] of Object.entries(data.lastViewedAtBySlug)) {
      if (
        allValidLessonsSet.has(slug) &&
        typeof ts === 'number' &&
        Number.isFinite(ts) &&
        ts > 0
      ) {
        lastViewedAtBySlug[slug] = ts;
      }
      if (Object.keys(lastViewedAtBySlug).length >= 500) break;
    }
  }

  const quizAttempts: Record<string, QuizAttemptRecord> = {};
  if (isPlainRecord(data.quizAttempts)) {
    for (const [key, item] of Object.entries(data.quizAttempts)) {
      if (!isPlainRecord(item)) continue;
      const { lessonSlug, courseSlug, questionId, selectedOptionIndex, isCorrect, answeredAt } =
        item;
      if (
        typeof lessonSlug === 'string' &&
        allValidLessonsSet.has(lessonSlug) &&
        typeof courseSlug === 'string' &&
        validCourseSet.has(courseSlug) &&
        typeof questionId === 'string' &&
        questionId.length > 0 &&
        questionId.length <= 120 &&
        typeof selectedOptionIndex === 'number' &&
        Number.isInteger(selectedOptionIndex) &&
        selectedOptionIndex >= 0 &&
        typeof isCorrect === 'boolean'
      ) {
        quizAttempts[key.slice(0, 200)] = {
          attemptKey: key.slice(0, 200),
          lessonSlug,
          courseSlug,
          questionId,
          selectedOptionIndex,
          isCorrect,
          answeredAt:
            typeof answeredAt === 'number' && Number.isFinite(answeredAt) && answeredAt > 0
              ? answeredAt
              : now,
        };
      }
      if (Object.keys(quizAttempts).length >= 500) break;
    }
  }

  const activeModulesByCourse: Record<string, number> = {};
  if (isPlainRecord(data.activeModulesByCourse)) {
    for (const [cSlug, modId] of Object.entries(data.activeModulesByCourse)) {
      if (
        validCourseSet.has(cSlug) &&
        typeof modId === 'number' &&
        Number.isInteger(modId) &&
        modId > 0
      ) {
        activeModulesByCourse[cSlug] = modId;
      }
      if (Object.keys(activeModulesByCourse).length >= 20) break;
    }
  }

  const updatedAt =
    typeof data.updatedAt === 'number' && Number.isFinite(data.updatedAt) && data.updatedAt >= 0
      ? data.updatedAt
      : now;

  return {
    activeCourse,
    learningMode,
    completedSlugs: Array.from(completedSet).sort(),
    completedAtBySlug,
    lastViewedAtBySlug,
    quizAttempts,
    activeModulesByCourse,
    updatedAt,
  };
};

export const snapshotToFirestoreDoc = (
  owner: string,
  snapshot: LocalLearningSnapshot
): FirestoreLearningStateDoc => ({
  owner,
  activeCourseSlug: snapshot.activeCourse?.courseSlug ?? '',
  activeLessonSlug: snapshot.activeCourse?.lessonSlug ?? '',
  activeCourseUpdatedAt: snapshot.activeCourse?.updatedAt ?? 0,
  learningMode: snapshot.learningMode,
  completedSlugs: snapshot.completedSlugs.slice(0, 500),
  completedAtBySlug: snapshot.completedAtBySlug,
  lastViewedAtBySlug: snapshot.lastViewedAtBySlug,
  quizAttempts: snapshot.quizAttempts,
  activeModulesByCourse: snapshot.activeModulesByCourse,
  clientUpdatedAt: snapshot.updatedAt,
});

export const firestoreDocToSnapshot = (
  raw: Record<string, unknown>,
  validCourseSlugs: string[],
  validLessonSlugsByCourse: Record<string, string[]>
): LocalLearningSnapshot => {
  const courseSlug = typeof raw.activeCourseSlug === 'string' ? raw.activeCourseSlug : '';
  const lessonSlug = typeof raw.activeLessonSlug === 'string' ? raw.activeLessonSlug : '';
  const courseUpdatedAt =
    typeof raw.activeCourseUpdatedAt === 'number' ? raw.activeCourseUpdatedAt : 0;

  return sanitizeLearningSnapshot(
    {
      activeCourse: courseSlug
        ? {
            courseSlug,
            lessonSlug: lessonSlug || undefined,
            updatedAt: courseUpdatedAt || Date.now(),
          }
        : null,
      learningMode: raw.learningMode,
      completedSlugs: raw.completedSlugs,
      completedAtBySlug: raw.completedAtBySlug,
      lastViewedAtBySlug: raw.lastViewedAtBySlug,
      quizAttempts: raw.quizAttempts,
      activeModulesByCourse: raw.activeModulesByCourse,
      updatedAt: typeof raw.clientUpdatedAt === 'number' ? raw.clientUpdatedAt : Date.now(),
    },
    validCourseSlugs,
    validLessonSlugsByCourse
  );
};
