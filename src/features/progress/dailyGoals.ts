import { DailyGoal, DailyGoalStatus, UserProgress } from '@/src/types/models';

function toLocalDateKey(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDailyGoalStatus(goal: DailyGoal, progress: UserProgress, now = new Date()): DailyGoalStatus {
  const todayKey = toLocalDateKey(now);
  const todaysResults = progress.recentResults.filter((result) => toLocalDateKey(new Date(result.answeredAt)) === todayKey);

  const current = goal.kind === 'questions'
    ? todaysResults.length
    : Number((todaysResults.reduce((sum, result) => sum + result.responseTimeMs, 0) / 60000).toFixed(1));

  const percentage = goal.target === 0 ? 0 : Math.min(100, Math.round((current / goal.target) * 100));

  return {
    current,
    target: goal.target,
    completed: current >= goal.target,
    progressPercentage: percentage,
    label: goal.kind === 'questions' ? `${current} / ${goal.target} questions` : `${current} / ${goal.target} minutes`,
  };
}
