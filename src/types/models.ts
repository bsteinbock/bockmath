export type MathOperation = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed';

export type MasteryLevel = 'not-started' | 'learning' | 'developing' | 'proficient' | 'strong' | 'mastered';

export type DailyGoal = {
  kind: 'questions' | 'minutes';
  target: number;
};

export type UserProfile = {
  id: string;
  firstName: string;
  level: number;
  stars: number;
  xp: number;
  streakDays: number;
};

export type UserSettings = {
  commutativeFacts: boolean;
  reducedMotion: boolean;
  dailyGoal: DailyGoal;
  focusedOperations: Exclude<MathOperation, 'mixed'>[];
};

export type MultiplicationFact = {
  factor1: number;
  factor2: number;
};

export type MultiplicationFactProgress = MultiplicationFact & {
  attempts: number;
  correct: number;
  incorrect: number;
  averageResponseTimeMs: number;
  masteryScore: number;
  lastPracticedAt?: string;
};

export type MathQuestion = {
  id: string;
  operation: MathOperation;
  operand1: number;
  operand2: number;
  prompt: string;
  correctAnswer: number;
  difficulty: number;
  relatedFact?: MultiplicationFact;
};

export type PracticeSessionConfig = {
  operation: MathOperation;
  difficulty: number;
  questionCount: number;
  adaptive: boolean;
  selectedTables?: number[];
  selectedFacts?: MultiplicationFact[];
  timeLimitSeconds?: number;
  mode?: 'practice' | 'game';
};

export type AnswerResult = {
  questionId: string;
  operation: MathOperation;
  submittedAnswer: number | null;
  correctAnswer: number;
  isCorrect: boolean;
  responseTimeMs: number;
  answeredAt: string;
  relatedFact?: MultiplicationFact;
};

export type AchievementDefinition = {
  id: string;
  title: string;
  description: string;
};

export type AchievementProgress = AchievementDefinition & {
  earnedAt?: string;
};

export type UserProgress = {
  totalQuestions: number;
  totalCorrect: number;
  currentStreak: number;
  longestStreak: number;
  averageResponseTimeMs: number;
  recentResults: AnswerResult[];
  multiplicationFacts: Record<string, MultiplicationFactProgress>;
  achievements: AchievementProgress[];
};

export type DailyGoalStatus = {
  current: number;
  target: number;
  completed: boolean;
  progressPercentage: number;
  label: string;
};

export type DashboardRecommendation = {
  title: string;
  description: string;
  actionLabel: string;
  route: {
    pathname: '/practice/session';
    params: Record<string, string>;
  };
};
