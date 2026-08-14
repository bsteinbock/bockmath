import { getMasteryLabel } from '@/src/features/math/masteryCalculator';
import { createEmptyFactProgress, createFactKey, getAllFacts } from '@/src/features/math/multiplicationFacts';
import { DashboardRecommendation, MultiplicationFact, MultiplicationFactProgress, UserProgress } from '@/src/types/models';

export function createFactProgress(
  fact: MultiplicationFact,
  progressMap: Record<string, MultiplicationFactProgress>,
  commutative: boolean,
): MultiplicationFactProgress {
  const key = createFactKey(fact, commutative);
  return progressMap[key] ?? createEmptyFactProgress(fact);
}

export function rankFactsForSelection(facts: MultiplicationFactProgress[]) {
  return facts.map((fact) => {
    const bucket = fact.masteryScore < 40 || fact.attempts < 2 || fact.incorrect > fact.correct
      ? 'weak'
      : fact.masteryScore < 80
        ? 'developing'
        : 'review';
    const priority =
      (100 - fact.masteryScore) + fact.incorrect * 12 + Math.max(0, 4 - fact.attempts) * 8 + (fact.lastPracticedAt ? 0 : 10);

    return {
      ...fact,
      bucket,
      priority,
    };
  });
}

export function getMultiplicationSummary(progress: UserProgress, commutative: boolean) {
  const facts = getAllFacts().map((fact) => createFactProgress(fact, progress.multiplicationFacts, commutative));
  const practiced = facts.filter((fact) => fact.attempts > 0);
  const strongest = [...facts].sort((left, right) => right.masteryScore - left.masteryScore).slice(0, 5);
  const weakest = [...rankFactsForSelection(facts)].sort((left, right) => right.priority - left.priority).slice(0, 5);
  const mastered = facts.filter((fact) => fact.masteryScore >= 95).length;

  const tableSummaries = Array.from({ length: 12 }, (_, index) => {
    const table = index + 1;
    const tableFacts = facts.filter((fact) => fact.factor1 === table);
    const average = tableFacts.length
      ? Math.round(tableFacts.reduce((sum, fact) => sum + fact.masteryScore, 0) / tableFacts.length)
      : 0;
    return { table, average, mastered: tableFacts.filter((fact) => fact.masteryScore >= 95).length };
  });

  return { facts, practiced, strongest, weakest, mastered, tableSummaries };
}

export function getOverallAccuracy(progress: UserProgress): number {
  if (!progress.totalQuestions) {
    return 0;
  }

  return Math.round((progress.totalCorrect / progress.totalQuestions) * 100);
}

export function getPracticeRecommendation(progress: UserProgress, commutative: boolean): DashboardRecommendation {
  const { weakest, tableSummaries } = getMultiplicationSummary(progress, commutative);
  const weakestFact = weakest[0];

  if (progress.totalQuestions === 0) {
    return {
      title: 'Start with the 2s',
      description: 'Begin with a friendly multiplication table and build confidence.',
      actionLabel: 'Practice the 2s',
      route: {
        pathname: '/practice/session',
        params: {
          operation: 'multiplication',
          difficulty: '1',
          questionCount: '10',
          adaptive: 'true',
          tables: '2',
        },
      },
    };
  }

  const nextTable = [...tableSummaries].sort((left, right) => left.average - right.average)[0]?.table ?? 2;

  return weakestFact?.attempts
    ? {
        title: `Practice ${weakestFact.factor1} × ${weakestFact.factor2}`,
        description: `${getMasteryLabel(weakestFact.masteryScore)} facts need the most support right now.`,
        actionLabel: 'Practice weak facts',
        route: {
          pathname: '/practice/session',
          params: {
            operation: 'multiplication',
            difficulty: '2',
            questionCount: '12',
            adaptive: 'true',
            factor1: String(weakestFact.factor1),
            factor2: String(weakestFact.factor2),
          },
        },
      }
    : {
        title: `Grow table ${nextTable}`,
        description: 'Keep building automatic recall with the next table that needs attention.',
        actionLabel: `Practice the ${nextTable}s`,
        route: {
          pathname: '/practice/session',
          params: {
            operation: 'multiplication',
            difficulty: '2',
            questionCount: '12',
            adaptive: 'true',
            tables: String(nextTable),
          },
        },
      };
}
