import { selectAdaptiveMultiplicationFact } from '@/src/features/math/questionSelector';

describe('questionSelector', () => {
  it('prefers weak facts in the weak bucket', () => {
    const fact = selectAdaptiveMultiplicationFact({
      progressMap: {
        '7x8': {
          factor1: 7,
          factor2: 8,
          attempts: 5,
          correct: 1,
          incorrect: 4,
          averageResponseTimeMs: 7000,
          masteryScore: 18,
        },
        '3x3': {
          factor1: 3,
          factor2: 3,
          attempts: 10,
          correct: 10,
          incorrect: 0,
          averageResponseTimeMs: 1300,
          masteryScore: 100,
        },
      },
      commutative: true,
      selectedFacts: [
        { factor1: 7, factor2: 8 },
        { factor1: 3, factor2: 3 },
      ],
      rng: () => 0.1,
    });

    expect(fact).toEqual({ factor1: 7, factor2: 8 });
  });

  it('avoids immediately repeating recent facts when alternatives exist', () => {
    const fact = selectAdaptiveMultiplicationFact({
      progressMap: {},
      commutative: true,
      selectedFacts: [
        { factor1: 2, factor2: 4 },
        { factor1: 3, factor2: 5 },
      ],
      recentFactKeys: ['2x4'],
      rng: () => 0.1,
    });

    expect(fact).toEqual({ factor1: 3, factor2: 5 });
  });
});
