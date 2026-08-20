import { View } from "react-native";
import { Icon, type IconName } from "./icon";
import { Text } from "./text";
import { useColors } from "./theme";

// Die farbigen Fuellungen sind in BEIDEN Modi hell — deshalb ist ihre Schrift
// immer schwarz, nicht "label". Sonst waere sie im Dunkelmodus weiss auf
// hellem Orange. Nur "quiet" folgt dem Modus, weil es die Systemflaeche nutzt.
const TONES = {
  accent: { box: "bg-accent", onFill: true }, // Streak
  sage: { box: "bg-sage", onFill: true }, // bestaetigt
  ice: { box: "bg-ice", onFill: true }, // neutral, informativ
  rose: { box: "bg-rose", onFill: true }, // verbrannt, vorbei
  quiet: { box: "bg-elevated", onFill: false }, // ohne Aussage
} as const;

export type ChipTone = keyof typeof TONES;

export type ChipProps = {
  label: string;
  /** Symbolname statt fertiges Element — so faerbt die Pille es korrekt ein. */
  icon?: IconName;
  tone?: ChipTone;
  className?: string;
};

export function Chip({
  label,
  icon,
  tone = "quiet",
  className = "",
}: ChipProps) {
  const colors = useColors();
  const { box, onFill } = TONES[tone];
  const foreground = onFill ? colors["on-fill"] : colors.label;

  return (
    <View
      className={`flex-row items-center gap-1 rounded-full px-2.5 py-1 ${box} ${className}`}
    >
      {icon ? <Icon name={icon} size={13} color={foreground} /> : null}
      <Text variant="footnote" weight={600} style={{ color: foreground }}>
        {label}
      </Text>
    </View>
  );
}
