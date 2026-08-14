import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { Card } from '@/src/components/Card';
import { MasteryBadge } from '@/src/components/MasteryBadge';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Screen } from '@/src/components/Screen';
import { SectionHeader } from '@/src/components/SectionHeader';
import { TABLE_NUMBERS } from '@/src/constants/math';
import { colors, spacing } from '@/src/constants/theme';
import { getMultiplicationSummary } from '@/src/features/progress/progressSummary';
import { useAppData } from '@/src/hooks/useAppData';

export default function MultiplicationTablesScreen() {
  const { loading, progress, settings } = useAppData();

  if (loading || !progress || !settings) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  const summary = getMultiplicationSummary(progress, settings.commutativeFacts);

  return (
    <Screen>
      <SectionHeader title="Pick a table" subtitle="Choose one table, a small set, or the whole grid." />
      <View style={styles.grid}>
        {TABLE_NUMBERS.map((table) => {
          const tableProgress = summary.tableSummaries.find((entry) => entry.table === table);
          return (
            <Card key={table} style={styles.card}>
              <Text style={styles.title}>Table {table}</Text>
              <MasteryBadge score={tableProgress?.average ?? 0} />
              <Text style={styles.text}>{tableProgress?.mastered ?? 0} mastered facts</Text>
              <PrimaryButton
                label={`Practice ${table}s`}
                onPress={() =>
                  router.push({
                    pathname: '/practice/session',
                    params: {
                      operation: 'multiplication',
                      difficulty: '2',
                      questionCount: '12',
                      adaptive: 'true',
                      tables: String(table),
                    },
                  })
                }
              />
            </Card>
          );
        })}
      </View>
      <Card>
        <Text style={styles.title}>Table ranges</Text>
        <View style={styles.stack}>
          <PrimaryButton label="Practice 1–5" variant="secondary" onPress={() => router.push('/practice/session?operation=multiplication&difficulty=1&questionCount=15&adaptive=true&tables=1,2,3,4,5')} />
          <PrimaryButton label="Practice 6–8" variant="secondary" onPress={() => router.push('/practice/session?operation=multiplication&difficulty=2&questionCount=15&adaptive=true&tables=6,7,8')} />
          <PrimaryButton label="Practice 1–12" variant="secondary" onPress={() => router.push('/practice/session?operation=multiplication&difficulty=3&questionCount=20&adaptive=true&tables=1,2,3,4,5,6,7,8,9,10,11,12')} />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  card: {
    width: '48%',
    minWidth: 160,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  text: {
    fontSize: 14,
    color: colors.textMuted,
  },
  stack: {
    gap: spacing.sm,
  },
});
