import { Stack, useRouter, useSegments } from "expo-router";
import "react-native-reanimated";
import "./global.css";

import { SplashScreenController } from "@/components/splash-screen-controller";
import { AppTheme } from "@/components/ui";

import { useAuthContext } from "@/hooks/use-auth-context";
import AuthProvider from "@/providers/auth-provider";
import { useEffect } from "react";

function RootNavigator() {
  const { session, isLoading } = useAuthContext();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Der Design-Katalog zeigt nur Farben und Bausteine, redet mit keinem
    // Backend und braucht deshalb keine Anmeldung.
    if (segments[0] === "(design)") return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!session && !inAuthGroup) {
      router.replace("/(auth)");
    } else if (session && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [session, isLoading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(design)" />
    </Stack>
  );
}

export default function RootLayout() {
  // AppTheme statt React Navigations ThemeProvider: der schaltete nur die
  // Navigations-Chrome um, waehrend die Screens hell blieben — bei dunklem
  // Systemmodus sah das zerrissen aus. Jetzt gibt es genau eine Quelle fuer
  // Hell/Dunkel, und die Statusleiste setzt <Screen> selbst.
  return (
    <AuthProvider>
      <AppTheme>
        <SplashScreenController />
        <RootNavigator />
      </AppTheme>
    </AuthProvider>
  );
}
