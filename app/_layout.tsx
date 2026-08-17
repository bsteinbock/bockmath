import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { colors } from '@/src/constants/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="practice/session" options={{ title: 'Practice Session' }} />
        <Stack.Screen name="practice/results" options={{ title: 'Session Results' }} />
        <Stack.Screen name="multiplication/index" options={{ title: 'Multiplication' }} />
        <Stack.Screen name="multiplication/tables" options={{ title: 'Tables' }} />
        <Stack.Screen name="multiplication/fact-grid" options={{ title: 'Fact Grid' }} />
        <Stack.Screen name="games/index" options={{ title: 'Games' }} />
        <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
