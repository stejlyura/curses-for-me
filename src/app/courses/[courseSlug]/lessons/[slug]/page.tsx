import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { 
  getAllCourses, 
  getCourseBySlug, 
  getLessonsByCourseSlug, 
  getLessonBySlug 
} from '@/shared/lib/content-loader';
import { LessonViewer } from '@/widgets/lesson-viewer/ui/LessonViewer';
import { ModuleNav } from '@/widgets/sidebar/ui/ModuleNav';

interface PageProps {
  params: Promise<{
    courseSlug: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const courses = getAllCourses();
  const params: Array<{ courseSlug: string; slug: string }> = [];

  for (const course of courses) {
    const courseLessons = getLessonsByCourseSlug(course.slug);
    for (const lesson of courseLessons) {
      params.push({
        courseSlug: course.slug,
        slug: lesson.slug,
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { courseSlug, slug } = await params;
  const course = getCourseBySlug(courseSlug);
  const lesson = getLessonBySlug(slug);

  if (!lesson) {
    return {
      title: 'Урок не найден | My dataset',
    };
  }

  const title = `${lesson.lessonNumber} ${lesson.title} | ${course?.title || 'My dataset'}`;

  return {
    title,
    description: lesson.summary,
    openGraph: {
      title,
      description: lesson.summary,
      url: `https://my-dataset.vercel.app/courses/${courseSlug}/lessons/${lesson.slug}/`,
      type: 'article',
      siteName: 'My dataset',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: lesson.summary,
    },
  };
}

export default async function CourseLessonPage({ params }: PageProps): Promise<React.JSX.Element> {
  const { courseSlug, slug } = await params;
  const course = getCourseBySlug(courseSlug);
  const lesson = getLessonBySlug(slug);

  if (!course || !lesson) {
    notFound();
  }

  const courseLessons = getLessonsByCourseSlug(courseSlug);
  const currentIndex = courseLessons.findIndex((l) => l.slug === slug);
  const prevLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : undefined;
  const nextLesson = currentIndex >= 0 && currentIndex < courseLessons.length - 1 
    ? courseLessons[currentIndex + 1] 
    : undefined;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
      <ModuleNav courseSlug={courseSlug} />
      <main className="flex-1 overflow-y-auto">
        <LessonViewer
          lesson={lesson}
          courseSlug={courseSlug}
          prevLesson={prevLesson}
          nextLesson={nextLesson}
        />
      </main>
    </div>
  );
}

