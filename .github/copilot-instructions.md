# GitHub Copilot Repository Instructions

## Repository Purpose

This repository contains a React Native/Expo children's mathematics learning application.

The product helps children strengthen:

- Addition
- Subtraction
- Multiplication
- Division

The highest-priority educational feature is adaptive mastery of multiplication facts from 1×1 through 12×12.

## Authoritative Product Specification

Before making significant product or UI changes, read:

`game_design.md`

`game_design.md` is the authoritative product/game-design specification.

Do not silently remove, weaken, or reinterpret requirements from that document.

If a new request conflicts with the specification, identify the conflict and preserve the intended educational behavior unless the user explicitly requests a product change.

## Technology

Use:

- React Native
- Expo
- TypeScript
- Expo Router

Prefer Expo and React Native APIs over adding dependencies.

Before adding a dependency, determine whether the requirement can reasonably be implemented with existing project capabilities.

Keep dependencies compatible with the project's existing Expo SDK.

Do not perform broad dependency upgrades unless specifically requested.

## Architecture

Maintain clear separation between:

- UI
- Math/business logic
- Question generation
- Adaptive question selection
- Mastery calculations
- Practice sessions
- Games
- Progress
- Persistence

Do not put business logic inside screen components when it can live in a reusable service, hook, or pure function.

Avoid giant components.

Prefer small, composable components and strongly typed interfaces.

## Math Engine

The math engine must remain independent of React UI.

Question generation must be deterministic where practical when supplied with a random source, so core logic can be tested.

Never generate invalid questions accidentally.

Subtraction should not produce negative answers unless explicitly enabled.

Division should produce whole-number answers unless fractional division is explicitly enabled.

## Multiplication Facts

The multiplication system is a core feature.

Support all 144 facts from 1×1 through 12×12.

Maintain a stable identity for multiplication facts.

Do not accidentally create duplicate progress records.

If equivalent facts such as 7×8 and 8×7 are treated as one fact, centralize that normalization behavior.

Keep mastery calculations independent of UI.

## Adaptive Learning

Do not replace adaptive learning with random question generation.

Question selection should consider:

- Accuracy
- Attempts
- Incorrect answers
- Response time
- Recent performance
- Time since practice
- Mastery
- Selected tables
- Recent questions

Keep adaptive weighting configurable.

Avoid immediately repeating the same question.

## Mastery

Mastery is a score from 0–100.

Do not mark a fact mastered after one correct answer.

Mastery should represent repeated successful performance.

Keep mastery thresholds and weighting rules centralized.

If mastery behavior changes, add or update tests.

## Persistence

Access persisted data through repository/service abstractions.

Do not scatter direct storage calls throughout React components.

The initial implementation may use local device storage.

Keep the design replaceable so a future backend can be introduced without rewriting UI and business logic.

## Testing

Core math and learning logic must have automated tests.

When changing:

- question generation
- answer evaluation
- mastery
- multiplication fact identity
- adaptive selection
- progress
- daily goals
- achievements

update or add tests.

Always test edge cases.

The complete 1×1 through 12×12 multiplication range must remain valid.

## Responsive UI

The application must work on:

- iPhone
- Android phones
- iPad
- Android tablets

Do not use fixed dimensions that only work on a single device size.

Use responsive layouts.

Tablet layouts should take advantage of additional screen space.

## Accessibility

Use:

- large touch targets
- readable text
- strong contrast
- accessibility labels
- non-color-only status indicators
- sensible dynamic text sizing

Do not make color the sole indication of mastery or correctness.

Respect reduced-motion preferences where practical.

## Child-Friendly UX

The application should be encouraging rather than punitive.

Incorrect answers should provide constructive feedback.

Avoid language that shames the child.

Use simple, age-appropriate language.

Avoid unnecessary complexity in the child-facing interface.

## Navigation

Use Expo Router.

Keep route components focused on screen composition and interaction.

Move reusable business logic into `src/`.

## Code Quality

Use strict TypeScript where the project supports it.

Avoid `any` unless there is a justified reason.

Avoid magic numbers.

Centralize configuration.

Avoid duplicated business logic.

Use descriptive names.

Prefer pure functions for mathematical calculations.

## Changes

Before modifying an unfamiliar area:

1. Inspect the existing implementation.
2. Identify related types/services/components.
3. Reuse existing abstractions where appropriate.
4. Make the smallest coherent change.
5. Run relevant tests and validation.

Do not rewrite working functionality unnecessarily.

## Validation

After significant changes, run the appropriate:

- TypeScript checks
- tests
- lint checks
- Expo validation

Fix errors rather than leaving known failures.

Do not claim a feature is complete while its core implementation is broken.

## Documentation

Keep `README.md` and relevant developer documentation synchronized with meaningful architectural changes.

If a design decision materially affects future development, document it.

## Product Priority

When making tradeoffs, prioritize:

1. Correct mathematics
2. Adaptive multiplication learning
3. Reliable progress/mastery tracking
4. Child-friendly usability
5. Accessibility
6. Responsive phone/tablet behavior
7. Maintainable architecture
8. Visual polish

Do not sacrifice mathematical correctness or learning behavior merely to simplify UI implementation.

## Future Extensibility

The architecture should make it straightforward to add:

- new math operations
- new difficulty levels
- new games
- new achievements
- additional learning algorithms
- multiple child profiles
- cloud synchronization
- parental features

Do not prematurely implement those features unless requested.

Design for extension without over-engineering the MVP.

## Important Instruction for Copilot Agents

When asked to implement a feature:

- Read `game_design.md` first when the feature relates to product behavior.
- Inspect existing code before creating new abstractions.
- Implement the feature rather than only describing it.
- Do not stop at a plan unless explicitly asked for a plan.
- Do not leave core functionality as TODOs.
- Reuse existing math, progress, mastery, and persistence services.
- Add tests for important business logic.
- Validate the result before considering the task complete.
