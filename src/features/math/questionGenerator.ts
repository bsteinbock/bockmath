import { DIFFICULTY_RANGES, SYMBOL_BY_OPERATION, TABLE_NUMBERS } from '@/src/constants/math';
import { MathOperation, MathQuestion, MultiplicationFact, PracticeSessionConfig } from '@/src/types/models';

export type RandomSource = () => number;

function randomInt(min: number, max: number, rng: RandomSource): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function createQuestionId(operation: MathOperation, operand1: number, operand2: number, rng: RandomSource): string {
  return `${operation}-${operand1}-${operand2}-${Math.round(rng() * 1_000_000)}`;
}

function formatPrompt(operation: Exclude<MathOperation, 'mixed'>, operand1: number, operand2: number): string {
  return `${operand1} ${SYMBOL_BY_OPERATION[operation]} ${operand2}`;
}

export function generateAdditionQuestion(difficulty: number, rng: RandomSource = Math.random): MathQuestion {
  const range = DIFFICULTY_RANGES.addition[Math.max(0, Math.min(difficulty - 1, 2))];
  const operand1 = randomInt(range.min, range.max, rng);
  const operand2 = randomInt(range.min, range.max, rng);

  return {
    id: createQuestionId('addition', operand1, operand2, rng),
    operation: 'addition',
    operand1,
    operand2,
    prompt: formatPrompt('addition', operand1, operand2),
    correctAnswer: operand1 + operand2,
    difficulty,
  };
}

export function generateSubtractionQuestion(difficulty: number, rng: RandomSource = Math.random): MathQuestion {
  const range = DIFFICULTY_RANGES.subtraction[Math.max(0, Math.min(difficulty - 1, 2))];
  const operand1 = randomInt(range.min, range.max, rng);
  const operand2 = randomInt(range.min, range.max, rng);
  const larger = Math.max(operand1, operand2);
  const smaller = Math.min(operand1, operand2);

  return {
    id: createQuestionId('subtraction', larger, smaller, rng),
    operation: 'subtraction',
    operand1: larger,
    operand2: smaller,
    prompt: formatPrompt('subtraction', larger, smaller),
    correctAnswer: larger - smaller,
    difficulty,
  };
}

function pickFact(config: Pick<PracticeSessionConfig, 'difficulty' | 'selectedTables' | 'selectedFacts'>, rng: RandomSource): MultiplicationFact {
  if (config.selectedFacts?.length) {
    return config.selectedFacts[randomInt(0, config.selectedFacts.length - 1, rng)];
  }

  if (config.selectedTables?.length) {
    const factor1 = config.selectedTables[randomInt(0, config.selectedTables.length - 1, rng)];
    const max = DIFFICULTY_RANGES.multiplication[Math.max(0, Math.min(config.difficulty - 1, 2))].max;
    return { factor1, factor2: randomInt(1, max, rng) };
  }

  const range = DIFFICULTY_RANGES.multiplication[Math.max(0, Math.min(config.difficulty - 1, 2))];
  return {
    factor1: randomInt(range.min, range.max, rng),
    factor2: randomInt(range.min, range.max, rng),
  };
}

export function generateMultiplicationQuestion(
  config: Pick<PracticeSessionConfig, 'difficulty' | 'selectedTables' | 'selectedFacts'>,
  rng: RandomSource = Math.random,
): MathQuestion {
  const fact = pickFact(config, rng);

  return {
    id: createQuestionId('multiplication', fact.factor1, fact.factor2, rng),
    operation: 'multiplication',
    operand1: fact.factor1,
    operand2: fact.factor2,
    prompt: formatPrompt('multiplication', fact.factor1, fact.factor2),
    correctAnswer: fact.factor1 * fact.factor2,
    difficulty: config.difficulty,
    relatedFact: fact,
  };
}

export function generateDivisionQuestion(
  config: Pick<PracticeSessionConfig, 'difficulty' | 'selectedTables' | 'selectedFacts'>,
  rng: RandomSource = Math.random,
): MathQuestion {
  const fact = config.selectedFacts?.length
    ? config.selectedFacts[randomInt(0, config.selectedFacts.length - 1, rng)]
    : config.selectedTables?.length
      ? {
          factor1: config.selectedTables[randomInt(0, config.selectedTables.length - 1, rng)],
          factor2: randomInt(1, 12, rng),
        }
      : {
          factor1: TABLE_NUMBERS[randomInt(0, TABLE_NUMBERS.length - 1, rng)],
          factor2: TABLE_NUMBERS[randomInt(0, TABLE_NUMBERS.length - 1, rng)],
        };

  const dividend = fact.factor1 * fact.factor2;
  const useFirstFactorAsDivisor = rng() >= 0.5;
  const divisor = useFirstFactorAsDivisor ? fact.factor1 : fact.factor2;
  const correctAnswer = useFirstFactorAsDivisor ? fact.factor2 : fact.factor1;

  return {
    id: createQuestionId('division', dividend, divisor, rng),
    operation: 'division',
    operand1: dividend,
    operand2: divisor,
    prompt: formatPrompt('division', dividend, divisor),
    correctAnswer,
    difficulty: config.difficulty,
    relatedFact: fact,
  };
}

export function generateQuestion(config: PracticeSessionConfig, rng: RandomSource = Math.random): MathQuestion {
  if (config.operation === 'mixed') {
    const operations: Exclude<MathOperation, 'mixed'>[] = ['addition', 'subtraction', 'multiplication', 'division'];
    const operation = operations[randomInt(0, operations.length - 1, rng)];
    return generateQuestion({ ...config, operation }, rng);
  }

  if (config.operation === 'addition') {
    return generateAdditionQuestion(config.difficulty, rng);
  }

  if (config.operation === 'subtraction') {
    return generateSubtractionQuestion(config.difficulty, rng);
  }

  if (config.operation === 'multiplication') {
    return generateMultiplicationQuestion(config, rng);
  }

  return generateDivisionQuestion(config, rng);
}
