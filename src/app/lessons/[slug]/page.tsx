import { redirect } from 'next/navigation';
import { getAllLessons } from '@/shared/lib/content-loader';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const lessons = getAllLessons();
  return lessons.map((lesson) => ({
    slug: lesson.slug,
  }));
}

export default async function LegacyLessonPage({ params }: PageProps): Promise<never> {
  const { slug } = await params;
  redirect(`/courses/senior-marketing/lessons/${slug}/`);
}
