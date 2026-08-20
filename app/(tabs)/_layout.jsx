import { Tabs } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { Icon, useColors } from "@/components/ui";

// Apples Leiste misst 49pt. Mit Symbol 24 und Beschriftung darunter reicht
// das in React Native nicht: die Unterlaengen von "g" und "e" wurden unten
// abgeschnitten. 62 ist der gemessene Wert, bei dem die Beschriftung
// vollstaendig steht — am Geraet nachpruefen, dort kommt der Home-Indicator
// als insets.bottom noch hinzu.
const BAR_HEIGHT = 62;

export default function TabLayout() {
  const colors = useColors();
  // Der Home-Indicator kommt UNTER die Leiste, nicht hinein. Setzt man die
  // Hoehe von Hand, muss man den Sicherheitsabstand selbst addieren.
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        // Reines Orange hat auf Weiss Kontrast 1.75 und waere weder als Symbol
        // noch als Schrift erkennbar — deshalb der angepasste Ton, der im
        // Hellen abgedunkelt und im Dunklen aufgehellt ist.
        tabBarActiveTintColor: colors["accent-strong"],
        tabBarInactiveTintColor: colors.faint,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.separator,
          height: BAR_HEIGHT + insets.bottom,
          paddingTop: 6,
          paddingBottom: insets.bottom + 8,
        },
        tabBarLabelStyle: { fontSize: 11, lineHeight: 14 },
      }}
    >
      {/* Apple: Beschriftungen immer zeigen, gefuelltes Symbol fuer den
          aktiven Tab, Umriss fuer die inaktiven. */}
      <Tabs.Screen
        name="posts"
        options={{
          title: "Feed",
          tabBarIcon: ({ color: tint, focused }) => (
            <Icon
              name={focused ? "photos" : "photosOutline"}
              size={24}
              color={tint}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: "Freunde",
          tabBarIcon: ({ color: tint, focused }) => (
            <Icon
              name={focused ? "people" : "peopleOutline"}
              size={24}
              color={tint}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Kamera",
          tabBarIcon: ({ color: tint, focused }) => (
            <Icon
              name={focused ? "camera" : "cameraOutline"}
              size={24}
              color={tint}
            />
          ),
        }}
      />
    </Tabs>
  );
}
