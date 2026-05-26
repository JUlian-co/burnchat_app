import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Camera, Images } from 'lucide-react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => <Images size={28} name="house.fill" color={color} />,
        }}
        />
      <Tabs.Screen
        name="photo"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => <Camera size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
