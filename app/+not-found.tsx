import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { Card } from '@/src/components/Card';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Screen } from '@/src/components/Screen';
import { SectionHeader } from '@/src/components/SectionHeader';
import { colors } from '@/src/constants/theme';

export default function NotFoundScreen() {
  return (
    <Screen>
      <SectionHeader title="Page not found" subtitle="Let's head back to a friendly math activity." />
      <Card>
        <Text style={styles.text}>The page you opened is not part of this practice path.</Text>
        <PrimaryButton label="Go home" onPress={() => router.replace('/')} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
});
