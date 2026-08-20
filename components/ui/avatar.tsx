import { Image } from "expo-image";
import { View } from "react-native";
import { Text } from "./text";
import { useColors } from "./theme";

// Die drei Pastelltoene der Palette bekommen hier eine Aufgabe: sie
// unterscheiden Menschen. Immer dieselbe Person, immer dieselbe Farbe.
const TINT_KEYS = ["ice", "sage", "rose", "accent-soft"] as const;

const tintKeyFor = (seed: string) => {
  let sum = 0;
  for (let i = 0; i < seed.length; i += 1) sum += seed.charCodeAt(i);
  return TINT_KEYS[sum % TINT_KEYS.length];
};

export type AvatarProps = {
  uri?: string | null;
  name?: string;
  size?: number;
  className?: string;
};

// Foto vor Initialen vor generischem Icon — Menschen erkennt man am Gesicht.
export function Avatar({
  uri,
  name = "",
  size = 40,
  className = "",
}: AvatarProps) {
  const colors = useColors();

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        contentFit="cover"
        className={className}
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors[tintKeyFor(name)],
      }}
      className={`items-center justify-center ${className}`}
    >
      {/* on-fill statt label: die Pastelltoene sind in beiden Modi hell. */}
      <Text variant="footnote" weight={600} style={{ color: colors["on-fill"] }}>
        {name.trim().slice(0, 2).toUpperCase()}
      </Text>
    </View>
  );
}
