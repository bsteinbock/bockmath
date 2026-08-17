import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { NumericKeypad } from '@/src/components/NumericKeypad';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { DIFFICULTY_LABELS, ENCOURAGING_FEEDBACK, OPERATION_LABELS } from '@/src/constants/math';
import { colors, spacing } from '@/src/constants/theme';
import { evaluateAnswer } from '@/src/features/math/answerEvaluator';
import { generateQuestion } from '@/src/features/math/questionGenerator';
import { selectAdaptiveMultiplicationFact } from '@/src/features/math/questionSelector';
import { useAppData } from '@/src/hooks/useAppData';
import { MathQuestion, PracticeSessionConfig } from '@/src/types/models';
import { parseBooleanParam, parseCsvNumbers, parseNumberParam } from '@/src/utils/routeParams';

function randomFeedback(type: 'correct' | 'incorrect'): string {
  const options = ENCOURAGING_FEEDBACK[type];
  return options[Math.floor(Math.random() * options.length)] ?? '';
}

export default function PracticeScreen() {
  const params = useLocalSearchParams<{
    operation?: string;
    difficulty?: string;
    questionCount?: string;
    adaptive?: string;
    tables?: string;
  }>();
  const { loading, profile, progress, settings, recordAnswer } = useAppData();
  const [resultsCount, setResultsCount] = useState(0);
  const [answer, setAnswer] = useState('');
  const [question, setQuestion] = useState<MathQuestion>();
  const [feedback, setFeedback] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const shownAtRef = useRef(0);
  const recentFactKeysRef = useRef<string[]>([]);
  const initializedSessionRef = useRef<string | undefined>(undefined);

  const config = useMemo<PracticeSessionConfig>(
    () => ({
      operation: (params.operation as PracticeSessionConfig['operation']) ?? 'multiplication',
      difficulty: parseNumberParam(params.difficulty, 2),
      questionCount: parseNumberParam(params.questionCount, 12),
      adaptive: parseBooleanParam(params.adaptive, true),
      selectedTables: parseCsvNumbers(params.tables),
    }),
    [params.adaptive, params.difficulty, params.operation, params.questionCount, params.tables],
  );
  const sessionKey = [
    params.operation,
    params.difficulty,
    params.questionCount,
    params.adaptive,
    params.tables,
  ].join('|');

  const buildQuestion = useCallback(() => {
    if (!progress || !settings) return undefined;
    if (config.operation === 'multiplication' && config.adaptive) {
      const fact = selectAdaptiveMultiplicationFact({
        progressMap: progress.multiplicationFacts,
        selectedTables: config.selectedTables,
        recentFactKeys: recentFactKeysRef.current,
        commutative: settings.commutativeFacts,
      });
      return generateQuestion({ ...config, selectedFacts: [fact] });
    }
    return generateQuestion(config);
  }, [config, progress, settings]);

  const startNextQuestion = useCallback(() => {
    const next = buildQuestion();
    setQuestion(next);
    setAnswer('');
    setFeedback(undefined);
    shownAtRef.current = Date.now();
  }, [buildQuestion]);

  useEffect(() => {
    if (loading || !progress || !settings || initializedSessionRef.current === sessionKey) {
      return;
    }

    initializedSessionRef.current = sessionKey;
    setResultsCount(0);
    recentFactKeysRef.current = [];
    startNextQuestion();
  }, [loading, progress, sessionKey, settings, startNextQuestion]);

  const handleSubmit = async () => {
    if (!question || feedback || submitting) return;
    setSubmitting(true);
    const submittedAnswer = answer ? Number(answer) : null;
    const isCorrect = evaluateAnswer(submittedAnswer, question.correctAnswer);
    const nextResultsCount = resultsCount + 1;
    setResultsCount(nextResultsCount);
    if (question.relatedFact) {
      recentFactKeysRef.current = [
        ...recentFactKeysRef.current.slice(-2),
        `${question.relatedFact.factor1}x${question.relatedFact.factor2}`,
      ];
    }
    try {
      await recordAnswer({
        questionId: question.id,
        operation: question.operation,
        submittedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        responseTimeMs: Date.now() - shownAtRef.current,
        answeredAt: new Date().toISOString(),
        relatedFact: question.relatedFact,
      });
      if (nextResultsCount >= config.questionCount) {
        router.navigate('/dashboard');
      } else if (isCorrect) {
        startNextQuestion();
      } else {
        setFeedback(`${randomFeedback('incorrect')} The answer is ${question.correctAnswer}.`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !profile || !progress || !settings || !question) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{OPERATION_LABELS[config.operation]}</Text>
          <View accessibilityLabel={`Current user: ${profile.firstName}`} style={styles.userBadge}>
            <Text style={styles.userBadgeText}>{profile.firstName}</Text>
          </View>
        </View>
        <Text style={styles.headerSubtitle}>
          {DIFFICULTY_LABELS[Math.max(0, config.difficulty - 1)]} · Question{' '}
          {Math.min(resultsCount + 1, config.questionCount)} of {config.questionCount}
        </Text>
      </View>
      <View style={styles.questionArea}>
        <Text style={styles.prompt}>{question.prompt}</Text>
        <Text style={styles.answer}>{answer || '—'}</Text>
      </View>
      {feedback ? (
        <View style={styles.feedbackArea}>
          <Text style={styles.feedback}>{feedback}</Text>
          <PrimaryButton label="Next question" onPress={startNextQuestion} />
        </View>
      ) : (
        <NumericKeypad
          compact
          value={answer}
          onChange={setAnswer}
          onSubmit={handleSubmit}
          disabled={submitting}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1, gap: spacing.sm, padding: spacing.md },
  loading: { alignItems: 'center', backgroundColor: colors.background, flex: 1, justifyContent: 'center' },
  header: { gap: 2 },
  headerRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  headerTitle: { color: colors.text, flex: 1, fontSize: 24, fontWeight: '800', textAlign: 'center' },
  headerSubtitle: { color: colors.textMuted, fontSize: 14, textAlign: 'center' },
  userBadge: {
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    maxWidth: 120,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  userBadgeText: { color: colors.primary, fontSize: 13, fontWeight: '800' },
  questionArea: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  prompt: { color: colors.text, fontSize: 44, fontWeight: '800' },
  answer: { color: colors.primary, fontSize: 34, fontWeight: '800', minHeight: 44 },
  feedbackArea: { flex: 1, gap: spacing.md, justifyContent: 'center' },
  feedback: { color: colors.warning, fontSize: 18, fontWeight: '700', lineHeight: 26, textAlign: 'center' },
});
