import { ActivityIndicator } from 'react-native';
import { router } from 'expo-router';

import { Card } from '@/src/components/Card';
import { FactGrid } from '@/src/components/FactGrid';
import { Screen } from '@/src/components/Screen';
import { SectionHeader } from '@/src/components/SectionHeader';
import { colors } from '@/src/constants/theme';
import { useAppData } from '@/src/hooks/useAppData';

export default function MultiplicationFactGridScreen() {
  const { loading, progress, settings } = useAppData();

  if (loading || !progress || !settings) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader title="Fact grid" subtitle="Tap any fact to start focused practice. Symbols show mastery without relying on color alone." />
      <Card>
        <FactGrid
          progressMap={progress.multiplicationFacts}
          commutative={settings.commutativeFacts}
          onSelect={(factor1, factor2) =>
            router.push({
              pathname: '/practice/session',
              params: {
                operation: 'multiplication',
                difficulty: '2',
                questionCount: '10',
                adaptive: 'false',
                factor1: String(factor1),
                factor2: String(factor2),
              },
            })
          }
        />
      </Card>
    </Screen>
  );
}
