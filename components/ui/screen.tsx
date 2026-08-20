import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import { useScheme } from "./theme";

export type ScreenProps = {
  children?: ReactNode;
  className?: string;
  edges?: readonly Edge[];
};

// Jeder Screen faengt hier an: Systemhintergrund, passende Statusleiste,
// und die Ecken bleiben frei von Notch und Home-Indicator.
export function Screen({ children, className = "", edges }: ScreenProps) {
  const scheme = useScheme();

  return (
    <>
      {/* Helle Symbole auf dunklem Grund und umgekehrt. */}
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <SafeAreaView edges={edges} className={`flex-1 bg-canvas ${className}`}>
        {children}
      </SafeAreaView>
    </>
  );
}
