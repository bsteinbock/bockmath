import { StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';

import { Card } from '@/src/components/Card';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Screen } from '@/src/components/Screen';
import { SectionHeader } from '@/src/components/SectionHeader';
import { colors } from '@/src/constants/theme';
import { GAME_CONFIGS } from '@/src/features/games/gameConfigs';

export default function GamesScreen() {
  return (
    <Screen>
      <SectionHeader title="Games and challenges" subtitle="Reuse the same math engine and mastery system in fun, time-based practice modes." />
      {GAME_CONFIGS.map((game) => (
        <Card key={game.title}>
          <Text style={styles.title}>{game.title}</Text>
          <Text style={styles.text}>{game.description}</Text>
          <PrimaryButton label="Play" onPress={() => router.push(game.route)} />
        </Card>
      ))}
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
});
