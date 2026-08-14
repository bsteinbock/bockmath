export function evaluateAnswer(submittedAnswer: number | null, correctAnswer: number): boolean {
  return submittedAnswer !== null && submittedAnswer === correctAnswer;
}
