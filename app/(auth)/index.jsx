
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
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
  const [user, setUser] = useState({ username: null, displayname: null})
  const router = useRouter();

  console.log(user);

 /*  const nextStep = () => {
    router.push({ pathname: "/name", params: { nig: "hi" } });
  }; */

  const handleUserChange = (e, type) => {
    setUser({ ...user, [type]: e });
  }

  const handleAnonSignIn = async () => {
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
    
    console.warn("authData", authData);

    if (!authData?.user.id) {
      Alert.alert("Auth Fehler", "Keine User ID erhalten");
      return;
    }
    console.log("auth user id: ", authData.user.id);
    console.log("authError", authError);
    
    if (authError) {
      Alert.alert("Auth Fehler", authError.message);
      return;
    }


    const { /* data: profileData, */ error: profileError } = await supabase
      .from("users")
      .insert({
        id: authData.user.id,
        username: user.username,
        display_name: user.displayname,
      })
      /* .select()
      .single(); */

    // console.log("profileData", profileData);
    console.log("profileError", profileError);

    if (profileError) {
      Alert.alert("Profil Fehler", profileError.message);
      return;
    }

    // nextStep();
  }


  return (
    <SafeAreaView className="flex-1 justify-center items-center px-4 bg-black">

        <TextInput placeholder="Nutzername" placeholderTextColor="#888" className="bg-gray-800 text-white p-4 rounded-2xl w-full mb-4" onChangeText={(e) => handleUserChange(e, "username")}/>
        <TextInput placeholder="Anzeigename" placeholderTextColor="#888" className="bg-gray-800 text-white p-4 rounded-2xl w-full mb-4" onChangeText={(e) => handleUserChange(e, "displayname")}/>
        {/* TODO: profilbild */}
      
      <TouchableOpacity
        onPress={handleAnonSignIn}
        className="bg-emerald-500 p-4 rounded-2xl w-full"
      >
        <Text className="text-center text-4xl text-white">anmelden</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
