import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseActiveCourseState,
  mergeActiveCourseUpdate,
  resolveResumeHref,
  parseLearningMode,
  parseOfflinePath,
} from './active-course';

const COURSES = ['senior-marketing', 'media-buying'];
const LESSONS_BY_COURSE = {
  'senior-marketing': ['1-1-ltv-calculation-models', '1-2-cac-mechanics-and-payback'],
  'media-buying': ['7-1-auction-dynamics'],
};
const FIRST_LESSON_BY_COURSE = {
  'senior-marketing': '1-1-ltv-calculation-models',
  'media-buying': '7-1-auction-dynamics',
};

test('parseActiveCourseState validates course and lesson slugs safely', () => {
  assert.equal(parseActiveCourseState(null, COURSES, LESSONS_BY_COURSE), null);
  assert.equal(parseActiveCourseState('not-json{', COURSES, LESSONS_BY_COURSE), null);
  assert.equal(
    parseActiveCourseState(
      JSON.stringify({ courseSlug: 'unknown-course', updatedAt: 100 }),
      COURSES,
      LESSONS_BY_COURSE
    ),
    null
  );

  const valid = parseActiveCourseState(
    JSON.stringify({
      courseSlug: 'senior-marketing',
      lessonSlug: '1-2-cac-mechanics-and-payback',
      updatedAt: 12345,
    }),
    COURSES,
    LESSONS_BY_COURSE
  );
  assert.deepEqual(valid, {
    courseSlug: 'senior-marketing',
    lessonSlug: '1-2-cac-mechanics-and-payback',
    updatedAt: 12345,
  });

  // Invalid lessonSlug for that course is dropped while preserving valid courseSlug
  const crossCourseLesson = parseActiveCourseState(
    JSON.stringify({
      courseSlug: 'media-buying',
      lessonSlug: '1-1-ltv-calculation-models',
      updatedAt: 999,
    }),
    COURSES,
    LESSONS_BY_COURSE
  );
  assert.deepEqual(crossCourseLesson, {
    courseSlug: 'media-buying',
    lessonSlug: undefined,
    updatedAt: 999,
  });
});

test('mergeActiveCourseUpdate preserves lessonSlug on same course overview visit and resets on course switch', () => {
  const initial = {
    courseSlug: 'senior-marketing',
    lessonSlug: '1-2-cac-mechanics-and-payback',
    updatedAt: 100,
  };

  const sameCourseOverview = mergeActiveCourseUpdate(initial, 'senior-marketing', undefined, 200);
  assert.deepEqual(sameCourseOverview, {
    courseSlug: 'senior-marketing',
    lessonSlug: '1-2-cac-mechanics-and-payback',
    updatedAt: 200,
  });

  const switchedCourse = mergeActiveCourseUpdate(initial, 'media-buying', undefined, 300);
  assert.deepEqual(switchedCourse, {
    courseSlug: 'media-buying',
    lessonSlug: undefined,
    updatedAt: 300,
  });
});

test('resolveResumeHref resolves lesson URL, falls back to first lesson, or course root', () => {
  assert.equal(resolveResumeHref(null, FIRST_LESSON_BY_COURSE), null);
  assert.equal(
    resolveResumeHref(
      {
        courseSlug: 'senior-marketing',
        lessonSlug: '1-2-cac-mechanics-and-payback',
        updatedAt: 1,
      },
      FIRST_LESSON_BY_COURSE
    ),
    '/courses/senior-marketing/lessons/1-2-cac-mechanics-and-payback/'
  );
  assert.equal(
    resolveResumeHref(
      { courseSlug: 'media-buying', updatedAt: 1 },
      FIRST_LESSON_BY_COURSE
    ),
    '/courses/media-buying/lessons/7-1-auction-dynamics/'
  );
  assert.equal(
    resolveResumeHref(
      { courseSlug: 'affiliate-manager', updatedAt: 1 },
      FIRST_LESSON_BY_COURSE
    ),
    '/courses/affiliate-manager/'
  );
});

test('parseLearningMode falls back cleanly to all', () => {
  assert.equal(parseLearningMode('foundation'), 'foundation');
  assert.equal(parseLearningMode('senior'), 'senior');
  assert.equal(parseLearningMode('all'), 'all');
  assert.equal(parseLearningMode(null), 'all');
  assert.equal(parseLearningMode('invalid'), 'all');
});

test('parseOfflinePath parses home, course, course lesson, and standalone lesson routes', () => {
  assert.deepEqual(parseOfflinePath('/'), { type: 'home' });
  assert.deepEqual(parseOfflinePath('/?source=pwa'), { type: 'home' });
  assert.deepEqual(parseOfflinePath('/offline-shell/'), { type: 'home' });
  assert.deepEqual(parseOfflinePath('/courses/senior-marketing/'), {
    type: 'course',
    courseSlug: 'senior-marketing',
  });
  assert.deepEqual(
    parseOfflinePath('/courses/media-buying/lessons/7-1-auction-dynamics/'),
    {
      type: 'lesson',
      courseSlug: 'media-buying',
      lessonSlug: '7-1-auction-dynamics',
    }
  );
  assert.deepEqual(parseOfflinePath('/lessons/1-1-ltv-calculation-models'), {
    type: 'lesson',
    lessonSlug: '1-1-ltv-calculation-models',
  });
  assert.deepEqual(parseOfflinePath('/unknown/route/'), { type: 'unknown' });
});
