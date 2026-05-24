
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Button,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";

export default function HomeScreen() {
  const [date, setDate] = useState(new Date(2001, 0, 6));
  const [show, setShow] = useState(false);
  const router = useRouter();

  console.log(date);

  const nextStep = () => {
    router.push({ pathname: "/name", params: { date } });
  };

  const handleAnonSignIn = async () => {
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
    
    console.log("authData", authData);
    console.log("auth user id: ", authData.user.id);
    console.log("authError", authError);
    
    if (authError) {
      Alert.alert("Auth Fehler", authError.message);
      return;
    }
  }

  const onChange = (event, selectedDate) => {
    setShow(Platform.OS === "ios"); // iOS bleibt offen, Android schließt nach Auswahl
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center px-4 bg-black">
      
      <TouchableOpacity
        onPress={handleAnonSignIn}
        className="bg-emerald-500 p-4 rounded-2xl w-full"
      >
        <Text className="text-center text-4xl text-white">anmelden</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
