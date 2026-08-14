import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { Card } from '@/src/components/Card';
import { NumericKeypad } from '@/src/components/NumericKeypad';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Screen } from '@/src/components/Screen';
import { SectionHeader } from '@/src/components/SectionHeader';
import { DIFFICULTY_LABELS, ENCOURAGING_FEEDBACK, OPERATION_LABELS } from '@/src/constants/math';
import { colors, spacing } from '@/src/constants/theme';
import { evaluateAnswer } from '@/src/features/math/answerEvaluator';
import { generateQuestion } from '@/src/features/math/questionGenerator';
import { selectAdaptiveMultiplicationFact } from '@/src/features/math/questionSelector';
import { getOverallAccuracy } from '@/src/features/progress/progressSummary';
import { useAppData } from '@/src/hooks/useAppData';
import { MathQuestion, PracticeSessionConfig } from '@/src/types/models';
import { parseBooleanParam, parseCsvNumbers, parseNumberParam } from '@/src/utils/routeParams';

function randomFeedback(type: 'correct' | 'incorrect'): string {
  const options = ENCOURAGING_FEEDBACK[type];
  return options[Math.floor(Math.random() * options.length)] ?? '';
}

export default function PracticeSessionScreen() {
  const params = useLocalSearchParams<{
    operation?: string;
    difficulty?: string;
    questionCount?: string;
    adaptive?: string;
    tables?: string;
    factor1?: string;
    factor2?: string;
    timeLimitSeconds?: string;
    mode?: 'practice' | 'game';
  }>();
  const { loading, progress, settings, recordAnswer } = useAppData();
  const [resultsCount, setResultsCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answer, setAnswer] = useState('');
  const [question, setQuestion] = useState<MathQuestion>();
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string }>();
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const shownAtRef = useRef(Date.now());
  const recentFactKeysRef = useRef<string[]>([]);

  const config = useMemo<PracticeSessionConfig>(() => {
    const factor1 = parseNumberParam(params.factor1, 0);
    const factor2 = parseNumberParam(params.factor2, 0);
    const selectedFacts = factor1 && factor2 ? [{ factor1, factor2 }] : undefined;

    return {
      operation: (params.operation as PracticeSessionConfig['operation']) ?? 'multiplication',
      difficulty: parseNumberParam(params.difficulty, 2),
      questionCount: parseNumberParam(params.questionCount, 12),
      adaptive: parseBooleanParam(params.adaptive, false),
      selectedTables: parseCsvNumbers(params.tables),
      selectedFacts,
      timeLimitSeconds: params.timeLimitSeconds ? parseNumberParam(params.timeLimitSeconds, 0) : undefined,
      mode: params.mode ?? 'practice',
    };
  }, [params]);

  const buildQuestion = useMemo(() => {
    if (!progress || !settings) {
      return () => undefined;
    }

    return () => {
      if (config.operation === 'multiplication' && config.adaptive) {
        const fact = selectAdaptiveMultiplicationFact({
          progressMap: progress.multiplicationFacts,
          selectedTables: config.selectedTables,
          selectedFacts: config.selectedFacts,
          recentFactKeys: recentFactKeysRef.current,
          commutative: settings.commutativeFacts,
        });
        return generateQuestion({ ...config, selectedFacts: [fact] });
      }

      return generateQuestion(config);
    };
  }, [config, progress, settings]);

  const finishSession = useCallback(() => {
    const relevantResults = progress?.recentResults.slice(-Math.max(1, resultsCount)) ?? [];
    const averageResponseTimeMs = relevantResults.length
      ? Math.round(relevantResults.reduce((sum, result) => sum + result.responseTimeMs, 0) / relevantResults.length)
      : 0;

    router.replace({
      pathname: '/practice/results',
      params: {
        correct: String(correctCount),
        total: String(resultsCount),
        accuracy: String(resultsCount ? Math.round((correctCount / resultsCount) * 100) : 0),
        averageResponseTimeMs: String(averageResponseTimeMs),
      },
    });
  }, [correctCount, progress?.recentResults, resultsCount]);

  useEffect(() => {
    if (!question && buildQuestion) {
      const next = buildQuestion();
      setQuestion(next);
      shownAtRef.current = Date.now();
    }
  }, [buildQuestion, question]);

  useEffect(() => {
    if (!config.timeLimitSeconds) {
      return;
    }

    setRemainingSeconds(config.timeLimitSeconds);
    const interval = setInterval(() => {
      setRemainingSeconds((current) => {
        if (current === null) return null;
        if (current <= 1) {
          clearInterval(interval);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [config.timeLimitSeconds]);

  useEffect(() => {
    if (remainingSeconds === 0) {
      finishSession();
    }
  }, [finishSession, remainingSeconds]);

  const moveToNextQuestion = () => {
    if (resultsCount >= config.questionCount || remainingSeconds === 0) {
      finishSession();
      return;
    }

    const next = buildQuestion?.();
    setQuestion(next);
    setAnswer('');
    setFeedback(undefined);
    shownAtRef.current = Date.now();
  };

  const handleSubmit = async () => {
    if (!question || feedback) {
      return;
    }

    const submittedAnswer = answer ? Number(answer) : null;
    const isCorrect = evaluateAnswer(submittedAnswer, question.correctAnswer);
    const responseTimeMs = Date.now() - shownAtRef.current;
    const nextResultsCount = resultsCount + 1;
    const nextCorrectCount = correctCount + (isCorrect ? 1 : 0);

    setResultsCount(nextResultsCount);
    setCorrectCount(nextCorrectCount);
    setFeedback({
      correct: isCorrect,
      message: `${randomFeedback(isCorrect ? 'correct' : 'incorrect')} ${isCorrect ? '' : `The answer is ${question.correctAnswer}.`}`.trim(),
    });

    if (question.relatedFact) {
      recentFactKeysRef.current = [
        ...recentFactKeysRef.current.slice(-2),
        `${question.relatedFact.factor1}x${question.relatedFact.factor2}`,
      ];
    }

    await recordAnswer({
      questionId: question.id,
      operation: question.operation,
      submittedAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      responseTimeMs,
      answeredAt: new Date().toISOString(),
      relatedFact: question.relatedFact,
    });
  };

  if (loading || !progress || !settings || !question) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader
        title={config.mode === 'game' ? 'Challenge Time!' : OPERATION_LABELS[config.operation]}
        subtitle={`${DIFFICULTY_LABELS[Math.max(0, config.difficulty - 1)]} • Question ${Math.min(resultsCount + 1, config.questionCount)} of ${config.questionCount}`}
      />

      <View style={styles.row}>
        <Card style={styles.progressCard}>
          <Text style={styles.eyebrow}>Correct</Text>
          <Text style={styles.metric}>{correctCount}</Text>
        </Card>
        <Card style={styles.progressCard}>
          <Text style={styles.eyebrow}>Accuracy</Text>
          <Text style={styles.metric}>
            {resultsCount ? Math.round((correctCount / resultsCount) * 100) : getOverallAccuracy(progress)}%
          </Text>
        </Card>
        {remainingSeconds !== null ? (
          <Card style={styles.progressCard}>
            <Text style={styles.eyebrow}>Time Left</Text>
            <Text style={styles.metric}>{remainingSeconds}s</Text>
          </Card>
        ) : null}
      </View>

      <Card>
        <Text style={styles.prompt}>{question.prompt}</Text>
        <Text style={styles.answer}>{answer || '—'}</Text>
        {feedback ? (
          <View style={styles.feedbackBlock}>
            <Text style={[styles.feedback, { color: feedback.correct ? colors.success : colors.warning }]}>{feedback.message}</Text>
            <PrimaryButton
              label={resultsCount >= config.questionCount || remainingSeconds === 0 ? 'See Results' : 'Next Question'}
              onPress={moveToNextQuestion}
            />
          </View>
        ) : (
          <NumericKeypad value={answer} onChange={setAnswer} onSubmit={handleSubmit} />
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  progressCard: {
    flex: 1,
    minWidth: 110,
  },
  eyebrow: {
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  metric: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
  },
  prompt: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  answer: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
  },
  feedbackBlock: {
    gap: spacing.sm,
  },
  feedback: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
    textAlign: 'center',
  },
});
