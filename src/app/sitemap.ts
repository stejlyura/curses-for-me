import type { MetadataRoute } from 'next';
import { getAllLessons } from '@/shared/lib/content-loader';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://marketolog-course.vercel.app';
  const lessons = getAllLessons();

  const lessonUrls = lessons.map((lesson) => ({
    url: `${baseUrl}/lessons/${lesson.slug}/`,
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
    ...lessonUrls,
  ];
}

