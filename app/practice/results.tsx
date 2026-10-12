import { StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { Card } from '@/src/components/Card';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Screen } from '@/src/components/Screen';
import { SectionHeader } from '@/src/components/SectionHeader';
import { StatCard } from '@/src/components/StatCard';
import { colors, spacing } from '@/src/constants/theme';
import { parseNumberParam } from '@/src/utils/routeParams';

export default function PracticeResultsScreen() {
  const params = useLocalSearchParams<{
    correct?: string;
    total?: string;
    accuracy?: string;
    averageResponseTimeMs?: string;
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
  const correct = parseNumberParam(params.correct, 0);
  const total = parseNumberParam(params.total, 0);
  const accuracy = parseNumberParam(params.accuracy, 0);
  const averageResponseTimeMs = parseNumberParam(params.averageResponseTimeMs, 0);
  const handlePracticeAgain = () => {
    if (!params.operation) {
      router.replace('/practice');
      return;
    }

    router.replace({
      pathname: '/practice/session',
      params: {
        operation: params.operation,
        difficulty: params.difficulty ?? '2',
        questionCount: params.questionCount ?? '12',
        adaptive: params.adaptive ?? 'false',
        ...(params.tables ? { tables: params.tables } : {}),
        ...(params.factor1 ? { factor1: params.factor1 } : {}),
        ...(params.factor2 ? { factor2: params.factor2 } : {}),
        ...(params.timeLimitSeconds ? { timeLimitSeconds: params.timeLimitSeconds } : {}),
        ...(params.mode ? { mode: params.mode } : {}),
      },
    });
  };

  return (
    <Screen>
      <SectionHeader title="Nice work!" subtitle="Every session builds speed, confidence, and mastery." />
      <View style={styles.row}>
        <StatCard label="Correct" value={`${correct}/${total}`} tone="success" />
        <StatCard label="Accuracy" value={`${accuracy}%`} tone="info" />
      </View>
      <Card>
        <Text style={styles.title}>Session Summary</Text>
        <Text style={styles.text}>Average response time: {(averageResponseTimeMs / 1000).toFixed(1)}s</Text>
        <Text style={styles.text}>Keep practicing to strengthen automatic recall and build streaks.</Text>
      </Card>
      <View style={styles.stack}>
        <PrimaryButton label="Practice Again" onPress={handlePracticeAgain} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textMuted,
  },
  stack: {
    gap: spacing.sm,
  },
});
