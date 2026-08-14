import { AchievementProgress, UserProgress } from '@/src/types/models';

export const ACHIEVEMENTS: AchievementProgress[] = [
  {
    id: 'first-10-questions',
    title: 'First 10 Questions',
    description: 'Answer your first 10 questions.',
  },
  {
    id: 'streak-10',
    title: '10 Correct in a Row',
    description: 'Build a 10-answer streak.',
  },
  {
    id: 'mastered-2s',
    title: 'Mastered the 2s',
    description: 'Master every 2× fact.',
  },
  {
    id: 'mastered-5s',
    title: 'Mastered the 5s',
    description: 'Master every 5× fact.',
  },
  {
    id: 'mastered-25-facts',
    title: 'Mastered 25 Multiplication Facts',
    description: 'Reach mastery on 25 facts.',
  },
  {
    id: 'mastered-all-facts',
    title: 'Mastered All Multiplication Facts',
    description: 'Reach mastery on the full 1×1 through 12×12 grid.',
  },
];

function countMasteredFacts(progress: UserProgress): number {
  return Object.values(progress.multiplicationFacts).filter((fact) => fact.masteryScore >= 95).length;
}

function hasMasteredTable(progress: UserProgress, table: number): boolean {
  const facts = Object.values(progress.multiplicationFacts).filter((fact) => fact.factor1 === table || fact.factor2 === table);
  return facts.length >= 12 && facts.every((fact) => fact.masteryScore >= 95);
}

export function evaluateAchievements(progress: UserProgress, existing: AchievementProgress[], nowIso: string): AchievementProgress[] {
  const masteredFacts = countMasteredFacts(progress);

  return ACHIEVEMENTS.map((achievement) => {
    const current = existing.find((item) => item.id === achievement.id);
    const earned =
      achievement.id === 'first-10-questions'
        ? progress.totalQuestions >= 10
        : achievement.id === 'streak-10'
          ? progress.longestStreak >= 10
          : achievement.id === 'mastered-2s'
            ? hasMasteredTable(progress, 2)
            : achievement.id === 'mastered-5s'
              ? hasMasteredTable(progress, 5)
              : achievement.id === 'mastered-25-facts'
                ? masteredFacts >= 25
                : masteredFacts >= 144;

    return {
      ...achievement,
      earnedAt: current?.earnedAt ?? (earned ? nowIso : undefined),
    };
  });
}
