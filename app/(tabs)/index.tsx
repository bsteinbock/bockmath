import { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { Card } from '@/src/components/Card';
import { ProfileSetup } from '@/src/components/ProfileSetup';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Screen } from '@/src/components/Screen';
import { SectionHeader } from '@/src/components/SectionHeader';
import { OPERATION_LABELS, SYMBOL_BY_OPERATION } from '@/src/constants/math';
import { colors } from '@/src/constants/theme';
import { useAppData } from '@/src/hooks/useAppData';
import { MathOperation } from '@/src/types/models';

export default function HomeScreen() {
  const { loading, profile, settings, createProfile, refresh } = useAppData();

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  if (!profile) {
    return <ProfileSetup onCreateProfile={createProfile} />;
  }

  if (!settings) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  const operations = settings.focusedOperations;

  return (
    <Screen>
      <SectionHeader title={`Hi, ${profile.firstName}!`} subtitle="What would you like to practice today?" />
      {operations.map((operation) => (
        <Card key={operation} style={styles.operationCard}>
          <Text style={styles.symbol}>{SYMBOL_BY_OPERATION[operation]}</Text>
          <PrimaryButton
            label={`Practice ${OPERATION_LABELS[operation]}`}
            onPress={() =>
              router.navigate({
                pathname: '/practice',
                params: {
                  operation,
                  difficulty: operation === 'multiplication' || operation === 'division' ? '2' : '1',
                  questionCount: '12',
                  adaptive: operation === 'multiplication' ? 'true' : 'false',
                },
              })
            }
          />
        </Card>
      ))}
      {!operations.length ? (
        <Card>
          <Text style={styles.title}>Choose your focus</Text>
          <Text style={styles.description}>Pick at least one math area in Settings to start practicing.</Text>
          <PrimaryButton label="Open Settings" onPress={() => router.navigate('/settings-tab')} />
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  operationCard: { alignItems: 'center' },
  symbol: { color: colors.primary, fontSize: 40, fontWeight: '800' },
  title: { color: colors.text, fontSize: 22, fontWeight: '800', textAlign: 'center' },
  description: { color: colors.textMuted, fontSize: 16, lineHeight: 22, textAlign: 'center' },
});
