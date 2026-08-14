# Children's Math Skills App — Game Design Specification

## 1. Product Vision

Create a production-quality React Native mobile application using Expo, TypeScript, and Expo Router to help children strengthen mathematics skills.

The application focuses on:

- Addition
- Subtraction
- Multiplication
- Division
- Multiplication tables from 1×1 through 12×12

The experience should feel like a fun educational game rather than a traditional worksheet or test.

The central educational goal is to help children develop automatic recall of multiplication facts while also building broader arithmetic skills.

---

## 2. Technology Requirements

Use:

- React Native
- Expo
- TypeScript
- Expo Router
- Functional React components
- React hooks
- Modern TypeScript patterns
- Responsive layouts for phones and tablets
- Accessible touch targets
- Clean component architecture
- Strong separation between UI, game logic, question generation, persistence, and progress tracking

Avoid unnecessary third-party dependencies.

The architecture should make it easy to add additional math operations and games later.

---

## 3. Application Navigation

Use Expo Router.

Primary areas:

- Home
- Practice
- Multiplication Tables
- Games
- Progress
- Settings

### Home

Provide a child-friendly dashboard showing:

- Current level
- Daily goal
- Current streak
- Recent performance
- Recommended practice
- Quick access to multiplication practice

---

## 4. User Profiles

Design the data model so multiple children can eventually have separate profiles.

A profile/user identifier should be associated with:

- Progress
- Mastery
- Practice history
- Settings
- Achievements
- Daily goals

Do not hard-code the application around a single global progress record.

A default profile may be used initially, but the architecture must support multiple profiles.

---

## 5. Math Practice Engine

Create a reusable math question engine supporting:

- Addition
- Subtraction
- Multiplication
- Division

Example model:

```ts
type MathQuestion = {
  id: string;
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division';
  operand1: number;
  operand2: number;
  correctAnswer: number;
  difficulty: number;
};
```

Question-generation logic must be independent from UI components.

---

## 6. Addition

Support configurable difficulty.

### Beginner

- 0–10
- 0–20

### Intermediate

- 0–50
- 0–100

### Advanced

- 0–500
- 0–1,000

Structure the difficulty system so additional levels can be added later.

---

## 7. Subtraction

Generate subtraction problems while avoiding negative answers unless negative numbers are explicitly enabled.

Examples:

- 10 − 3
- 42 − 17
- 100 − 56

Difficulty should increase based on number size and complexity.

---

## 8. Multiplication

Multiplication is a core feature.

Support:

- Random multiplication
- Individual multiplication tables
- Multiple selected tables
- Table ranges
- 1×1 through 12×12

There are 144 possible multiplication facts from 1×1 through 12×12.

Each fact should have its own progress record.

Example:

```ts
type MultiplicationFactProgress = {
  factor1: number;
  factor2: number;
  attempts: number;
  correct: number;
  incorrect: number;
  averageResponseTimeMs: number;
  masteryScore: number;
  lastPracticedAt?: string;
};
```

Treat mathematically equivalent facts appropriately.

For example:

- 7 × 8
- 8 × 7

may optionally represent the same underlying fact.

This behavior should be configurable.

---

## 9. Division

Initially generate division problems with whole-number answers.

Examples:

- 56 ÷ 7 = 8
- 72 ÷ 8 = 9

Do not generate fractional answers unless a future difficulty setting enables them.

Where appropriate, connect division practice to multiplication facts.

For example:

- 7 × 8 = 56
- 56 ÷ 7 = 8
- 56 ÷ 8 = 7

This reinforces the relationship between multiplication and division.

---

## 10. Multiplication Table Mode

Create a dedicated multiplication-table experience.

Allow selection of:

- One table
- Multiple tables
- A range of tables
- All tables from 1 through 12

Examples:

- Practice the 7s
- Practice 6s and 7s
- Practice 1–5
- Practice 1–12

Clearly display which tables are being practiced.

---

## 11. Multiplication Fact Grid

Create an optional visual multiplication grid:

```text
     × | 1 | 2 | 3 | 4 | ... | 12
    --------------------------------
     1 |   |   |   |   |     |
     2 |   |   |   |   |     |
     3 |   |   |   |   |     |
    ...
    12 |   |   |   |   |     |
```

Each cell should visually indicate mastery.

Possible states:

- Not practiced
- Learning
- Developing
- Proficient
- Mastered

The UI must not rely solely on color to communicate state.

