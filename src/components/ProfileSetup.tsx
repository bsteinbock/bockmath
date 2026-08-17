import { useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';

import { Card } from '@/src/components/Card';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Screen } from '@/src/components/Screen';
import { SectionHeader } from '@/src/components/SectionHeader';
import { colors, radius, spacing } from '@/src/constants/theme';

type ProfileSetupProps = {
  onCreateProfile: (firstName: string) => Promise<void>;
};

export function ProfileSetup({ onCreateProfile }: ProfileSetupProps) {
  const [firstName, setFirstName] = useState('');
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  const handleCreateProfile = async () => {
    setSaving(true);
    setError(undefined);
    try {
      await onCreateProfile(firstName);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Unable to create a user.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <SectionHeader title="Welcome!" subtitle="What should we call you?" />
      <Card>
        <Text style={styles.title}>Your name</Text>
        <TextInput
          accessibilityLabel="Your name"
          autoCapitalize="words"
          autoFocus
          maxLength={40}
          onChangeText={setFirstName}
          onSubmitEditing={() => void handleCreateProfile()}
          placeholder="Enter your name"
          placeholderTextColor={colors.textMuted}
          returnKeyType="done"
          style={styles.input}
          value={firstName}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton
          disabled={saving}
          label={saving ? 'Creating...' : 'Let’s go!'}
          onPress={() => void handleCreateProfile()}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: 18,
    minHeight: 52,
    paddingHorizontal: spacing.sm,
  },
  error: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: '600',
  },
});
