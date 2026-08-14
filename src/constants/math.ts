import { DailyGoal, MathOperation, MultiplicationFact } from '@/src/types/models';

export const TABLE_NUMBERS = Array.from({ length: 12 }, (_, index) => index + 1);

export const DEFAULT_DAILY_GOAL: DailyGoal = {
  kind: 'questions',
  target: 20,
};

export const OPERATION_LABELS: Record<MathOperation, string> = {
  addition: 'Addition',
  subtraction: 'Subtraction',
  multiplication: 'Multiplication',
  division: 'Division',
  mixed: 'Mixed Math',
};

export const SYMBOL_BY_OPERATION: Record<Exclude<MathOperation, 'mixed'>, string> = {
  addition: '+',
  subtraction: '−',
  multiplication: '×',
  division: '÷',
};

export const DIFFICULTY_LABELS = ['Starter', 'Growing', 'Challenge'];

export const DIFFICULTY_RANGES = {
  addition: [
    { min: 0, max: 10 },
    { min: 0, max: 50 },
    { min: 0, max: 1000 },
  ],
  subtraction: [
    { min: 0, max: 10 },
    { min: 0, max: 50 },
    { min: 0, max: 1000 },
  ],
  multiplication: [
    { min: 1, max: 5 },
    { min: 1, max: 10 },
    { min: 1, max: 12 },
  ],
  division: [
    { min: 1, max: 5 },
    { min: 1, max: 10 },
    { min: 1, max: 12 },
  ],
} as const;

export const MASTERY_THRESHOLDS = [
  { min: 95, level: 'mastered', label: 'Mastered' },
  { min: 80, level: 'strong', label: 'Strong' },
  { min: 60, level: 'proficient', label: 'Proficient' },
  { min: 40, level: 'developing', label: 'Developing' },
  { min: 20, level: 'learning', label: 'Learning' },
  { min: 0, level: 'not-started', label: 'Not Started' },
] as const;

export const ADAPTIVE_WEIGHTS = {
  weak: 0.6,
  developing: 0.25,
  review: 0.15,
};

export const ENCOURAGING_FEEDBACK = {
  correct: ['Great job!', 'You did it!', 'Awesome work!', 'Nice thinking!'],
  incorrect: ['Nice try!', 'Almost!', "Let's learn this one.", 'Keep going!'],
};

export const DEFAULT_SELECTED_TABLES = [2, 3, 4, 5];

export const STARTER_FACTS: MultiplicationFact[] = TABLE_NUMBERS.flatMap((factor1) =>
  TABLE_NUMBERS.map((factor2) => ({ factor1, factor2 })),
);
