import { Course, CourseSchema } from '@/entities/course';
import { Lesson, LessonSchema, Module, ModuleSchema } from '@/entities/lesson';
import { coursesData } from '@/shared/data/courses';
import { modulesData } from '@/shared/data/modules';
import { allLessonsData } from '@/shared/data/lessons';

export const getAllCourses = (): Course[] => {
  return coursesData.map((c) => CourseSchema.parse(c));
};

export const getCourseBySlug = (slug: string): Course | undefined => {
  const course = coursesData.find((c) => c.slug === slug);
  return course ? CourseSchema.parse(course) : undefined;
};

export const getAllModules = (): Module[] => {
  return modulesData.map((m) => ModuleSchema.parse(m));
};

export const getModuleById = (id: number): Module | undefined => {
  const mod = modulesData.find((m) => m.id === id);
  return mod ? ModuleSchema.parse(mod) : undefined;
};

export const getModulesByCourseSlug = (courseSlug: string): Module[] => {
  return getAllModules().filter((m) => (m.courseSlug ?? 'senior-marketing') === courseSlug);
};

export const getAllLessons = (): Lesson[] => {
  return allLessonsData.map((l) => LessonSchema.parse(l));
};

export const getLessonsByCourseSlug = (courseSlug: string): Lesson[] => {
  return getAllLessons().filter((l) => (l.courseSlug ?? 'senior-marketing') === courseSlug);
};

export const getLessonBySlug = (slug: string): Lesson | undefined => {
  const lesson = allLessonsData.find((l) => l.slug === slug);
  return lesson ? LessonSchema.parse(lesson) : undefined;
};

export const getLessonByCourseAndSlug = (courseSlug: string, lessonSlug: string): Lesson | undefined => {
  const lesson = allLessonsData.find(
    (l) => l.slug === lessonSlug && (l.courseSlug ?? 'senior-marketing') === courseSlug
  );
  return lesson ? LessonSchema.parse(lesson) : undefined;
};

export const getLessonsByModuleId = (moduleId: number): Lesson[] => {
  return getAllLessons().filter((l) => l.moduleId === moduleId);
};
