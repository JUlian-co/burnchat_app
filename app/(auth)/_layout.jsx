import { Stack } from "expo-router";
import "../global.css";

// Kein Systemheader: der Titel gehoert bei Apple in die Seite hinein
// (grosse Ueberschrift), nicht in eine graue Leiste darueber.
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
