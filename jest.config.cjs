module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/hooks/**'],
};
