import type { ReactNode } from "react";
import { View } from "react-native";
import { useScheme } from "./theme";

export type CardProps = {
  children: ReactNode;
  className?: string;
};

// Im Hellen braucht eine weisse Karte einen weichen Schatten, sonst
// verschwimmt ihre Kante mit dem Hintergrund. Im Dunklen waere ein Schatten
// unsichtbar — dort erzeugt Apple Tiefe stattdessen ueber eine hellere
// Flaeche, und genau das macht bg-surface bereits.
const lightShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 2, // Android kennt die shadow*-Werte nicht
};

// Konzentrik-Regel: aussen 24 (rounded-2xl) minus 16 Innenabstand (p-4)
// ergibt 8 fuer den Inhalt darin. Nur so laufen die Rundungen parallel.
export function Card({ children, className = "" }: CardProps) {
  const scheme = useScheme();

  return (
    <View
      style={scheme === "light" ? lightShadow : undefined}
      className={`rounded-2xl bg-surface p-4 ${className}`}
    >
      {children}
    </View>
  );
}
