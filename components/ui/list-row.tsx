import type { ReactNode } from "react";
import { Pressable, View, type GestureResponderEvent } from "react-native";
import { touchTarget } from "@/lib/design/tokens";
import { haptics } from "./haptics";
import { Text } from "./text";

export type ListRowProps = {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  showSeparator?: boolean;
  className?: string;
};

// Apples Listenzeile: mindestens 44pt hoch, Trennlinie beginnt erst hinter
// dem fuehrenden Element — dadurch entsteht die vertikale Textkante, an der
// das Auge die Liste entlanglaeuft.
export function ListRow({
  title,
  subtitle,
  leading,
  trailing,
  onPress,
  showSeparator = true,
  className = "",
}: ListRowProps) {
  // Ohne onPress ein View statt Pressable, sonst meldet der Screenreader
  // jede Zeile als Knopf, obwohl nichts passiert.
  const Container = onPress ? Pressable : View;

  const handlePress = onPress
    ? (event: GestureResponderEvent) => {
        haptics.select();
        onPress(event);
      }
    : undefined;

  return (
    <Container
      onPress={handlePress}
      accessibilityRole={onPress ? "button" : undefined}
      style={{ minHeight: touchTarget }}
      className={`flex-row items-center gap-3 bg-surface px-4 ${onPress ? "active:bg-elevated" : ""} ${className}`}
    >
      {leading}

      <View
        className={`flex-1 flex-row items-center justify-between gap-3 py-3 ${
          showSeparator ? "border-b border-separator" : ""
        }`}
      >
        <View className="flex-1">
          <Text variant="body">{title}</Text>
          {subtitle ? (
            <Text variant="footnote" tone="muted">
              {subtitle}
            </Text>
          ) : null}
        </View>

        {trailing}
      </View>
    </Container>
  );
}
