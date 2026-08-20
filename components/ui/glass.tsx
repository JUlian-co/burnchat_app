import { BlurView } from "expo-blur";
import type { ReactNode } from "react";
import { View } from "react-native";
import { useScheme } from "./theme";

export type GlassProps = {
  children: ReactNode;
  intensity?: number;
  /**
   * Ohne Angabe folgt der Tint dem Systemmodus. Explizit "dark" setzen, wenn
   * die Leiste auf einem Foto liegt — dort ist der Untergrund immer dunkel,
   * egal welchen Modus das Geraet hat.
   */
  tint?: "light" | "dark";
  className?: string;
};

// Apples Materialien: eine Leiste ueber Inhalt ist nie deckend, sie laesst
// durchscheinen was darunter liegt. Das erzeugt die Tiefe, ohne Schatten.
//
// Die getoente Flaeche darunter ist Absicht: kann eine Plattform nicht
// blurren, bleibt eine ruhige Flaeche statt eines durchsichtigen Lochs.
export function Glass({
  children,
  intensity = 40,
  tint,
  className = "",
}: GlassProps) {
  const scheme = useScheme();
  const effectiveTint = tint ?? scheme;

  return (
    <View className={`overflow-hidden ${className}`}>
      <View
        className={`absolute inset-0 ${
          effectiveTint === "dark" ? "bg-black/40" : "bg-surface/70"
        }`}
      />
      <BlurView
        intensity={intensity}
        tint={effectiveTint}
        className="absolute inset-0"
      />
      {children}
    </View>
  );
}
