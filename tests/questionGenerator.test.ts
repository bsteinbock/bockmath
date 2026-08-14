import {
  generateAdditionQuestion,
  generateDivisionQuestion,
  generateMultiplicationQuestion,
  generateSubtractionQuestion,
} from '@/src/features/math/questionGenerator';

const alwaysZero = () => 0;

describe('questionGenerator', () => {
  it('generates addition questions within range', () => {
    const question = generateAdditionQuestion(1, alwaysZero);
    expect(question.operand1).toBeGreaterThanOrEqual(0);
    expect(question.operand2).toBeGreaterThanOrEqual(0);
    expect(question.correctAnswer).toBe(question.operand1 + question.operand2);
  });

  it('prevents negative subtraction answers', () => {
    const question = generateSubtractionQuestion(3, alwaysZero);
    expect(question.operand1).toBeGreaterThanOrEqual(question.operand2);
    expect(question.correctAnswer).toBeGreaterThanOrEqual(0);
  });

  it('generates multiplication facts from selected tables', () => {
    const question = generateMultiplicationQuestion({ difficulty: 3, selectedTables: [7], selectedFacts: undefined }, alwaysZero);
    expect(question.operand1).toBe(7);
    expect(question.correctAnswer).toBe(question.operand1 * question.operand2);
  });

  it('generates whole-number division answers', () => {
    const question = generateDivisionQuestion({ difficulty: 3, selectedTables: [8], selectedFacts: undefined }, alwaysZero);
    expect(question.operand1 % question.operand2).toBe(0);
    expect(Number.isInteger(question.correctAnswer)).toBe(true);
  });
});
