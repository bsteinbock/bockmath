import { MASTERY_THRESHOLDS } from '@/src/constants/math';
import { AnswerResult, MasteryLevel, MultiplicationFactProgress } from '@/src/types/models';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function calculateMasteryScore(progress: MultiplicationFactProgress): number {
  if (progress.attempts === 0) {
    return 0;
  }

  const accuracy = progress.correct / progress.attempts;
  const attemptsFactor = Math.min(progress.attempts, 8) / 8;
  const correctFactor = Math.min(progress.correct, 12) / 12;
  const speedFactor = progress.averageResponseTimeMs <= 0
    ? 0
    : clamp(1 - progress.averageResponseTimeMs / 12000, 0.15, 1);
  const balanceFactor = clamp((progress.correct - progress.incorrect + 6) / 12, 0, 1);

  let score = Math.round(
    accuracy * 55 + attemptsFactor * 15 + correctFactor * 25 + speedFactor * 5 + balanceFactor * 5,
  );

  if (progress.attempts < 3) {
    score = Math.min(score, 35);
  } else if (progress.attempts < 5) {
    score = Math.min(score, 59);
  } else if (progress.correct < 6) {
    score = Math.min(score, 89);
  }

  return clamp(score, 0, 100);
}

export function getMasteryLevel(score: number): MasteryLevel {
  return MASTERY_THRESHOLDS.find((threshold) => score >= threshold.min)?.level ?? 'not-started';
}

export function getMasteryLabel(score: number): string {
  return MASTERY_THRESHOLDS.find((threshold) => score >= threshold.min)?.label ?? 'Not Started';
}

export function updateFactProgress(
  current: MultiplicationFactProgress,
  answer: AnswerResult,
): MultiplicationFactProgress {
  const attempts = current.attempts + 1;
  const correct = current.correct + (answer.isCorrect ? 1 : 0);
  const incorrect = current.incorrect + (answer.isCorrect ? 0 : 1);
  const averageResponseTimeMs = Math.round(
    (current.averageResponseTimeMs * current.attempts + answer.responseTimeMs) / attempts,
  );

  const next = {
    ...current,
    attempts,
    correct,
    incorrect,
    averageResponseTimeMs,
    lastPracticedAt: answer.answeredAt,
  };

  return {
    ...next,
    masteryScore: calculateMasteryScore(next),
  };
}
