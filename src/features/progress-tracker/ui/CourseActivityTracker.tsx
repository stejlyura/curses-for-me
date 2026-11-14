'use client';

import { useEffect } from 'react';
import { useActiveCourse } from '../model/useActiveCourse';

interface CourseActivityTrackerProps {
  courseSlug: string;
  lessonSlug?: string;
}

export const CourseActivityTracker = ({
  courseSlug,
  lessonSlug,
}: CourseActivityTrackerProps): null => {
  const { setActiveCourse } = useActiveCourse();

  useEffect(() => {
    setActiveCourse(courseSlug, lessonSlug);
  }, [courseSlug, lessonSlug, setActiveCourse]);

  return null;
};
