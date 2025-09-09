import { AuthProvider } from '@/contexts/AuthContext';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {ToastProvider} from "@/contexts/ToastContext";

export default function RootLayout() {
  const [loaded] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <ToastProvider>
          <Stack screenOptions={{ headerShown: false, animation: 'none', gestureEnabled: false }}>
            <Stack.Screen name="(auth)" options={{ animation: 'none', gestureEnabled: false }} />
            <Stack.Screen name="(app)" options={{ animation: 'none', gestureEnabled: false }} />
            <Stack.Screen name="(routes)" options={{ animation: 'none', gestureEnabled: false }} />
          </Stack>
        </ToastProvider>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
