import { evaluateAchievements } from '@/src/features/progress/achievements';
import { UserProgress } from '@/src/types/models';

const buildProgress = (): UserProgress => ({
  totalQuestions: 12,
  totalCorrect: 12,
  currentStreak: 12,
  longestStreak: 12,
  averageResponseTimeMs: 1800,
  recentResults: [],
  multiplicationFacts: Object.fromEntries(
    Array.from({ length: 12 }, (_, index) => {
      const factor2 = index + 1;
      return [
        `2x${factor2}`,
        {
          factor1: 2,
          factor2,
          attempts: 8,
          correct: 8,
          incorrect: 0,
          averageResponseTimeMs: 1500,
          masteryScore: 100,
        },
      ];
    }),
  ),
  achievements: [],
});

describe('achievements', () => {
  it('earns question and streak achievements', () => {
    const achievements = evaluateAchievements(buildProgress(), [], '2026-08-14T12:00:00.000Z');
    expect(achievements.find((item) => item.id === 'first-10-questions')?.earnedAt).toBeTruthy();
    expect(achievements.find((item) => item.id === 'streak-10')?.earnedAt).toBeTruthy();
  });

  it('detects table mastery achievements', () => {
    const achievements = evaluateAchievements(buildProgress(), [], '2026-08-14T12:00:00.000Z');
    expect(achievements.find((item) => item.id === 'mastered-2s')?.earnedAt).toBeTruthy();
    expect(achievements.find((item) => item.id === 'mastered-5s')?.earnedAt).toBeFalsy();
  });
});
