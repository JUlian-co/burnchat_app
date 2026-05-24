import { Stack } from "expo-router";
import "../global.css";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerTitle: "Account erstellen" }}>
      <Stack.Screen name="index" options={{ title: "Username" }} />
    </Stack>
  );
}
