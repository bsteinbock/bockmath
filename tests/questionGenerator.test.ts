import {
  generateAdditionQuestion,
  generateDivisionQuestion,
  generateMultiplicationQuestion,
  generateSubtractionQuestion,
  shuffleDivisionFacts,
  shuffleMultiplicationFactors,
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
    expect(question.operand2).toBe(1);
    expect(question.correctAnswer).toBe(question.operand1 * question.operand2);
  });

  it('keeps the second factor in the full 1–12 range for a selected table', () => {
    const question = generateMultiplicationQuestion({ difficulty: 1, selectedTables: [7], selectedFacts: undefined }, () => 0.999);
    expect(question.operand1).toBe(7);
    expect(question.operand2).toBe(12);
  });

  it('generates both factors randomly from 1 through 12', () => {
    const question = generateMultiplicationQuestion({ difficulty: 1, selectedTables: undefined, selectedFacts: undefined }, () => 0.999);
    expect(question.operand1).toBe(12);
    expect(question.operand2).toBe(12);
  });

  it('shuffles all second factors from 1 through 12 without skipping or repeating values', () => {
    const factors = shuffleMultiplicationFactors(() => 0.5);
    expect(factors).toHaveLength(12);
    expect([...factors].sort((left, right) => left - right)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
    expect(
      factors.map((secondFactor) =>
        generateMultiplicationQuestion({
          difficulty: 3,
          selectedTables: [7],
          selectedFacts: undefined,
          secondFactor,
        }).operand2,
      ),
    ).toEqual(factors);
  });

  it('generates whole-number division answers', () => {
    const question = generateDivisionQuestion({ difficulty: 3, selectedTables: [8], selectedFacts: undefined }, alwaysZero);
    expect(question.operand1 % question.operand2).toBe(0);
    expect(question.operand2).toBe(8);
    expect(question.correctAnswer).toBe(question.operand1 / question.operand2);
    expect(Number.isInteger(question.correctAnswer)).toBe(true);
  });

  it('limits division questions to one of the selected divisor tables', () => {
    const question = generateDivisionQuestion(
      { difficulty: 3, selectedTables: [6, 9], selectedFacts: undefined },
      () => 0.99,
    );
    expect([6, 9]).toContain(question.operand2);
    expect(question.correctAnswer).toBe(question.operand1 / question.operand2);
  });

  it('shuffles twelve division facts per selected table', () => {
    const facts = shuffleDivisionFacts([7], () => 0.5);
    expect(facts).toHaveLength(12);
    expect(facts.every((fact) => fact.factor1 === 7)).toBe(true);
    expect(facts.map((fact) => fact.factor2).sort((left, right) => left - right)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
    expect(
      facts.map((fact) =>
        generateDivisionQuestion({
          difficulty: 3,
          selectedTables: [7],
          selectedFacts: [fact],
        }).correctAnswer,
      ).sort((left, right) => left - right),
    ).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });
});
