# BockMath

BockMath is a React Native math game for elementary school students, built with **Expo SDK 57**, **TypeScript**, and **Expo Router**.

It provides a child-friendly MVP foundation for:

- Addition
- Subtraction
- Multiplication
- Division
- Adaptive multiplication-table practice from **1×1 through 12×12**
- Progress tracking, achievements, daily goals, and challenge modes

The authoritative product specification is in [`/home/runner/work/bockmath/bockmath/game_design.md`](./game_design.md).

## Generated application structure

```text
app/
  _layout.tsx
  index.tsx
  practice/
    index.tsx
    session.tsx
    results.tsx
  multiplication/
    index.tsx
    tables.tsx
    fact-grid.tsx
  games/
    index.tsx
  progress/
    index.tsx
  settings/
    index.tsx

src/
  components/
  constants/
  features/
    math/
    progress/
    games/
  hooks/
  repositories/
  types/
  utils/

tests/
```

## Included foundation

This scaffold includes:

- Expo Router navigation for the main app areas
- Reusable child-friendly UI components
- A deterministic math question engine
- Multiplication fact normalization and identity helpers
- Adaptive multiplication question selection
- Mastery scoring with centralized thresholds
- Local persistence through a repository abstraction
- Daily goal and achievement evaluation
- Automated tests for core learning logic

## Development

Install dependencies:

```bash
npm install
```

Start the Expo app:

```bash
npm start
```

Run validation:

```bash
npm run lint
npm run typecheck
npm test
npm run doctor
```

## Notes

- Multiplication facts can be tracked as commutative or directional facts from Settings.
- Progress persistence is routed through `src/repositories/localProgressRepository.ts`.
- Core math and adaptive-learning logic lives under `src/features/` so it stays independent of the UI.
