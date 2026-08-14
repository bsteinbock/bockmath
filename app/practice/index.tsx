import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { Card } from '@/src/components/Card';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Screen } from '@/src/components/Screen';
import { SectionHeader } from '@/src/components/SectionHeader';
import { DEFAULT_SELECTED_TABLES, OPERATION_LABELS } from '@/src/constants/math';
import { colors, spacing } from '@/src/constants/theme';
import { MathOperation } from '@/src/types/models';

const OPERATIONS: MathOperation[] = ['addition', 'subtraction', 'multiplication', 'division'];

export default function PracticeScreen() {
  return (
    <Screen>
      <SectionHeader
        title="Choose practice"
        subtitle="Pick an operation, focus on multiplication tables, or launch an adaptive session."
      />

      {OPERATIONS.map((operation) => (
        <Card key={operation}>
          <Text style={styles.cardTitle}>{OPERATION_LABELS[operation]}</Text>
          <Text style={styles.description}>Friendly questions with quick feedback and trackable progress.</Text>
          <PrimaryButton
            label={`Start ${OPERATION_LABELS[operation]}`}
            onPress={() =>
              router.push({
                pathname: '/practice/session',
                params: {
                  operation,
                  difficulty: operation === 'multiplication' || operation === 'division' ? '2' : '1',
                  questionCount: '12',
                  adaptive: operation === 'multiplication' ? 'true' : 'false',
                },
              })
            }
          />
        </Card>
      ))}

      <Card>
        <Text style={styles.cardTitle}>Adaptive multiplication</Text>
        <Text style={styles.description}>Prioritizes weak facts, mixes in review, and avoids immediate repeats.</Text>
        <View style={styles.buttonStack}>
          <PrimaryButton
            label="Practice tables 2–5"
            onPress={() =>
              router.push({
                pathname: '/practice/session',
                params: {
                  operation: 'multiplication',
                  difficulty: '2',
                  questionCount: '15',
                  adaptive: 'true',
                  tables: DEFAULT_SELECTED_TABLES.join(','),
                },
              })
            }
          />
          <PrimaryButton label="Choose tables" variant="secondary" onPress={() => router.push('/multiplication/tables')} />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
  },
  buttonStack: {
    gap: spacing.sm,
  },
});
