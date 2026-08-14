import { createFactKey, getAllFacts, normalizeFact } from '@/src/features/math/multiplicationFacts';

describe('multiplicationFacts', () => {
  it('covers the full 1×1 through 12×12 range', () => {
    const facts = getAllFacts();
    expect(facts).toHaveLength(144);
    expect(facts).toContainEqual({ factor1: 1, factor2: 1 });
    expect(facts).toContainEqual({ factor1: 1, factor2: 12 });
    expect(facts).toContainEqual({ factor1: 12, factor2: 1 });
    expect(facts).toContainEqual({ factor1: 12, factor2: 12 });
  });

  it('normalizes equivalent facts when commutative mode is enabled', () => {
    expect(normalizeFact({ factor1: 8, factor2: 7 }, true)).toEqual({ factor1: 7, factor2: 8 });
    expect(createFactKey({ factor1: 8, factor2: 7 }, true)).toBe(createFactKey({ factor1: 7, factor2: 8 }, true));
  });

  it('keeps directional facts distinct when commutative mode is disabled', () => {
    expect(createFactKey({ factor1: 8, factor2: 7 }, false)).not.toBe(createFactKey({ factor1: 7, factor2: 8 }, false));
  });
});
