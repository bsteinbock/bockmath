import { StyleSheet, Text, View } from 'react-native';

import { getMasteryLabel } from '@/src/features/math/masteryCalculator';
import { colors, radius } from '@/src/constants/theme';

type MasteryBadgeProps = {
  score: number;
};

function getTone(score: number) {
  if (score >= 95) return { bg: colors.successSoft, text: colors.success, icon: '★' };
  if (score >= 60) return { bg: colors.primarySoft, text: colors.primary, icon: '✓' };
  if (score >= 20) return { bg: colors.warningSoft, text: colors.warning, icon: '•' };
  return { bg: colors.dangerSoft, text: colors.danger, icon: '○' };
}

export function MasteryBadge({ score }: MasteryBadgeProps) {
  const tone = getTone(score);
  return (
    <View style={[styles.badge, { backgroundColor: tone.bg }]}> 
      <Text style={[styles.text, { color: tone.text }]}>{tone.icon} {getMasteryLabel(score)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
