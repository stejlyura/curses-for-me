import { z } from 'zod';

export const CompetencyTagEnum = z.enum([
  'Unit Economics & Finance',
  'Attribution & MMM',
  'Growth Loops & PLG',
  'Enterprise Performance',
  'PMM & Positioning',
  'Pricing & Packaging',
  'Executive Leadership',
  'Data & A/B Rigor',
]);

export const BenchmarkMetricSchema = z.object({
  metric: z.string(),
  industry: z.enum(['B2B SaaS', 'Mobile / Gaming', 'E-commerce', 'Fintech', 'General']),
  targetBenchmark: z.string(),
  dangerZone: z.string(),
  calculation: z.string(),
  seniorContext: z.string(),
});

export const ResearchInsightSchema = z.object({
  source: z.string(),
  year: z.string().optional(),
  finding: z.string(),
  practicalTakeaway: z.string(),
});

export const InterviewCaseSchema = z.object({
  question: z.string(),
  difficulty: z.enum(['Middle', 'Senior', 'Director']),
  whatInterviewerLooksFor: z.string(),
  antiPatternAnswer: z.string(),
  seniorBattleTestedAnswer: z.string(),
  probingQuestions: z.array(z.string()),
});

export const ResumeBulletSchema = z.object({
  formula: z.string(),
  template: z.string(),
  concreteExample: z.string(),
  keywords: z.array(z.string()),
});

export const FormulaVariableSchema = z.object({
  symbol: z.string(),
  label: z.string(),
  unit: z.string(),
  benchmarkValue: z.string().optional(),
});

export const InteractiveFormulaSchema = z.object({
  name: z.string(),
  latex: z.string(),
  description: z.string(),
  variables: z.array(FormulaVariableSchema),
  sampleCalculation: z.string(),
});

export const CompanyCaseStudySchema = z.object({
  companyName: z.string(),
  industry: z.string(),
  scale: z.string(),
  problem: z.string(),
  strategicMove: z.string(),
  quantitativeResult: z.string(),
  keyLesson: z.string(),
});

export const QuizQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.string()).min(2),
  correctOptionIndex: z.number().int().min(0),
  explanation: z.string(),
  commonMistake: z.string().optional(),
});

export const CoreConceptSchema = z.object({
  title: z.string(),
  explanation: z.string(),
  formulas: z.array(z.string()).optional(),
});

export const FoundationalExplainerSchema = z.object({
  simpleExplanation: z.string(),
  whyItMatters: z.string(),
  realWorldAnalogy: z.string(),
  stepByStepMechanics: z.array(z.string()),
  glossary: z.array(z.object({ term: z.string(), definition: z.string() })),
  mindsetShift: z.object({ juniorView: z.string(), seniorView: z.string() }),
});

export const LessonSchema = z.object({
  id: z.string(),
  slug: z.string(),
  courseSlug: z.string().default('senior-marketing'),
  moduleId: z.number(),
  moduleTitle: z.string(),
  lessonNumber: z.string(),
  title: z.string(),
  level: z.enum(['Middle', 'Senior', 'Lead']),
  readTimeMinutes: z.number(),
  targetAudience: z.string(),
  summary: z.string(),
  competencies: z.array(CompetencyTagEnum).optional(),
  coreConcepts: z.array(CoreConceptSchema),
  benchmarkMetrics: z.array(BenchmarkMetricSchema),
  researchInsights: z.array(ResearchInsightSchema),
  interviewCases: z.array(InterviewCaseSchema),
  resumeBullets: z.array(ResumeBulletSchema),
  formulasDetailed: z.array(InteractiveFormulaSchema).optional(),
  caseStudies: z.array(CompanyCaseStudySchema).optional(),
  quizQuestions: z.array(QuizQuestionSchema).optional(),
  foundationalExplainer: FoundationalExplainerSchema.optional(),
  longreadMarkdown: z.string(),
});

export const ModuleSchema = z.object({
  id: z.number(),
  slug: z.string(),
  courseSlug: z.string().default('senior-marketing'),
  title: z.string(),
  description: z.string(),
  iconName: z.string(),
  lessonSlugs: z.array(z.string()),
});

export type CompetencyTag = z.infer<typeof CompetencyTagEnum>;
export type BenchmarkMetric = z.infer<typeof BenchmarkMetricSchema>;
export type ResearchInsight = z.infer<typeof ResearchInsightSchema>;
export type InterviewCase = z.infer<typeof InterviewCaseSchema>;
export type ResumeBullet = z.infer<typeof ResumeBulletSchema>;
export type FormulaVariable = z.infer<typeof FormulaVariableSchema>;
export type InteractiveFormula = z.infer<typeof InteractiveFormulaSchema>;
export type CompanyCaseStudy = z.infer<typeof CompanyCaseStudySchema>;
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type CoreConcept = z.infer<typeof CoreConceptSchema>;
export type FoundationalExplainer = z.infer<typeof FoundationalExplainerSchema>;
export type Lesson = z.infer<typeof LessonSchema>;
export type Module = z.infer<typeof ModuleSchema>;
