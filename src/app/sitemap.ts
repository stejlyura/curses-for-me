import type { MetadataRoute } from 'next';
import { getAllCourses, getAllLessons } from '@/shared/lib/content-loader';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://marketolog-course.vercel.app';
  const courses = getAllCourses();
  const lessons = getAllLessons();

  const courseUrls = courses.map((course) => ({
    url: `${baseUrl}/courses/${course.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  const lessonUrls = lessons.map((lesson) => ({
    url: `${baseUrl}/courses/${lesson.courseSlug ?? 'senior-marketing'}/lessons/${lesson.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...courseUrls,
    ...lessonUrls,
  ];
}
