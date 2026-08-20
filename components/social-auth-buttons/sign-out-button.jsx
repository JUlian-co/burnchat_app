import { Button } from "@/components/ui";
import { supabase } from "@/lib/supabase";

async function onSignOutButtonPress() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error);
  }
}

export default function SignOutButton() {
  return (
    <Button title="Abmelden" variant="ghost" onPress={onSignOutButtonPress} />
  );
}
