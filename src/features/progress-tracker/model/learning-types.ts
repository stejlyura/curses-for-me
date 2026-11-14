import type { ActiveCourseState, LearningMode } from './active-course';

export interface QuizAttemptRecord {
  attemptKey: string;
  lessonSlug: string;
  courseSlug: string;
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  answeredAt: number;
}

export interface LocalLearningSnapshot {
  activeCourse: ActiveCourseState | null;
  learningMode: LearningMode;
  completedSlugs: string[];
  completedAtBySlug: Record<string, number>;
  lastViewedAtBySlug: Record<string, number>;
  quizAttempts: Record<string, QuizAttemptRecord>;
  activeModulesByCourse: Record<string, number>;
  updatedAt: number;
}

export const makeAttemptKey = (lessonSlug: string, questionId: string): string =>
  `${lessonSlug}::${questionId}`;

export const createEmptySnapshot = (now = Date.now()): LocalLearningSnapshot => ({
  activeCourse: null,
  learningMode: 'all',
  completedSlugs: [],
  completedAtBySlug: {},
  lastViewedAtBySlug: {},
  quizAttempts: {},
  activeModulesByCourse: {},
  updatedAt: now,
});

export const mergeSnapshots = (
  local: LocalLearningSnapshot,
  remote: LocalLearningSnapshot
): LocalLearningSnapshot => {
  const completedSet = new Set<string>([...local.completedSlugs, ...remote.completedSlugs]);

  const completedAtBySlug: Record<string, number> = { ...remote.completedAtBySlug };
  for (const [slug, ts] of Object.entries(local.completedAtBySlug)) {
    completedAtBySlug[slug] = Math.max(completedAtBySlug[slug] ?? 0, ts);
  }

  const lastViewedAtBySlug: Record<string, number> = { ...remote.lastViewedAtBySlug };
  for (const [slug, ts] of Object.entries(local.lastViewedAtBySlug)) {
    lastViewedAtBySlug[slug] = Math.max(lastViewedAtBySlug[slug] ?? 0, ts);
  }

  const quizAttempts: Record<string, QuizAttemptRecord> = { ...remote.quizAttempts };
  for (const [key, localAttempt] of Object.entries(local.quizAttempts)) {
    const remoteAttempt = quizAttempts[key];
    if (!remoteAttempt || localAttempt.answeredAt >= remoteAttempt.answeredAt) {
      quizAttempts[key] = localAttempt;
    }
  }

  const remoteWinsScalar = remote.updatedAt > local.updatedAt;
  const activeCourse = (() => {
    if (!local.activeCourse) return remote.activeCourse;
    if (!remote.activeCourse) return local.activeCourse;
    return remote.activeCourse.updatedAt > local.activeCourse.updatedAt
      ? remote.activeCourse
      : local.activeCourse;
  })();

  return {
    activeCourse,
    learningMode: remoteWinsScalar ? remote.learningMode : local.learningMode,
    completedSlugs: Array.from(completedSet).sort(),
    completedAtBySlug,
    lastViewedAtBySlug,
    quizAttempts,
    activeModulesByCourse: remoteWinsScalar
      ? { ...local.activeModulesByCourse, ...remote.activeModulesByCourse }
      : { ...remote.activeModulesByCourse, ...local.activeModulesByCourse },
    updatedAt: Math.max(local.updatedAt, remote.updatedAt),
  };
};
