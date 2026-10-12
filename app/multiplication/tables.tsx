import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

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
  const { operation: operationParam } = useLocalSearchParams<{ operation?: string }>();
  const operation = operationParam === 'division' ? 'division' : 'multiplication';
  const { loading, progress, settings } = useAppData();

  if (loading || !progress || !settings) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  const summary = getMultiplicationSummary(progress, settings.commutativeFacts);
  const startPractice = (tables?: number[], questionCount?: number) =>
    router.push({
      pathname: '/practice/session',
      params: {
        operation,
        difficulty: '3',
        questionCount: String(
          questionCount ?? (operation === 'division' && tables ? tables.length * TABLE_NUMBERS.length : 12),
        ),
        adaptive: 'false',
        ...(tables ? { tables: tables.join(',') } : {}),
      },
    });

  return (
    <Screen>
      <SectionHeader
        title={operation === 'division' ? 'Pick a division table' : 'Pick a table'}
        subtitle={
          operation === 'division'
            ? 'Choose a divisor table from 1 to 12, or practice with random tables.'
            : 'Choose a table from 1 to 12, or practice with a random table.'
        }
      />
      <Card>
        <PrimaryButton
          label={operation === 'division' ? 'Practice random division tables' : 'Practice random tables'}
          onPress={() => startPractice()}
        />
      </Card>
      <View style={styles.grid}>
        {TABLE_NUMBERS.map((table) => {
          const tableProgress = summary.tableSummaries.find((entry) => entry.table === table);
          return (
            <Card key={table} style={styles.card}>
              <Text style={styles.title}>Table {table}</Text>
              <MasteryBadge score={tableProgress?.average ?? 0} />
              <PrimaryButton
                label={operation === 'division' ? `Practice ${table}s division` : `Practice ${table}s`}
                onPress={() => startPractice([table])}
              />
            </Card>
          );
        })}
      </View>
      <Card>
        <Text style={styles.title}>{operation === 'division' ? 'Division table ranges' : 'Table ranges'}</Text>
        <View style={styles.stack}>
          <PrimaryButton
            label={operation === 'division' ? 'Practice division 1–5' : 'Practice 1–5'}
            variant="secondary"
            onPress={() => startPractice([1, 2, 3, 4, 5], operation === 'division' ? 5 * 12 : 15)}
          />
          <PrimaryButton
            label={operation === 'division' ? 'Practice division 6–8' : 'Practice 6–8'}
            variant="secondary"
            onPress={() => startPractice([6, 7, 8], operation === 'division' ? 3 * 12 : 15)}
          />
          <PrimaryButton
            label={operation === 'division' ? 'Practice division 1–12' : 'Practice 1–12'}
            variant="secondary"
            onPress={() => startPractice(TABLE_NUMBERS, operation === 'division' ? 12 * 12 : 20)}
          />
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
  stack: {
    gap: spacing.sm,
  },
});
