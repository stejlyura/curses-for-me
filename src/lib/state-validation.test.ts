import test from 'node:test';
import assert from 'node:assert/strict';
import {
  firestoreDocToSnapshot,
  sanitizeLearningSnapshot,
  snapshotToFirestoreDoc,
} from './state-validation';

const COURSES = ['senior-marketing', 'media-buying'];
const LESSONS_BY_COURSE = {
  'senior-marketing': ['1-1-unit-economics', '1-2-ltv-cac'],
  'media-buying': ['7-1-roas-mer'],
};

test('sanitizeLearningSnapshot strips invalid courses, lessons, and out-of-bounds payloads', () => {
  const sanitized = sanitizeLearningSnapshot(
    {
      activeCourse: {
        courseSlug: 'media-buying',
        lessonSlug: 'not-a-real-lesson',
        updatedAt: 1700000000000,
      },
      learningMode: 'invalid-mode',
      completedSlugs: ['1-1-unit-economics', 'hacked-slug', '1-1-unit-economics'],
      completedAtBySlug: { '1-1-unit-economics': 1700000000001, 'hacked-slug': 999 },
      lastViewedAtBySlug: { '7-1-roas-mer': 1700000000002 },
      quizAttempts: {
        '7-1-roas-mer::q1': {
          lessonSlug: '7-1-roas-mer',
          courseSlug: 'media-buying',
          questionId: 'q1',
          selectedOptionIndex: 1,
          isCorrect: true,
          answeredAt: 1700000000003,
        },
        bad: {
          lessonSlug: 'fake',
          courseSlug: 'media-buying',
          questionId: 'q2',
          selectedOptionIndex: 0,
          isCorrect: false,
        },
      },
      activeModulesByCourse: { 'media-buying': 7, unknown: 3, 'senior-marketing': -1 },
      updatedAt: 1700000005000,
    },
    COURSES,
    LESSONS_BY_COURSE,
    1700000005000
  );

  assert.deepEqual(sanitized.activeCourse, {
    courseSlug: 'media-buying',
    lessonSlug: undefined,
    updatedAt: 1700000000000,
  });
  assert.equal(sanitized.learningMode, 'all');
  assert.deepEqual(sanitized.completedSlugs, ['1-1-unit-economics']);
  assert.deepEqual(sanitized.completedAtBySlug, { '1-1-unit-economics': 1700000000001 });
  assert.deepEqual(sanitized.activeModulesByCourse, { 'media-buying': 7 });
  assert.equal(Object.keys(sanitized.quizAttempts).length, 1);
});

test('snapshotToFirestoreDoc and firestoreDocToSnapshot roundtrip cleanly without JSON strings', () => {
  const input = sanitizeLearningSnapshot(
    {
      activeCourse: {
        courseSlug: 'senior-marketing',
        lessonSlug: '1-2-ltv-cac',
        updatedAt: 1700000100000,
      },
      learningMode: 'foundation',
      completedSlugs: ['1-1-unit-economics'],
      completedAtBySlug: { '1-1-unit-economics': 1700000090000 },
      lastViewedAtBySlug: { '1-2-ltv-cac': 1700000100000 },
      quizAttempts: {},
      activeModulesByCourse: { 'senior-marketing': 1 },
      updatedAt: 1700000100000,
    },
    COURSES,
    LESSONS_BY_COURSE
  );

  const doc = snapshotToFirestoreDoc('admin', input);
  assert.equal(doc.owner, 'admin');
  assert.equal(doc.activeCourseSlug, 'senior-marketing');
  assert.equal(doc.activeLessonSlug, '1-2-ltv-cac');

  const roundtripped = firestoreDocToSnapshot(
    doc as unknown as Record<string, unknown>,
    COURSES,
    LESSONS_BY_COURSE
  );
  assert.deepEqual(roundtripped, input);
});
