import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';

import { Card } from '@/src/components/Card';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Screen } from '@/src/components/Screen';
import { SectionHeader } from '@/src/components/SectionHeader';
import { OPERATION_LABELS } from '@/src/constants/math';
import { colors, spacing } from '@/src/constants/theme';
import { useAppData } from '@/src/hooks/useAppData';
import { MathOperation } from '@/src/types/models';

const FOCUS_OPERATIONS: Exclude<MathOperation, 'mixed'>[] = [
  'addition',
  'subtraction',
  'multiplication',
  'division',
];

export default function SettingsScreen() {
  const { loading, profile, profiles, settings, saveSettings, createProfile, selectProfile } = useAppData();
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [userError, setUserError] = useState<string>();
  const [savingUser, setSavingUser] = useState(false);

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  const handleCreateProfile = async () => {
    setSavingUser(true);
    setUserError(undefined);
    try {
      await createProfile(newUserName);
      setNewUserName('');
      setShowUserSelector(false);
    } catch (createError) {
      setUserError(createError instanceof Error ? createError.message : 'Unable to add a user.');
    } finally {
      setSavingUser(false);
    }
  };

  return (
    <Screen>
      <SectionHeader
        title="Settings"
        subtitle="Adjust multiplication identity rules, daily goals, and comfort options."
      />
      <Card>
        <Text style={styles.title}>User</Text>
        <Text style={styles.text}>
          {profile ? `Using stats for ${profile.firstName}.` : 'Choose a user to start practicing.'}
        </Text>
        <PrimaryButton
          label={showUserSelector ? 'Hide user list' : 'Select a user'}
          variant="secondary"
          onPress={() => setShowUserSelector((current) => !current)}
        />
        {showUserSelector ? (
          <View style={styles.userControls}>
            {profiles.map((availableProfile) => (
              <PrimaryButton
                key={availableProfile.id}
                label={
                  availableProfile.id === profile?.id
                    ? `${availableProfile.firstName} (current)`
                    : availableProfile.firstName
                }
                variant={availableProfile.id === profile?.id ? 'primary' : 'secondary'}
                onPress={() => void selectProfile(availableProfile.id)}
              />
            ))}
            <Text style={styles.addUserLabel}>Add a new user</Text>
            <TextInput
              accessibilityLabel="New user name"
              autoCapitalize="words"
              maxLength={40}
              onChangeText={setNewUserName}
              onSubmitEditing={() => void handleCreateProfile()}
              placeholder="Enter a name"
              placeholderTextColor={colors.textMuted}
              returnKeyType="done"
              style={styles.input}
              value={newUserName}
            />
            {userError ? <Text style={styles.error}>{userError}</Text> : null}
            <PrimaryButton
              disabled={savingUser}
              label={savingUser ? 'Adding...' : 'Add user'}
              onPress={() => void handleCreateProfile()}
            />
          </View>
        ) : null}
      </Card>
      {!profile || !settings ? null : (
        <>
          <Card>
            <Text style={styles.title}>Focus areas</Text>
            <Text style={styles.text}>Choose the types of math that appear on Home.</Text>
            <View style={styles.row}>
              {FOCUS_OPERATIONS.map((operation) => {
                const selected = settings.focusedOperations.includes(operation);
                return (
                  <PrimaryButton
                    key={operation}
                    label={OPERATION_LABELS[operation]}
                    variant={selected ? 'primary' : 'secondary'}
                    onPress={() =>
                      saveSettings({
                        ...settings,
                        focusedOperations: selected
                          ? settings.focusedOperations.filter((item) => item !== operation)
                          : [...settings.focusedOperations, operation],
                      })
                    }
                  />
                );
              })}
            </View>
          </Card>
          <Card>
            <Text style={styles.title}>Multiplication fact identity</Text>
            <Text style={styles.text}>
              Treat matching facts like 7 × 8 and 8 × 7 as the same progress record.
            </Text>
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
        </>
      )}
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
  userControls: {
    gap: spacing.xs,
  },
  addUserLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 10,
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
