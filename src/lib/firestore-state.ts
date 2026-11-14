import { getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { coursesData } from '@/shared/data/courses';
import { allLessonsData } from '@/shared/data/lessons';
import type { LocalLearningSnapshot } from '@/features/progress-tracker/model/learning-types';
import { mergeSnapshots } from '@/features/progress-tracker/model/learning-types';
import { getVaultStateDocRef } from './firebase-server';
import {
  firestoreDocToSnapshot,
  sanitizeLearningSnapshot,
  snapshotToFirestoreDoc,
} from './state-validation';

const VALID_COURSE_SLUGS = coursesData.map((c) => c.slug);

const VALID_LESSON_SLUGS_BY_COURSE: Record<string, string[]> = {};
for (const course of coursesData) {
  VALID_LESSON_SLUGS_BY_COURSE[course.slug] = allLessonsData
    .filter((l) => (l.courseSlug ?? 'senior-marketing') === course.slug)
    .map((l) => l.slug);
}

export const sanitizeUserSnapshot = (raw: unknown): LocalLearningSnapshot =>
  sanitizeLearningSnapshot(raw, VALID_COURSE_SLUGS, VALID_LESSON_SLUGS_BY_COURSE);

export async function readLearningStateFromDb(): Promise<LocalLearningSnapshot | null> {
  try {
    const snap = await getDoc(getVaultStateDocRef());
    if (!snap.exists()) {
      return null;
    }
    const raw = snap.data() as Record<string, unknown>;
    return firestoreDocToSnapshot(raw, VALID_COURSE_SLUGS, VALID_LESSON_SLUGS_BY_COURSE);
  } catch (error) {
    console.error('Firestore readLearningStateFromDb failed:', error);
    throw new Error('Не удалось загрузить состояние обучения из базы данных.', { cause: error });
  }
}

export async function writeLearningStateToDb(
  owner: string,
  incomingRaw: unknown
): Promise<LocalLearningSnapshot> {
  const sanitizedIncoming = sanitizeUserSnapshot(incomingRaw);

  try {
    const docRef = getVaultStateDocRef();
    const existingSnap = await getDoc(docRef);

    let nextState = sanitizedIncoming;
    let createdAtValue: unknown = serverTimestamp();

    if (existingSnap.exists()) {
      const existingData = existingSnap.data() as Record<string, unknown>;
      createdAtValue = existingData.createdAt ?? serverTimestamp();

      const existingState = firestoreDocToSnapshot(
        existingData,
        VALID_COURSE_SLUGS,
        VALID_LESSON_SLUGS_BY_COURSE
      );

      // If an offline/stale client sends an older timestamp than what is already stored,
      // merge progress safely instead of blindly clobbering newer updates from another device.
      if (sanitizedIncoming.updatedAt < existingState.updatedAt) {
        nextState = mergeSnapshots(sanitizedIncoming, existingState);
      }
    }

    const payload = {
      ...snapshotToFirestoreDoc(owner, nextState),
      createdAt: createdAtValue,
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, payload);
    return nextState;
  } catch (error) {
    console.error('Firestore writeLearningStateToDb failed:', error);
    throw new Error('Не удалось сохранить состояние обучения в базу данных.', { cause: error });
  }
}
