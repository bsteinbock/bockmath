import { ADAPTIVE_WEIGHTS } from '@/src/constants/math';
import { createFactProgress, rankFactsForSelection } from '@/src/features/progress/progressSummary';
import { createFactKey, getAllFacts, getFactsForTables } from '@/src/features/math/multiplicationFacts';
import { MultiplicationFact, MultiplicationFactProgress } from '@/src/types/models';

function pickBucket(weights: { weak: number; developing: number; review: number }, rng: () => number): keyof typeof weights {
  const roll = rng();
  if (roll < weights.weak) return 'weak';
  if (roll < weights.weak + weights.developing) return 'developing';
  return 'review';
}

export function selectAdaptiveMultiplicationFact(options: {
  progressMap: Record<string, MultiplicationFactProgress>;
  selectedTables?: number[];
  selectedFacts?: MultiplicationFact[];
  recentFactKeys?: string[];
  commutative: boolean;
  rng?: () => number;
}): MultiplicationFact {
  const rng = options.rng ?? Math.random;
  const availableFacts = options.selectedFacts?.length
    ? options.selectedFacts
    : options.selectedTables?.length
      ? getFactsForTables(options.selectedTables)
      : getAllFacts();

  const recentSet = new Set(options.recentFactKeys ?? []);
  const eligibleFacts = availableFacts.filter((fact) => !recentSet.has(createFactKey(fact, options.commutative)));
  const facts = eligibleFacts.length ? eligibleFacts : availableFacts;

  const ranked = rankFactsForSelection(
    facts.map((fact) => createFactProgress(fact, options.progressMap, options.commutative)),
  );

  const weak = ranked.filter((entry) => entry.bucket === 'weak');
  const developing = ranked.filter((entry) => entry.bucket === 'developing');
  const review = ranked.filter((entry) => entry.bucket === 'review');
  const buckets = { weak, developing, review };

  const bucketOrder: (keyof typeof buckets)[] = [pickBucket(ADAPTIVE_WEIGHTS, rng), 'weak', 'developing', 'review'];
  const chosenBucket = bucketOrder.find((bucket) => buckets[bucket].length > 0) ?? 'weak';
  const pool = buckets[chosenBucket].sort((left, right) => right.priority - left.priority);
  const top = pool.slice(0, Math.min(pool.length, 4));
  const selected = top[Math.floor(rng() * top.length)] ?? pool[0];

  return { factor1: selected.factor1, factor2: selected.factor2 };
}
