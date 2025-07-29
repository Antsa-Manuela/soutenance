import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';

export default function RootLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [readyToNavigate, setReadyToNavigate] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      setReadyToNavigate(true);
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const isLoggedIn = false;
    if (readyToNavigate && !isLoggedIn) {
      router.replace('/login');
    }
  }, [readyToNavigate]);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Slot />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
