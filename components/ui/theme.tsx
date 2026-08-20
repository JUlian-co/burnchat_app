import { vars } from "nativewind";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useColorScheme, View } from "react-native";
import { color, palette } from "@/lib/design/tokens";

// Die Namen kommen aus dem Objektliteral in tokens.js — TypeScript liest die
// Datei mit und kennt dadurch die exakten Schluessel. Neue Farbe dort
// eintragen, und die Autovervollstaendigung hier weiss sofort davon.
export type ColorName = keyof typeof palette.light;
export type ColorSet = Record<ColorName, string>;
type Scheme = "light" | "dark";

const ThemeContext = createContext<{ scheme: Scheme; colors: ColorSet }>({
  scheme: "light",
  colors: color.light as ColorSet,
});

/**
 * Farben als JavaScript-Werte — fuer alles, was keine Klassennamen versteht:
 * Symbolfarben, placeholderTextColor, Tab-Leiste, Reanimated.
 */
export const useColors = () => useContext(ThemeContext).colors;

/** "light" | "dark" — fuer Blur-Tint und Statusleiste. */
export const useScheme = () => useContext(ThemeContext).scheme;

// vars() setzt die CSS-Variablen, aus denen tailwind.config.js die Farben
// zusammenbaut. Alles innerhalb dieses Views bekommt sie vererbt — deshalb
// steht er ganz aussen um den Navigator.
const varsFor = (scheme: Scheme) =>
  vars(
    Object.fromEntries(
      Object.entries(palette[scheme]).map(([key, value]) => [
        `--color-${key}`,
        value as string,
      ]),
    ),
  );

const CSS_VARS = { light: varsFor("light"), dark: varsFor("dark") };

export function AppTheme({ children }: { children: ReactNode }) {
  // Folgt der Systemeinstellung des Geraets. app.json steht auf
  // userInterfaceStyle "automatic", deshalb kommt hier der echte Wert an.
  const systemScheme = useColorScheme();
  const scheme: Scheme = systemScheme === "dark" ? "dark" : "light";

  const value = useMemo(
    () => ({ scheme, colors: color[scheme] as ColorSet }),
    [scheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <View style={CSS_VARS[scheme]} className="flex-1 bg-canvas">
        {children}
      </View>
    </ThemeContext.Provider>
  );
}
