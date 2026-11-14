export const ACTIVE_COURSE_STORAGE_KEY = 'marketolog_active_course';
export const LEARNING_MODE_STORAGE_KEY = 'marketolog_learning_mode';
export const ACTIVE_COURSE_EVENT = 'marketolog:active-course-updated';

export type LearningMode = 'all' | 'foundation' | 'senior';

export interface ActiveCourseState {
  courseSlug: string;
  lessonSlug?: string;
  updatedAt: number;
}

export type OfflineRouteMatch =
  | { type: 'home' }
  | { type: 'course'; courseSlug: string }
  | { type: 'lesson'; courseSlug?: string; lessonSlug: string }
  | { type: 'unknown' };

export const parseLearningMode = (raw: string | null): LearningMode => {
  if (raw === 'foundation' || raw === 'senior' || raw === 'all') {
    return raw;
  }
  return 'all';
};

export const parseActiveCourseState = (
  raw: string | null,
  validCourseSlugs: string[],
  validLessonSlugsByCourse: Record<string, string[]>
): ActiveCourseState | null => {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<ActiveCourseState> | null;
    if (!parsed || typeof parsed !== 'object') return null;
    if (typeof parsed.courseSlug !== 'string' || !validCourseSlugs.includes(parsed.courseSlug)) {
      return null;
    }

    const courseLessons = validLessonSlugsByCourse[parsed.courseSlug] ?? [];
    const lessonSlug =
      typeof parsed.lessonSlug === 'string' && courseLessons.includes(parsed.lessonSlug)
        ? parsed.lessonSlug
        : undefined;

    const updatedAt =
      typeof parsed.updatedAt === 'number' && Number.isFinite(parsed.updatedAt)
        ? parsed.updatedAt
        : Date.now();

    return {
      courseSlug: parsed.courseSlug,
      lessonSlug,
      updatedAt,
    };
  } catch {
    return null;
  }
};

export const mergeActiveCourseUpdate = (
  current: ActiveCourseState | null,
  courseSlug: string,
  lessonSlug: string | undefined,
  now: number = Date.now()
): ActiveCourseState => {
  const preservedLessonSlug =
    lessonSlug ?? (current && current.courseSlug === courseSlug ? current.lessonSlug : undefined);

  return {
    courseSlug,
    lessonSlug: preservedLessonSlug,
    updatedAt: now,
  };
};

export const resolveResumeHref = (
  active: ActiveCourseState | null,
  firstLessonByCourse: Record<string, string>
): string | null => {
  if (!active) return null;

  if (active.lessonSlug) {
    return `/courses/${active.courseSlug}/lessons/${active.lessonSlug}/`;
  }

  const firstLesson = firstLessonByCourse[active.courseSlug];
  if (firstLesson) {
    return `/courses/${active.courseSlug}/lessons/${firstLesson}/`;
  }

  return `/courses/${active.courseSlug}/`;
};

export const parseOfflinePath = (pathname: string): OfflineRouteMatch => {
  const cleanPath = pathname.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';

  if (cleanPath === '/' || cleanPath === '/offline-shell') {
    return { type: 'home' };
  }

  const courseLessonMatch = cleanPath.match(/^\/courses\/([^/]+)\/lessons\/([^/]+)$/);
  if (courseLessonMatch) {
    return {
      type: 'lesson',
      courseSlug: decodeURIComponent(courseLessonMatch[1]),
      lessonSlug: decodeURIComponent(courseLessonMatch[2]),
    };
  }

  const courseMatch = cleanPath.match(/^\/courses\/([^/]+)$/);
  if (courseMatch) {
    return {
      type: 'course',
      courseSlug: decodeURIComponent(courseMatch[1]),
    };
  }

  const standaloneLessonMatch = cleanPath.match(/^\/lessons\/([^/]+)$/);
  if (standaloneLessonMatch) {
    return {
      type: 'lesson',
      lessonSlug: decodeURIComponent(standaloneLessonMatch[1]),
    };
  }

  return { type: 'unknown' };
};
