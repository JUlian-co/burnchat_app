import type { ReactNode } from "react";
import { View, type GestureResponderEvent } from "react-native";
import { Button } from "./button";
import { Text } from "./text";

export type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionTitle?: string;
  onAction?: (event: GestureResponderEvent) => void;
};

// Ein leerer Screen ist eine Einladung, kein Fehler: sagen was hier erscheinen
// wird und einen Weg dorthin anbieten.
export function EmptyState({
  icon,
  title,
  description,
  actionTitle,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3 px-8">
      {icon ? <View className="mb-1">{icon}</View> : null}

      <Text variant="title3" className="text-center">
        {title}
      </Text>

      {description ? (
        <Text variant="subhead" tone="muted" className="text-center">
          {description}
        </Text>
      ) : null}

      {actionTitle ? (
        <Button
          title={actionTitle}
          onPress={onAction}
          variant="secondary"
          className="mt-3"
        />
      ) : null}
    </View>
  );
}