Each cell should be tappable and should allow immediate practice of that fact.

---

## 12. Adaptive Question Selection

Do not simply generate completely random questions.

Create an adaptive question-selection system that considers:

- Number of previous attempts
- Accuracy
- Recent incorrect answers
- Response time
- Time since last practice
- Mastery score
- Current difficulty
- Selected multiplication tables
- Recent questions

Questions that the child struggles with should appear more frequently.

Mastered questions should still occasionally appear for retention.

Suggested configurable weighting:

- 60% weak/learning questions
- 25% developing questions
- 15% mastered/review questions

Avoid showing the exact same question repeatedly in immediate succession.

---

## 13. Mastery System

Create a mastery score from 0–100 for individual math skills.

Consider:

- Accuracy
- Number of attempts
- Response time
- Recent performance
- Consistency

Suggested levels:

| Score | Level |
|---:|---|
| 0–19 | Not Started |
| 20–39 | Learning |
| 40–59 | Developing |
| 60–79 | Proficient |
| 80–94 | Strong |
| 95–100 | Mastered |

Thresholds should be centralized configuration.

One correct answer must not immediately produce "Mastered."

Mastery requires repeated successful performance.

---

## 14. Practice Sessions

A practice session supports:

- Number of questions
- Operation
- Difficulty
- Time limit
- Selected multiplication tables
- Adaptive mode

Example:

```text
20 questions
Multiplication
Tables 6–8
Adaptive difficulty
```

After each question:

1. Display the result.
2. Indicate whether the answer was correct.
3. Briefly show the correct answer when incorrect.
4. Record response time.
5. Update mastery.
6. Move to the next question.

Incorrect answers should not feel punitive.

Use encouraging language such as:

- "Nice try!"
- "Almost!"
- "Let's learn this one."
- "Great job!"

---

## 15. Answer Input

Create a large, child-friendly numeric keypad supporting:

- Number buttons
- Backspace
- Clear
- Submit

Support physical keyboard input where available.

Avoid tiny buttons.

The keypad should work well on phones and tablets.

---

## 16. Timed Mode

Create optional timed challenges:

- 30 seconds
- 60 seconds
- 2 minutes

Track:

- Questions attempted
- Correct answers
- Accuracy
- Average response time
- Best score

Timed mode should be optional.

Normal learning mode should emphasize accuracy and mastery rather than speed.

---

## 17. Games

Create a reusable game framework.

Initially implement:

### Quick Challenge

Answer as many questions as possible within a fixed time.

### Streak Challenge

Continue answering questions correctly to build a streak.

### Multiplication Challenge

Focus exclusively on multiplication facts.

### Weak Facts Challenge

Automatically generate a session using the child's least-mastered facts.

Games must reuse the same question-generation and mastery systems rather than duplicating logic.

---

## 18. Progress

Create a visually appealing progress dashboard showing:

- Overall accuracy
- Questions answered
- Current streak
- Longest streak
- Average response time
- Questions mastered
- Daily practice
- Weekly practice

For multiplication also show:

- Tables mastered
- Tables in progress
- Weakest facts
- Strongest facts
- Multiplication fact grid

Allow drill-down into tables and individual facts.

---

## 19. Recommended Practice

Home should recommend what the child should practice next.

Recommendations must be based on actual mastery data.

Examples:

- "You should practice your 7s today."
- "You have 3 multiplication facts that need more practice."
- "Great job on your 4s! Try your 5s next."

Do not generate recommendations randomly.

---

## 20. Rewards

Create a simple reward system supporting:

- Stars
- XP
- Levels
- Badges
- Daily streaks

Initial achievements:

- First 10 Questions
- 10 Correct in a Row
- Mastered the 2s
- Mastered the 5s
- Mastered 25 Multiplication Facts
- Mastered All Multiplication Facts

The system should be extensible.

Rewards should encourage practice without making mistakes feel negative.

---

## 21. Daily Goals

Support:

- 10 questions
- 20 questions
- 30 questions
- 10 minutes
- Custom goal

Show progress toward the daily goal.

Example:

```text
Today's Goal

16 / 20 questions

80%
```

Daily goal calculations must handle dates and application restarts correctly.

---

## 22. Persistence

Create a persistence abstraction rather than accessing storage throughout the UI.

Example:

