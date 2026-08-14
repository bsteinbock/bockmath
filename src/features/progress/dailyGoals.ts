import { DailyGoal, DailyGoalStatus, UserProgress } from '@/src/types/models';

function toDateKey(isoDate: string): string {
  return isoDate.slice(0, 10);
}

export function getDailyGoalStatus(goal: DailyGoal, progress: UserProgress, now = new Date()): DailyGoalStatus {
  const todayKey = toDateKey(now.toISOString());
  const todaysResults = progress.recentResults.filter((result) => toDateKey(result.answeredAt) === todayKey);

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
