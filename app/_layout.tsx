import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePetStore } from '@/store/usePetStore';
import { preloadSounds } from '@/utils/audio';

export const unstable_settings = {
  anchor: 'setup',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  const segments = useSegments();
  const router = useRouter();
  const { hasConfigured } = usePetStore();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    preloadSounds().then(() => setIsReady(true));
  }, []);

  useEffect(() => {
    if (!isReady || !segments.length) return;

    const inSetupGroup = segments[0] === 'setup';

    setTimeout(() => {
      if (!hasConfigured && !inSetupGroup) {
        router.replace('/setup');
      } else if (hasConfigured && inSetupGroup) {
        router.replace('/(tabs)');
      }
    }, 0);
  }, [hasConfigured, segments, isReady]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="setup" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(game)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
