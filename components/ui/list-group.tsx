import type { ReactNode } from "react";
import { View } from "react-native";
import { Text } from "./text";

export type ListGroupProps = {
  header?: string;
  footer?: string;
  children: ReactNode;
  className?: string;
};

// Apples gruppierte Liste — der Baustein, aus dem Einstellungen, Kontakte und
// jedes iOS-Formular bestehen: weisse Zeilen auf grauem Grund, Radius 12,
// KEIN Schatten. Ein Schatten macht daraus eine Karte, und Karten sind bei
// Apple fuer Inhalt da, nicht fuer Listen. Genau daran erkennt man den
// Unterschied zwischen "sieht nach iOS aus" und "ist iOS".
export function ListGroup({
  header,
  footer,
  children,
  className = "",
}: ListGroupProps) {
  return (
    <View className={`gap-2 ${className}`}>
      {header ? (
        <Text variant="footnote" tone="muted" className="px-4 uppercase">
          {header}
        </Text>
      ) : null}

      <View className="overflow-hidden rounded-xl bg-surface">{children}</View>

      {footer ? (
        <Text variant="footnote" tone="muted" className="px-4">
          {footer}
        </Text>
      ) : null}
    </View>
  );
}
