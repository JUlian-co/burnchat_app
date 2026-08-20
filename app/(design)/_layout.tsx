// Einzeln aus den Unterpfaden importieren, nicht aus dem Paket-Wurzelindex:
// der zieht alle 18 Schnitte ins Bundle, das waeren ~6 MB fuer nichts.
import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_500Medium } from "@expo-google-fonts/inter/500Medium";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { Inter_700Bold } from "@expo-google-fonts/inter/700Bold";
import { useFonts, type FontSource } from "expo-font";
import { Stack } from "expo-router";
import { Platform, View } from "react-native";
import { useColors } from "@/components/ui";
import "../global.css";

// Inter nur auf Android laden: iOS bekommt San Francisco als Systemschrift
// geschenkt, dort waeren die vier Dateien reiner Ballast.
const INTER: Record<string, FontSource> =
  Platform.OS === "android"
    ? { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold }
    : {};

export default function DesignLayout() {
  const colors = useColors();
  const [fontsLoaded] = useFonts(INTER);

  if (!fontsLoaded) {
    return <View className="flex-1 bg-canvas" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.canvas },
      }}
    />
  );
}
