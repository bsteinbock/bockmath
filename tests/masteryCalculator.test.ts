import { calculateMasteryScore, updateFactProgress } from '@/src/features/math/masteryCalculator';
import { MultiplicationFactProgress } from '@/src/types/models';

const baseProgress: MultiplicationFactProgress = {
  factor1: 7,
  factor2: 8,
  attempts: 0,
  correct: 0,
  incorrect: 0,
  averageResponseTimeMs: 0,
  masteryScore: 0,
};

describe('masteryCalculator', () => {
  it('does not mark a fact as mastered after one correct answer', () => {
    const onceCorrect = updateFactProgress(baseProgress, {
      questionId: 'q1',
      operation: 'multiplication',
      submittedAnswer: 56,
      correctAnswer: 56,
      isCorrect: true,
      responseTimeMs: 2500,
      answeredAt: new Date().toISOString(),
      relatedFact: { factor1: 7, factor2: 8 },
    });

    expect(onceCorrect.masteryScore).toBeLessThan(95);
  });

  it('rewards repeated correct practice', () => {
    const progressed = calculateMasteryScore({
      ...baseProgress,
      attempts: 8,
      correct: 8,
      incorrect: 0,
      averageResponseTimeMs: 1800,
      masteryScore: 0,
    });

    expect(progressed).toBeGreaterThanOrEqual(95);
  });
});
