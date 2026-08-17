import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/src/components/PrimaryButton';
import { colors } from '@/src/constants/theme';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  userName?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
};

export function SectionHeader({ title, subtitle, userName, action }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        {userName ? (
          <View accessibilityLabel={`Current user: ${userName}`} style={styles.userBadge}>
            <Text style={styles.userBadgeText}>{userName}</Text>
          </View>
        ) : null}
        {action ? (
          <PrimaryButton
            label={action.label}
            onPress={action.onPress}
            style={styles.actionButton}
            variant="secondary"
          />
        ) : null}
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    flexShrink: 1,
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 22,
  },
  actionButton: {
    minHeight: 44,
  },
  userBadge: {
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    maxWidth: 120,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  userBadgeText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
});
