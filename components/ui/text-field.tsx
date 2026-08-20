import { TextInput, View, type TextInputProps } from "react-native";
import { touchTarget } from "@/lib/design/tokens";
import { useColors } from "./theme";

export type TextFieldProps = TextInputProps & {
  /**
   * "row" ist eine Zeile innerhalb einer ListGroup — Apples Formularfeld.
   * "filled" ist das graue Suchfeld, das allein auf einer Flaeche steht.
   */
  variant?: "row" | "filled";
  showSeparator?: boolean;
  className?: string;
};

// Kein eigenes Label ueber dem Feld: bei Apple IST der Platzhalter die
// Beschriftung, und die Erklaerung steht als Fussnote unter der ganzen
// Gruppe. Ein Label plus Platzhalter plus Hinweis pro Feld ergibt drei
// Textzeilen fuer eine Eingabe — genau die Textflut, die iOS vermeidet.
export function TextField({
  variant = "row",
  showSeparator = false,
  className = "",
  ...props
}: TextFieldProps) {
  const colors = useColors();

  const input = (
    <TextInput
      placeholderTextColor={colors.faint}
      style={{ minHeight: touchTarget, fontSize: 17 }}
      className={
        variant === "row"
          ? "px-4 text-label web:outline-none"
          : "rounded-xl bg-elevated px-4 text-label web:outline-none"
      }
      {...props}
    />
  );

  if (variant === "filled") {
    return <View className={className}>{input}</View>;
  }

  return (
    <View className={`bg-surface ${className}`}>
      {input}
      {showSeparator ? (
        <View className="ml-4 h-px bg-separator" />
      ) : null}
    </View>
  );
}
