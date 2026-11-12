import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  getFoundationalExplainerForLesson, 
  getRoadmapForCourse, 
  getAllGlossaryItems 
} from './foundational-knowledge';
import { Lesson } from '@/entities/lesson';

test('getFoundationalExplainerForLesson returns comprehensive explainer for module 1', () => {
  const mockLesson: Lesson = {
    id: 'test-1',
    slug: '1-1-test',
    courseSlug: 'senior-marketing',
    moduleId: 1,
    moduleTitle: 'Unit Economics',
    lessonNumber: '1.1',
    title: 'LTV models',
    level: 'Senior',
    readTimeMinutes: 5,
    targetAudience: 'Marketers',
    summary: 'Test summary',
    coreConcepts: [],
    benchmarkMetrics: [],
    researchInsights: [],
    interviewCases: [],
    resumeBullets: [],
    longreadMarkdown: '# Markdown',
  };

  const explainer = getFoundationalExplainerForLesson(mockLesson);
  assert.ok(explainer.simpleExplanation.length > 50, 'simpleExplanation should be descriptive');
  assert.ok(explainer.whyItMatters.length > 20, 'whyItMatters should be present');
  assert.ok(explainer.realWorldAnalogy.length > 20, 'realWorldAnalogy should be present');
  assert.ok(explainer.stepByStepMechanics.length >= 3, 'should have multiple steps');
  assert.ok(explainer.glossary.length >= 2, 'should contain glossary terms');
  assert.ok(explainer.mindsetShift.juniorView.length > 10, 'junior view should be explained');
  assert.ok(explainer.mindsetShift.seniorView.length > 10, 'senior view should be explained');
});

test('getRoadmapForCourse returns 3 distinct career stages (Junior, Middle, Senior) for each course', () => {
  const courses = ['senior-marketing', 'media-buying', 'affiliate-manager', 'lead-generation'];
  
  for (const c of courses) {
    const roadmap = getRoadmapForCourse(c);
    assert.equal(roadmap.length, 3, `Course ${c} must have 3 roadmap stages`);
    assert.equal(roadmap[0].level, 'Junior (С нуля)');
    assert.equal(roadmap[1].level, 'Middle (Практик)');
    assert.equal(roadmap[2].level, 'Senior (Лидер / C-Level)');
    assert.ok(roadmap[0].keySkills.length >= 2, 'Junior stage must list key skills');
  }
});

test('getAllGlossaryItems returns deduplicated dictionary with rich terms', () => {
  const allTerms = getAllGlossaryItems();
  assert.ok(allTerms.length >= 20, 'Should have at least 20 comprehensive marketing terms');

  const termsSet = new Set<string>();
  for (const item of allTerms) {
    assert.ok(!termsSet.has(item.term), `Duplicate term detected: ${item.term}`);
    termsSet.add(item.term);
    assert.ok(item.simpleDefinition.length > 10, `Definition for ${item.term} should be descriptive`);
  }
});
