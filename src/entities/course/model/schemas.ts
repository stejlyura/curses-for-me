import { z } from 'zod';

export const CourseLevelEnum = z.enum(['Middle', 'Senior', 'Lead', 'Executive']);

export const CourseStatsSchema = z.object({
  totalLessons: z.number(),
  totalModules: z.number(),
  estimatedHours: z.number(),
  caseCount: z.number(),
});

export const CourseColorThemeSchema = z.object({
  from: z.string(),
  to: z.string(),
  accent: z.string(),
});

export const CourseSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  shortDescription: z.string(),
  fullDescription: z.string(),
  roleBadge: z.string(),
  level: CourseLevelEnum,
  iconName: z.string(),
  colorTheme: CourseColorThemeSchema,
  targetAudience: z.array(z.string()),
  keyCompetencies: z.array(z.string()),
  keyMetrics: z.array(z.string()).optional(),
  tools: z.array(z.string()).optional(),
  stats: CourseStatsSchema,
  modules: z.array(z.string()),
});

export type CourseLevel = z.infer<typeof CourseLevelEnum>;
export type CourseStats = z.infer<typeof CourseStatsSchema>;
export type CourseColorTheme = z.infer<typeof CourseColorThemeSchema>;
export type Course = z.infer<typeof CourseSchema>;
