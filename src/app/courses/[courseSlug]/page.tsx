import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getAllCourses,
  getCourseBySlug,
  getModulesByCourseSlug,
  getLessonsByCourseSlug,
} from '@/shared/lib/content-loader';
import { CourseOverviewContent } from '@/widgets/course-overview/ui/CourseOverviewContent';

interface PageProps {
  params: Promise<{
    courseSlug: string;
  }>;
}

export async function generateStaticParams() {
  const courses = getAllCourses();
  return courses.map((course) => ({
    courseSlug: course.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { courseSlug } = await params;
  const course = getCourseBySlug(courseSlug);

  if (!course) {
    return {
      title: 'Курс не найден | Marketolog Academy',
    };
  }

  return {
    title: `${course.title} — Практический курс | Marketolog`,
    description: course.shortDescription,
    openGraph: {
      title: `${course.title} | Marketolog Academy`,
      description: course.shortDescription,
      type: 'website',
    },
  };
}

export default async function CourseDetailPage({ params }: PageProps): Promise<React.JSX.Element> {
  const { courseSlug } = await params;
  const course = getCourseBySlug(courseSlug);

  if (!course) {
    notFound();
  }

  const modules = getModulesByCourseSlug(courseSlug);
  const lessons = getLessonsByCourseSlug(courseSlug);

  return <CourseOverviewContent course={course} modules={modules} lessons={lessons} />;
}
