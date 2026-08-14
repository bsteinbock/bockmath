import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';

import { Card } from '@/src/components/Card';
import { FactGrid } from '@/src/components/FactGrid';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Screen } from '@/src/components/Screen';
import { SectionHeader } from '@/src/components/SectionHeader';
import { colors } from '@/src/constants/theme';
import { getMultiplicationSummary } from '@/src/features/progress/progressSummary';
import { useAppData } from '@/src/hooks/useAppData';

export default function MultiplicationScreen() {
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
      <SectionHeader title="Multiplication mastery" subtitle="Practice tables, review a fact grid, and strengthen weak facts." />
      <Card>
        <Text style={styles.title}>Focus next on your weak facts</Text>
        <Text style={styles.text}>Adaptive sessions increase repetition for facts that need reinforcement and keep mastered facts in rotation for review.</Text>
        <PrimaryButton label="Start adaptive multiplication" onPress={() => router.push('/practice/session?operation=multiplication&difficulty=2&questionCount=15&adaptive=true')} />
      </Card>
      <Card>
        <Text style={styles.title}>Choose a path</Text>
        <PrimaryButton label="Practice by table" onPress={() => router.push('/multiplication/tables')} />
        <PrimaryButton label="Open fact grid" variant="secondary" onPress={() => router.push('/multiplication/fact-grid')} />
      </Card>
      <Card>
        <Text style={styles.title}>Grid preview</Text>
        <FactGrid progressMap={progress.multiplicationFacts} commutative={settings.commutativeFacts} onSelect={(factor1, factor2) => router.push({ pathname: '/practice/session', params: { operation: 'multiplication', difficulty: '2', questionCount: '10', adaptive: 'false', factor1: String(factor1), factor2: String(factor2) } })} />
        <Text style={styles.text}>{summary.mastered} of 144 cells are currently at mastered strength.</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
  },
});
