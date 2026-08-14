import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/src/components/Card';
import { FactGrid } from '@/src/components/FactGrid';
import { MasteryBadge } from '@/src/components/MasteryBadge';
import { Screen } from '@/src/components/Screen';
import { SectionHeader } from '@/src/components/SectionHeader';
import { StatCard } from '@/src/components/StatCard';
import { colors, spacing } from '@/src/constants/theme';
import { getDailyGoalStatus } from '@/src/features/progress/dailyGoals';
import { getMultiplicationSummary, getOverallAccuracy } from '@/src/features/progress/progressSummary';
import { useAppData } from '@/src/hooks/useAppData';

export default function ProgressScreen() {
  const { loading, profile, progress, settings } = useAppData();

  if (loading || !profile || !progress || !settings) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  const summary = getMultiplicationSummary(progress, settings.commutativeFacts);
  const dailyGoal = getDailyGoalStatus(settings.dailyGoal, progress);

  return (
    <Screen>
      <SectionHeader title="Progress dashboard" subtitle="Track accuracy, streaks, daily goals, achievements, and multiplication growth." />
      <View style={styles.row}>
        <StatCard label="Questions Answered" value={String(progress.totalQuestions)} tone="info" />
        <StatCard label="Overall Accuracy" value={`${getOverallAccuracy(progress)}%`} tone="success" />
      </View>
      <View style={styles.row}>
        <StatCard label="Longest Streak" value={String(progress.longestStreak)} tone="warning" />
        <StatCard label="Daily Goal" value={`${dailyGoal.progressPercentage}%`} />
      </View>

      <Card>
        <Text style={styles.title}>Strongest facts</Text>
        {summary.strongest.map((fact) => (
          <View key={`${fact.factor1}-${fact.factor2}`} style={styles.factRow}>
            <Text style={styles.text}>{fact.factor1} × {fact.factor2}</Text>
            <MasteryBadge score={fact.masteryScore} />
          </View>
        ))}
      </Card>

      <Card>
        <Text style={styles.title}>Weakest facts</Text>
        {summary.weakest.map((fact) => (
          <View key={`${fact.factor1}-${fact.factor2}`} style={styles.factRow}>
            <Text style={styles.text}>{fact.factor1} × {fact.factor2}</Text>
            <MasteryBadge score={fact.masteryScore} />
          </View>
        ))}
      </Card>

      <Card>
        <Text style={styles.title}>Achievements</Text>
        {progress.achievements.map((achievement) => (
          <Text key={achievement.id} style={styles.text}>{achievement.earnedAt ? '★' : '○'} {achievement.title}</Text>
        ))}
      </Card>

      <Card>
        <Text style={styles.title}>Multiplication grid</Text>
        <FactGrid progressMap={progress.multiplicationFacts} commutative={settings.commutativeFacts} />
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
  factRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
});
