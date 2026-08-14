import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/src/constants/theme';

type StatCardProps = {
  label: string;
  value: string;
  tone?: 'default' | 'success' | 'warning' | 'info';
};

const toneStyles = {
  default: { backgroundColor: colors.surfaceMuted, textColor: colors.text },
  success: { backgroundColor: colors.successSoft, textColor: colors.success },
  warning: { backgroundColor: colors.warningSoft, textColor: colors.warning },
  info: { backgroundColor: colors.infoSoft, textColor: colors.info },
};

export function StatCard({ label, value, tone = 'default' }: StatCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: toneStyles[tone].backgroundColor }]}> 
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: toneStyles[tone].textColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
    borderRadius: 18,
    padding: spacing.md,
    gap: 6,
  },
  label: {
    fontSize: 13,
    color: colors.textMuted,
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
  },
});
