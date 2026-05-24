import { Image } from "expo-image";
import { StyleSheet, Text } from "react-native";

import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import SignOutButton from "@/components/social-auth-buttons/sign-out-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuthContext } from "@/hooks/use-auth-context";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  // const { profile } = useAuthContext();

  return (
    <SafeAreaView>
      <Text className="text-white">Hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii</Text>

      <SignOutButton />
    </SafeAreaView>
  );
}
