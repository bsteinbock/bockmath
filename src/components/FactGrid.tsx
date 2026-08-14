import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { TABLE_NUMBERS } from '@/src/constants/math';
import { colors, radius } from '@/src/constants/theme';
import { createFactProgress } from '@/src/features/progress/progressSummary';
import { MultiplicationFactProgress } from '@/src/types/models';

type FactGridProps = {
  progressMap: Record<string, MultiplicationFactProgress>;
  commutative: boolean;
  onSelect?: (factor1: number, factor2: number) => void;
};

function getCellColors(score: number) {
  if (score >= 95) return { backgroundColor: colors.successSoft, borderColor: colors.success, symbol: '★' };
  if (score >= 60) return { backgroundColor: colors.primarySoft, borderColor: colors.primary, symbol: '✓' };
  if (score >= 20) return { backgroundColor: colors.warningSoft, borderColor: colors.warning, symbol: '•' };
  return { backgroundColor: colors.surface, borderColor: colors.border, symbol: '○' };
}

export function FactGrid({ progressMap, commutative, onSelect }: FactGridProps) {
  const { width } = useWindowDimensions();
  const cellSize = width > 820 ? 58 : width > 500 ? 48 : 36;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, { width: cellSize }]}>×</Text>
        {TABLE_NUMBERS.map((table) => (
          <Text key={`col-${table}`} style={[styles.headerCell, { width: cellSize }]}>{table}</Text>
        ))}
      </View>
      {TABLE_NUMBERS.map((factor1) => (
        <View key={`row-${factor1}`} style={styles.row}>
          <Text style={[styles.headerCell, { width: cellSize }]}>{factor1}</Text>
          {TABLE_NUMBERS.map((factor2) => {
            const fact = createFactProgress({ factor1, factor2 }, progressMap, commutative);
            const tone = getCellColors(fact.masteryScore);
            return (
              <Pressable
                key={`${factor1}-${factor2}`}
                accessibilityRole="button"
                accessibilityLabel={`Practice ${factor1} times ${factor2}`}
                onPress={() => onSelect?.(factor1, factor2)}
                style={[styles.cell, tone, { width: cellSize, height: cellSize }]}>
                <Text style={styles.symbol}>{tone.symbol}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  headerCell: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  cell: {
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
});
