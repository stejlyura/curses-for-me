import { Lesson } from '@/entities/lesson';
import { module1Lessons } from './module1';
import { module2Lessons } from './module2';
import { module3Lessons } from './module3';
import { module4Lessons } from './module4';
import { module5Lessons } from './module5';
import { module6Lessons } from './module6';

// Media Buying / PPC Course Modules
import { module7Lessons } from './media-buying/module7';
import { module8Lessons } from './media-buying/module8';
import { module9Lessons } from './media-buying/module9';
import { module10Lessons } from './media-buying/module10';
import { module11Lessons } from './media-buying/module11';

// Affiliate Manager / Head of Affiliates Course Modules
import { module12Lessons } from './affiliate-manager/module12';
import { module13Lessons } from './affiliate-manager/module13';
import { module14Lessons } from './affiliate-manager/module14';
import { module15Lessons } from './affiliate-manager/module15';
import { module16Lessons } from './affiliate-manager/module16';

// SDR / Lead Generation Specialist Course Modules
import { module17Lessons } from './lead-generation/module17';
import { module18Lessons } from './lead-generation/module18';
import { module19Lessons } from './lead-generation/module19';
import { module20Lessons } from './lead-generation/module20';
import { module21Lessons } from './lead-generation/module21';

export const allLessonsData: Lesson[] = [
  // Senior Marketing & Growth
  ...module1Lessons,
  ...module2Lessons,
  ...module3Lessons,
  ...module4Lessons,
  ...module5Lessons,
  ...module6Lessons,

  // Media Buying / PPC Specialist
  ...module7Lessons,
  ...module8Lessons,
  ...module9Lessons,
  ...module10Lessons,
  ...module11Lessons,

  // Affiliate Manager & Head of Affiliates
  ...module12Lessons,
  ...module13Lessons,
  ...module14Lessons,
  ...module15Lessons,
  ...module16Lessons,

  // SDR / Lead Generation Specialist
  ...module17Lessons,
  ...module18Lessons,
  ...module19Lessons,
  ...module20Lessons,
  ...module21Lessons,
];
