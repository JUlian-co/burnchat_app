import type { ReactNode } from "react";
import { Pressable, View, type GestureResponderEvent } from "react-native";
import { touchTarget } from "@/lib/design/tokens";
import { Text } from "./text";

export type NavBarProps = {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  onLeadingPress?: (event: GestureResponderEvent) => void;
  className?: string;
};

// Apples Navigationsleiste in der grossen Variante: der Titel steht gross
// links im Inhalt, nicht mittig winzig ueber allem. Das ist der Grund, warum
// iOS-Apps oben so viel Luft haben — der Titel gehoert zur Seite.
export function NavBar({
  title,
  subtitle,
  leading,
  trailing,
  onLeadingPress,
  className = "",
}: NavBarProps) {
  return (
    <View className={`gap-2 px-4 pb-3 pt-2 ${className}`}>
      {leading || trailing ? (
        <View
          style={{ minHeight: touchTarget }}
          className="flex-row items-center justify-between"
        >
          {leading ? (
            <Pressable
              onPress={onLeadingPress}
              accessibilityRole="button"
              hitSlop={12}
              className="active:opacity-60"
            >
              {leading}
            </Pressable>
          ) : (
            <View />
          )}
          {trailing}
        </View>
      ) : null}

      <View>
        <Text variant="largeTitle">{title}</Text>
        {subtitle ? (
          <Text variant="subhead" tone="muted">
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
