import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/src/components/Card';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Screen } from '@/src/components/Screen';
import { SectionHeader } from '@/src/components/SectionHeader';
import { colors, spacing } from '@/src/constants/theme';
import { useAppData } from '@/src/hooks/useAppData';

export default function SettingsScreen() {
  const { loading, settings, saveSettings } = useAppData();

  if (loading || !settings) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader title="Settings" subtitle="Adjust multiplication identity rules, daily goals, and comfort options." />
      <Card>
        <Text style={styles.title}>Multiplication fact identity</Text>
        <Text style={styles.text}>Treat matching facts like 7 × 8 and 8 × 7 as the same progress record.</Text>
        <PrimaryButton
          label={settings.commutativeFacts ? 'Commutative facts: On' : 'Commutative facts: Off'}
          onPress={() => saveSettings({ ...settings, commutativeFacts: !settings.commutativeFacts })}
        />
      </Card>
      <Card>
        <Text style={styles.title}>Daily goal</Text>
        <View style={styles.row}>
          {[10, 20, 30].map((target) => (
            <PrimaryButton
              key={target}
              label={`${target} questions`}
              variant={settings.dailyGoal.target === target ? 'primary' : 'secondary'}
              onPress={() => saveSettings({ ...settings, dailyGoal: { kind: 'questions', target } })}
              style={styles.goalButton}
            />
          ))}
        </View>
      </Card>
      <Card>
        <Text style={styles.title}>Comfort</Text>
        <Text style={styles.text}>Use calmer feedback and fewer motion effects when needed.</Text>
        <PrimaryButton
          label={settings.reducedMotion ? 'Reduced motion: On' : 'Reduced motion: Off'}
          onPress={() => saveSettings({ ...settings, reducedMotion: !settings.reducedMotion })}
        />
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
    color: colors.textMuted,
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  goalButton: {
    minWidth: 150,
  },
});
