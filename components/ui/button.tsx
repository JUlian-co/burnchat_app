import type { ReactNode } from "react";
import {
  Pressable,
  View,
  type GestureResponderEvent,
  type PressableProps,
} from "react-native";
import { touchTarget } from "@/lib/design/tokens";
import { haptics } from "./haptics";
import { Text, type TextTone } from "./text";

// Apple-Buttons sind Kapseln. Die Fuellung traegt die Wichtigkeit,
// nicht die Groesse — deshalb haben alle Varianten dieselbe Hoehe.
const VARIANTS = {
  primary: { box: "bg-accent", tone: "onFill" }, // Schwarz auf Orange, 11:1
  secondary: { box: "bg-accent-soft", tone: "accent" },
  ghost: { box: "bg-transparent", tone: "accent" },
  destructive: { box: "bg-rose", tone: "onFill" }, // Schwarz auf Rose, 6.8:1
} as const satisfies Record<string, { box: string; tone: TextTone }>;

export type ButtonVariant = keyof typeof VARIANTS;

export type ButtonProps = Omit<PressableProps, "children" | "style"> & {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
};

export function Button({
  title,
  onPress,
  variant = "primary",
  icon,
  disabled = false,
  className = "",
  ...props
}: ButtonProps) {
  const { box, tone } = VARIANTS[variant];

  const handlePress = (event: GestureResponderEvent) => {
    haptics.tap();
    onPress?.(event);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      // 44pt ist Apples Minimum fuer alles Antippbare.
      style={{ minHeight: touchTarget, opacity: disabled ? 0.4 : 1 }}
      // scale(0.97) beim Druecken ist Apples Standard-Rueckmeldung.
      className={`flex-row items-center justify-center gap-2 rounded-full px-6 active:scale-[0.97] active:opacity-80 ${box} ${className}`}
      {...props}
    >
      {icon ? <View>{icon}</View> : null}
      <Text variant="headline" tone={tone}>
        {title}
      </Text>
    </Pressable>
  );
}
