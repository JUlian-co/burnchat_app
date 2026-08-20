import {
  Platform,
  Text as RNText,
  useWindowDimensions,
  type TextProps,
} from "react-native";
import { fontSize } from "@/lib/design/tokens";

// Auf iOS ist die Systemschrift San Francisco und fontWeight funktioniert direkt.
// Auf Android muss pro Gewicht die passende Inter-Datei benannt werden, weil
// fontWeight bei geladenen Schriften dort ignoriert wird.
// Warum ueberhaupt Inter: San Francisco darf rechtlich nicht in eine
// Android-App gebuendelt werden, Inter ist metrisch nah dran und frei.
const ANDROID_FAMILY = {
  400: "Inter_400Regular",
  500: "Inter_500Medium",
  600: "Inter_600SemiBold",
  700: "Inter_700Bold",
} as const;

export type FontWeight = keyof typeof ANDROID_FAMILY;

// Groesse und Gewicht gehoeren bei Apple zusammen — deshalb eine Stufe
// benennen statt beides einzeln setzen.
const VARIANTS = {
  largeTitle: ["largeTitle", 700],
  title1: ["title1", 700],
  title2: ["title2", 600],
  title3: ["title3", 600],
  headline: ["headline", 600],
  body: ["body", 400],
  subhead: ["subhead", 400],
  footnote: ["footnote", 400],
  caption: ["caption", 400],
} as const satisfies Record<
  string,
  readonly [keyof typeof fontSize, FontWeight]
>;

export type TextVariant = keyof typeof VARIANTS;

// Auf hellem Grund ist reines Orange als Schrift unlesbar (Kontrast 1.75),
// deshalb greift "accent" auf den gedunkelten Ton zurueck.
// "onFill" ist Schwarz fuer Text auf Orange oder Pastell, "inverse" Weiss
// fuer Text direkt auf Fotos.
const TONES = {
  default: "text-label",
  muted: "text-muted",
  faint: "text-faint",
  accent: "text-accent-strong",
  onFill: "text-on-fill",
  inverse: "text-surface",
} as const;

export type TextTone = keyof typeof TONES;

export type AppTextProps = TextProps & {
  variant?: TextVariant;
  tone?: TextTone;
  weight?: FontWeight;
  className?: string;
};

export function Text({
  variant = "body",
  tone = "default",
  weight,
  className = "",
  style,
  ...props
}: AppTextProps) {
  const [scaleKey, presetWeight] = VARIANTS[variant];
  const [size, lineHeight] = fontSize[scaleKey];
  const finalWeight = weight ?? presetWeight;

  // Dynamic Type: React Native skaliert fontSize automatisch mit der
  // Systemschriftgroesse, lineHeight aber NICHT. Ohne diese Multiplikation
  // ueberlappen die Zeilen, sobald jemand groessere Schrift einstellt.
  const { fontScale } = useWindowDimensions();

  return (
    <RNText
      className={`${TONES[tone]} ${className}`}
      style={[
        { fontSize: size, lineHeight: lineHeight * fontScale },
        Platform.OS === "android"
          ? { fontFamily: ANDROID_FAMILY[finalWeight] }
          : { fontWeight: String(finalWeight) as `${FontWeight}` },
        style,
      ]}
      {...props}
    />
  );
}
