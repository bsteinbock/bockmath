import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/src/constants/theme';

type NumericKeypadProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  compact?: boolean;
};

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['Clear', '0', '⌫'],
];

export function NumericKeypad({
  value,
  onChange,
  onSubmit,
  disabled = false,
  compact = false,
}: NumericKeypadProps) {
  const handlePress = (key: string) => {
    if (disabled) {
      return;
    }

    if (key === 'Clear') {
      onChange('');
      return;
    }

    if (key === '⌫') {
      onChange(value.slice(0, -1));
      return;
    }

    onChange(`${value}${key}`);
  };

  return (
    <View style={styles.wrapper}>
      {KEYS.map((row) => (
        <View key={row.join('-')} style={styles.row}>
          {row.map((key) => (
            <Pressable
              key={key}
              accessibilityRole="button"
              accessibilityLabel={key === '⌫' ? 'Backspace' : key}
              onPress={() => handlePress(key)}
              style={({ pressed }) => [
                styles.key,
                compact ? styles.compactKey : null,
                pressed ? styles.pressed : null,
                disabled ? styles.disabled : null,
              ]}
            >
              <Text style={styles.keyLabel}>{key}</Text>
            </Pressable>
          ))}
        </View>
      ))}
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={onSubmit}
        style={({ pressed }) => [
          styles.submit,
          compact ? styles.compactSubmit : null,
          pressed ? styles.pressed : null,
          disabled ? styles.disabled : null,
        ]}
      >
        <Text style={styles.submitLabel}>Submit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  key: {
    flex: 1,
    minHeight: 68,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactKey: {
    minHeight: 52,
  },
  keyLabel: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  submit: {
    minHeight: 58,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactSubmit: {
    minHeight: 50,
  },
  submitLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
});
