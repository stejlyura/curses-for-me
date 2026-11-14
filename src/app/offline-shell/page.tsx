'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  getCourseBySlug,
  getModulesByCourseSlug,
  getLessonsByCourseSlug,
  getLessonBySlug,
} from '@/shared/lib/content-loader';
import { parseOfflinePath } from '@/features/progress-tracker/model/active-course';
import { CourseOverviewContent } from '@/widgets/course-overview/ui/CourseOverviewContent';
import { LessonViewer } from '@/widgets/lesson-viewer/ui/LessonViewer';
import { ModuleNav } from '@/widgets/sidebar/ui/ModuleNav';

export default function OfflineShellPage(): React.JSX.Element {
  const [pathname, setPathname] = useState<string | null>(null);

  useEffect(() => {
    setPathname(window.location.pathname);

    const handlePopState = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (pathname === null) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-sm text-zinc-400">
        Загрузка оффлайн-версии...
      </div>
    );
  }

  const route = parseOfflinePath(pathname);

  if (route.type === 'course') {
    const course = getCourseBySlug(route.courseSlug);
    if (course) {
      const modules = getModulesByCourseSlug(course.slug);
      const lessons = getLessonsByCourseSlug(course.slug);
      return <CourseOverviewContent course={course} modules={modules} lessons={lessons} />;
    }
  }

  if (route.type === 'lesson') {
    const lesson = getLessonBySlug(route.lessonSlug);
    if (lesson) {
      const resolvedCourseSlug = route.courseSlug ?? lesson.courseSlug ?? 'senior-marketing';
      const courseLessons = getLessonsByCourseSlug(resolvedCourseSlug);
      const currentIndex = courseLessons.findIndex((l) => l.slug === lesson.slug);
      const prevLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : undefined;
      const nextLesson =
        currentIndex >= 0 && currentIndex < courseLessons.length - 1
          ? courseLessons[currentIndex + 1]
          : undefined;

      return (
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
          <ModuleNav courseSlug={resolvedCourseSlug} />
          <main className="flex-1 overflow-y-auto">
            <LessonViewer
              lesson={lesson}
              courseSlug={resolvedCourseSlug}
              prevLesson={prevLesson}
              nextLesson={nextLesson}
            />
          </main>
        </div>
      );
    }
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-20 space-y-4">
      <h1 className="text-xl font-bold text-white">Страница недоступна оффлайн</h1>
      <p className="text-sm text-zinc-400">
        Вернитесь на главную страницу, чтобы открыть доступные курсы и уроки.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-4 py-2 rounded-lg text-xs font-semibold bg-zinc-100 text-zinc-950 hover:bg-white transition-colors"
      >
        На главную
      </Link>
    </div>
  );
}
