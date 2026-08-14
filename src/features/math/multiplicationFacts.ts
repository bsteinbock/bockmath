import { TABLE_NUMBERS } from '@/src/constants/math';
import { MultiplicationFact, MultiplicationFactProgress } from '@/src/types/models';

export function normalizeFact(fact: MultiplicationFact, commutative: boolean): MultiplicationFact {
  if (!commutative) {
    return fact;
  }

  return fact.factor1 <= fact.factor2
    ? fact
    : { factor1: fact.factor2, factor2: fact.factor1 };
}

export function createFactKey(fact: MultiplicationFact, commutative: boolean): string {
  const normalized = normalizeFact(fact, commutative);
  return `${normalized.factor1}x${normalized.factor2}`;
}

export function getAllFacts(): MultiplicationFact[] {
  return TABLE_NUMBERS.flatMap((factor1) =>
    TABLE_NUMBERS.map((factor2) => ({ factor1, factor2 })),
  );
}

export function getFactsForTables(tables: number[]): MultiplicationFact[] {
  if (!tables.length) {
    return getAllFacts();
  }

  return tables.flatMap((table) => TABLE_NUMBERS.map((factor2) => ({ factor1: table, factor2 })));
}

export function createEmptyFactProgress(fact: MultiplicationFact): MultiplicationFactProgress {
  return {
    ...fact,
    attempts: 0,
    correct: 0,
    incorrect: 0,
    averageResponseTimeMs: 0,
    masteryScore: 0,
  };
}

export function rekeyFactProgress(
  progress: Record<string, MultiplicationFactProgress>,
  commutative: boolean,
): Record<string, MultiplicationFactProgress> {
  return Object.values(progress).reduce<Record<string, MultiplicationFactProgress>>((next, entry) => {
    const key = createFactKey(entry, commutative);
    const existing = next[key];

    if (!existing) {
      next[key] = { ...entry, ...normalizeFact(entry, commutative) };
      return next;
    }

    const attempts = existing.attempts + entry.attempts;
    const averageResponseTimeMs = attempts
      ? Math.round(
          (existing.averageResponseTimeMs * existing.attempts +
            entry.averageResponseTimeMs * entry.attempts) /
            attempts,
        )
      : 0;

    next[key] = {
      ...existing,
      attempts,
      correct: existing.correct + entry.correct,
      incorrect: existing.incorrect + entry.incorrect,
      averageResponseTimeMs,
      masteryScore: Math.max(existing.masteryScore, entry.masteryScore),
      lastPracticedAt: [existing.lastPracticedAt, entry.lastPracticedAt].filter(Boolean).sort().at(-1),
    };

    return next;
  }, {});
}
