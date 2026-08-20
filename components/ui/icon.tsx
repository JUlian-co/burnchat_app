import { SymbolView, type SFSymbol } from "expo-symbols";
import {
  Camera,
  Check,
  Flame,
  Images,
  Plus,
  RefreshCcw,
  Search,
  UserPlus,
  Users,
  X,
  type LucideIcon,
} from "lucide-react-native";
import { Platform } from "react-native";

// Auf iOS die echten SF Symbols — sie sind metrisch auf San Francisco
// abgestimmt und der Hauptgrund, warum eine App "nativ" wirkt.
// Auf Android gibt es sie nicht, dort tritt Lucide ein.
const ICONS = {
  flame: { sf: "flame.fill", fallback: Flame },
  flameOutline: { sf: "flame", fallback: Flame },
  search: { sf: "magnifyingglass", fallback: Search },
  close: { sf: "xmark", fallback: X },
  add: { sf: "plus", fallback: Plus },
  check: { sf: "checkmark", fallback: Check },
  camera: { sf: "camera.fill", fallback: Camera },
  cameraOutline: { sf: "camera", fallback: Camera },
  flip: { sf: "arrow.triangle.2.circlepath", fallback: RefreshCcw },
  people: { sf: "person.2.fill", fallback: Users },
  peopleOutline: { sf: "person.2", fallback: Users },
  photos: { sf: "square.stack.fill", fallback: Images },
  photosOutline: { sf: "square.stack", fallback: Images },
  personAdd: { sf: "person.badge.plus", fallback: UserPlus },
} as const satisfies Record<string, { sf: SFSymbol; fallback: LucideIcon }>;

export type IconName = keyof typeof ICONS;

export type IconProps = {
  name: IconName;
  size?: number;
  color: string;
  weight?: "regular" | "medium" | "semibold" | "bold";
};

export function Icon({
  name,
  size = 20,
  color,
  weight = "semibold",
}: IconProps) {
  const { sf, fallback: Fallback } = ICONS[name];

  if (Platform.OS === "ios") {
    return (
      <SymbolView
        name={sf}
        size={size}
        weight={weight}
        tintColor={color}
        resizeMode="scaleAspectFit"
        style={{ width: size, height: size }}
      />
    );
  }

  return <Fallback size={size} color={color} strokeWidth={2.25} />;
}
