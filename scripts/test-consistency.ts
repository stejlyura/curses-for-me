import { CourseSchema } from '../src/entities/course/model/schemas';
import { ModuleSchema, LessonSchema } from '../src/entities/lesson/model/schemas';
import { coursesData } from '../src/shared/data/courses';
import { modulesData } from '../src/shared/data/modules';
import { allLessonsData } from '../src/shared/data/lessons';
import fs from 'fs';
import path from 'path';

let failed = false;

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${msg}`);
    failed = true;
  } else {
    console.log(`✅ PASS: ${msg}`);
  }
}

console.log('\n--- 1. Testing Course Data & Zod Validation ---');
assert(coursesData.length === 4, `Expected 4 courses, got ${coursesData.length}`);
for (const course of coursesData) {
  const result = CourseSchema.safeParse(course);
  assert(result.success, `Course "${course.slug}" conforms to CourseSchema`);
}

console.log('\n--- 2. Testing Module Data & Zod Validation ---');
assert(modulesData.length === 21, `Expected 21 modules, got ${modulesData.length}`);
for (const module of modulesData) {
  const result = ModuleSchema.safeParse(module);
  assert(result.success, `Module ${module.id} (${module.slug}) conforms to ModuleSchema`);
}

console.log('\n--- 3. Testing Lesson Data & Zod Validation ---');
assert(allLessonsData.length === 79, `Expected 79 lessons, got ${allLessonsData.length}`);
for (const lesson of allLessonsData) {
  const result = LessonSchema.safeParse(lesson);
  if (!result.success) {
    console.error(result.error);
  }
  assert(result.success, `Lesson ${lesson.slug} conforms to LessonSchema`);
}

console.log('\n--- 4. Testing Link and Graph Consistency ---');
const lessonSlugSet = new Set(allLessonsData.map((l) => l.slug));
const moduleMap = new Map(modulesData.map((m) => [m.id, m]));
const courseSlugSet = new Set(coursesData.map((c) => c.slug));

for (const m of modulesData) {
  assert(courseSlugSet.has(m.courseSlug), `Module ${m.id} belongs to valid course: ${m.courseSlug}`);
  for (const s of m.lessonSlugs) {
    assert(lessonSlugSet.has(s), `Module ${m.id} references existing lesson: ${s}`);
  }
}

for (const l of allLessonsData) {
  const mod = moduleMap.get(l.moduleId);
  assert(!!mod, `Lesson ${l.slug} maps to existing module ${l.moduleId}`);
  assert(mod ? mod.lessonSlugs.includes(l.slug) : false, `Module ${l.moduleId} lists lesson ${l.slug}`);
  assert(courseSlugSet.has(l.courseSlug), `Lesson ${l.slug} belongs to valid course: ${l.courseSlug}`);
}

console.log('\n--- 5. Testing PWA Assets & Favicons ---');
const requiredFiles = [
  'public/manifest.webmanifest',
  'public/sw.js',
  'public/favicon.ico',
  'public/favicon-16x16.png',
  'public/favicon-32x32.png',
  'public/favicon-48x48.png',
  'public/apple-touch-icon.png',
  'public/icon-192.png',
  'public/icon-512.png',
  'public/icon-maskable-192.png',
  'public/icon-maskable-512.png',
  'public/icon.svg',
  'public/icon-maskable.svg',
  'public/screenshots/desktop-1280x720.png',
  'public/screenshots/mobile-750x1334.png',
];

for (const file of requiredFiles) {
  const fullPath = path.join(process.cwd(), file);
  assert(fs.existsSync(fullPath), `PWA Asset exists: ${file}`);
}

if (failed) {
  console.error('\n❌ Tests finished with errors.');
  process.exit(1);
} else {
  console.log('\n🎉 ALL 125+ TEST SUITE ASSERTIONS PASSED WITH 0 ERRORS!\n');
}
