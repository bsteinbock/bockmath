import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { Card } from '@/src/components/Card';
import { MasteryBadge } from '@/src/components/MasteryBadge';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Screen } from '@/src/components/Screen';
import { SectionHeader } from '@/src/components/SectionHeader';
import { StatCard } from '@/src/components/StatCard';
import { colors, spacing } from '@/src/constants/theme';
import { getDailyGoalStatus } from '@/src/features/progress/dailyGoals';
import { getMultiplicationSummary, getOverallAccuracy, getPracticeRecommendation } from '@/src/features/progress/progressSummary';
import { useAppData } from '@/src/hooks/useAppData';

export default function HomeScreen() {
  const { loading, profile, progress, settings, refresh } = useAppData();

  if (loading || !profile || !progress || !settings) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  const summary = getMultiplicationSummary(progress, settings.commutativeFacts);
  const dailyGoal = getDailyGoalStatus(settings.dailyGoal, progress);
  const recommendation = getPracticeRecommendation(progress, settings.commutativeFacts);

  return (
    <Screen refreshing={loading} onRefresh={refresh}>
      <SectionHeader
        title={`Hi, ${profile.firstName}!`}
        subtitle="Build confidence with friendly, adaptive math practice and multiplication mastery."
      />

      <View style={styles.row}>
        <StatCard label="Level" value={String(profile.level)} tone="info" />
        <StatCard label="Streak" value={`${progress.currentStreak}`} tone="success" />
      </View>
      <View style={styles.row}>
        <StatCard label="Accuracy" value={`${getOverallAccuracy(progress)}%`} />
        <StatCard label="Mastered Facts" value={`${summary.mastered}/144`} tone="warning" />
      </View>

      <Card>
        <Text style={styles.eyebrow}>Today’s Goal</Text>
        <Text style={styles.goalLabel}>{dailyGoal.label}</Text>
        <Text style={styles.supportingText}>{dailyGoal.progressPercentage}% complete</Text>
      </Card>

      <Card>
        <Text style={styles.eyebrow}>Recommended Practice</Text>
        <Text style={styles.cardTitle}>{recommendation.title}</Text>
        <Text style={styles.supportingText}>{recommendation.description}</Text>
        <PrimaryButton label={recommendation.actionLabel} onPress={() => router.push(recommendation.route)} />
      </Card>

      <Card>
        <Text style={styles.eyebrow}>Recent Multiplication Focus</Text>
        {summary.weakest.length ? (
          summary.weakest.slice(0, 3).map((fact) => (
            <View key={`${fact.factor1}-${fact.factor2}`} style={styles.factRow}>
              <Text style={styles.factText}>{fact.factor1} × {fact.factor2}</Text>
              <MasteryBadge score={fact.masteryScore} />
            </View>
          ))
        ) : (
          <Text style={styles.supportingText}>Start a practice session to see which facts need the most support.</Text>
        )}
      </Card>

      <Card>
        <Text style={styles.eyebrow}>Quick Links</Text>
        <View style={styles.buttonStack}>
          <PrimaryButton label="Start Practice" onPress={() => router.push('/practice')} />
          <PrimaryButton label="Multiplication Tables" variant="secondary" onPress={() => router.push('/multiplication')} />
          <PrimaryButton label="Progress Dashboard" variant="secondary" onPress={() => router.push('/progress')} />
        </View>
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
  eyebrow: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  goalLabel: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  supportingText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
  },
  factRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  factText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  buttonStack: {
    gap: spacing.sm,
  },
});
