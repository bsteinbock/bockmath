import { getDailyGoalStatus } from '@/src/features/progress/dailyGoals';
import { UserProgress } from '@/src/types/models';

const progress: UserProgress = {
  totalQuestions: 3,
  totalCorrect: 2,
  currentStreak: 1,
  longestStreak: 2,
  averageResponseTimeMs: 2000,
  recentResults: [
    {
      questionId: 'q1',
      operation: 'addition',
      submittedAnswer: 4,
      correctAnswer: 4,
      isCorrect: true,
      responseTimeMs: 60000,
      answeredAt: '2026-08-14T10:00:00.000Z',
    },
    {
      questionId: 'q2',
      operation: 'multiplication',
      submittedAnswer: 12,
      correctAnswer: 12,
      isCorrect: true,
      responseTimeMs: 60000,
      answeredAt: '2026-08-14T11:00:00.000Z',
      relatedFact: { factor1: 3, factor2: 4 },
    },
    {
      questionId: 'q3',
      operation: 'addition',
      submittedAnswer: 5,
      correctAnswer: 6,
      isCorrect: false,
      responseTimeMs: 45000,
      answeredAt: '2026-08-13T10:00:00.000Z',
    },
  ],
  multiplicationFacts: {},
  achievements: [],
};

describe('dailyGoals', () => {
  it('counts today question goals only from the current day', () => {
    const status = getDailyGoalStatus({ kind: 'questions', target: 3 }, progress, new Date('2026-08-14T12:00:00.000Z'));
    expect(status.current).toBe(2);
    expect(status.completed).toBe(false);
  });

  it('calculates minute goals from response time totals', () => {
    const status = getDailyGoalStatus({ kind: 'minutes', target: 2 }, progress, new Date('2026-08-14T12:00:00.000Z'));
    expect(status.current).toBe(2);
    expect(status.completed).toBe(true);
  });
});