```ts
interface ProgressRepository {
  getProgress(userId: string): Promise<UserProgress>;
  saveProgress(userId: string, progress: UserProgress): Promise<void>;
  recordAnswer(
    userId: string,
    result: AnswerResult
  ): Promise<void>;
}
```

The initial implementation can use local device storage.

The persistence layer should later be replaceable by a backend/database without rewriting UI or business logic.

---

## 23. Data Models

Create appropriate TypeScript types for:

- UserProfile
- UserSettings
- MathQuestion
- AnswerResult
- PracticeSession
- MathSkillProgress
- MultiplicationFactProgress
- Achievement
- DailyGoal
- GameResult

Keep data models separate from React components.

---

## 24. Accessibility

Pay particular attention to:

- Large touch targets
- Readable fonts
- Strong contrast
- Simple language
- Clear visual feedback
- Avoiding reliance on color alone
- Screen-reader labels
- Dynamic text sizing where practical

---

## 25. Responsive Design

Support:

- iPhone
- Android phones
- iPad
- Android tablets

Use responsive layouts instead of hard-coded dimensions.

On tablets, take advantage of additional space.

The multiplication grid should become larger and easier to use on tablets.

---

## 26. Visual Design

Use a cheerful, modern educational-game aesthetic.

The UI should feel:

- Fun
- Friendly
- Clean
- Encouraging
- Modern
- Appropriate for children

Avoid a corporate/business appearance.

Avoid excessive animation.

Use animation strategically for:

- Correct answers
- Completing practice sessions
- Earning achievements
- Increasing streaks
- Mastering multiplication facts

Respect reduced-motion accessibility settings where practical.

---

## 27. Error Handling

Gracefully handle:

- Missing progress data
- Corrupt local data
- Unexpected question-generation errors
- Storage failures
- Invalid answers
- Application restarts during a session

Never allow corrupted progress data to crash the application.

---

## 28. Suggested Architecture

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
    quick-challenge.tsx
    streak.tsx

  progress/
    index.tsx

  settings/
    index.tsx

src/
  components/

  features/
    math/
      questionGenerator.ts
      questionSelector.ts
      masteryCalculator.ts
      multiplicationFacts.ts

    practice/
    progress/
    games/

  repositories/
  services/
  hooks/
  types/
  constants/
  utils/
```

Adapt this structure when necessary, while maintaining separation between UI, business logic, persistence, math algorithms, and progress tracking.

---

## 29. Development Rules

Before implementing a feature:

1. Identify the appropriate data model.
2. Identify reusable business logic.
3. Keep business logic independent of React UI.
4. Create reusable components.
5. Use TypeScript types throughout.
6. Avoid unnecessary dependencies.
7. Make the UI responsive.
8. Make important logic testable.

Do not create one enormous component.

---

## 30. Testing

Create unit tests for:

- Addition question generation
- Subtraction question generation
- Multiplication question generation
- Division question generation
- Invalid question prevention
- Answer evaluation
- Mastery calculations
- Multiplication fact normalization
- Adaptive question selection
- Progress updates
- Daily goal calculations
- Achievement detection

Explicitly test multiplication edge cases:

- 1 × 1
- 1 × 12
- 12 × 1
- 12 × 12

Test the complete 1×1 through 12×12 range.

---

## 31. Critical Multiplication Learning Flow

The multiplication experience should allow a child to move naturally from:

"Practice multiplication"

to:

"Practice my 7s"

to:

"These are the 7 facts I need to work on"

to:

"Practice those specific facts"

to:

"Show me my progress"

The application should progressively learn which multiplication facts the child knows and which require reinforcement.

The goal is not merely to generate multiplication questions.

The goal is to create an adaptive multiplication-fact learning system that helps the child eventually achieve automatic recall of the 1×1 through 12×12 multiplication tables.

---

## 32. Initial MVP

The complete MVP should allow a child to:

1. Open the application.
2. Start math practice.
3. Answer addition questions.
4. Answer subtraction questions.
5. Answer multiplication questions.
6. Answer division questions.
7. Practice a specific multiplication table.
8. Practice multiple tables.
9. View the 1–12 multiplication grid.
10. Select an individual multiplication fact.
11. Receive encouraging feedback.
12. Have performance recorded.
13. See mastery improve.
14. Receive recommendations.
15. Practice weak multiplication facts.
16. Earn rewards.
17. Track daily goals.
18. Play challenge games.
19. Review progress.

The multiplication mastery system is the highest-priority educational feature.
