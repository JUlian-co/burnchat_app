import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { Button, ListGroup, Screen, Text, TextField } from "@/components/ui";
import { supabase } from "@/lib/supabase";

export default function SignUpScreen() {
  const [user, setUser] = useState({ username: null, displayname: null });

  const handleUserChange = (e, type) => {
    setUser({ ...user, [type]: e });
  };

  const handleAnonSignIn = async () => {
    const { data: authData, error: authError } =
      await supabase.auth.signInAnonymously();

    if (!authData?.user.id) {
      Alert.alert("Auth Fehler", "Keine User ID erhalten");
      return;
    }

    if (authError) {
      Alert.alert("Auth Fehler", authError.message);
      return;
    }

    const { error: profileError } = await supabase.from("users").insert({
      id: authData.user.id,
      username: user.username,
      display_name: user.displayname,
    });

    if (profileError) {
      Alert.alert("Profil Fehler", profileError.message);
      return;
    }
  };

  return (
    <Screen>
      {/* Auf iOS schiebt "padding" den Inhalt ueber die Tastatur. Android
          erledigt das ueber adjustResize bereits selbst — ein zweiter
          Mechanismus wuerde dort nur ruckeln. */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerClassName="flex-grow px-4 pb-8"
          // Ohne das verschluckt die erste Beruehrung nur die Tastatur und
          // der Knopf loest nicht aus — der haeufigste Fehler auf Mobil.
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="pb-8 pt-6">
            <Text variant="largeTitle">Dein Name</Text>
          </View>

          <ListGroup footer="Deine Freunde finden dich ueber den Nutzernamen.">
            <TextField
              placeholder="Nutzername"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="username"
              returnKeyType="next"
              maxLength={30}
              showSeparator
              onChangeText={(e) => handleUserChange(e, "username")}
            />
            <TextField
              placeholder="Anzeigename"
              autoCapitalize="words"
              autoComplete="name"
              returnKeyType="done"
              maxLength={50}
              onChangeText={(e) => handleUserChange(e, "displayname")}
              onSubmitEditing={handleAnonSignIn}
            />
          </ListGroup>

          {/* Primaeraktion unten, volle Breite, Kapselform — HIG fuer Formulare. */}
          <View className="flex-1 justify-end pt-8">
            <Button title="Konto erstellen" onPress={handleAnonSignIn} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
