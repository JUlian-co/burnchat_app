import { Image } from "expo-image";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import SignOutButton from "@/components/social-auth-buttons/sign-out-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuthContext } from "@/hooks/use-auth-context";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, Search, X } from "lucide-react-native";
import {supabase} from "@/lib/supabase"
import { useState } from "react";

export default function HomeScreen() {
  const { profile } = useAuthContext();
  const [users, setUsers] = useState([])
  const [showUsers, setShowUsers] = useState(false)

  const searchUsers = async (name) => {
    if (name.trim === "") {
      return;
    }

    // TODO: Wir sollten noch machen dass man sich selbst keine freundschaftsanfrage schicken kann
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('username', `%${name}%`); // TODO: Limit hinzufügen


    if (error) {
      console.error('Error fetching users:', error);
    } else {
      console.log('Fetched users:', data);

      const filteredData = data.filter((u) => u.id !== profile.id); // Filter out the current user

      setUsers(filteredData)
    }
  }

  const requestFriend = async (friendId) => {
    console.log("Requesting friendship with user ID:", friendId);

    // TODO: das select statement einbauen um zu schauen ob die nicht schon befreundet sind
    const { error} = await supabase.from("friendships").insert({ user_id: profile.id, friend_id: friendId, status: "accepted"}) // TODO: Status auf pending

    if (error) {
      console.error("Error sending friend request: ", error);

      if (error.code === "23505") { // Unique violation
        console.log("friend req already exists")
      }
    } else {
      console.log("Friend request sent successfully");
    }
  }

  return (
    <SafeAreaView>

      <View className="flex flex-row items-center w-full">
        <TouchableOpacity onPress={() => setShowUsers((prev) => !prev)} className="flex-row items-center justify-center bg-gray-400 size-14">
          {showUsers ? <X /> : <Search size={28} />}
        </TouchableOpacity>

        {showUsers && <TextInput placeholder="Freunde finden..." className="border border-gray-300 p-2 w-full h-full text-white" onChangeText={(e) => searchUsers(e)}/>}
      </View>

      {showUsers && (
        <>
          {users.map((u) => (
            <View key={u.id} className="px-4 py-2 border-b border-gray-300 flex-row items-center justify-between w-full">
            <Text className="text-lg font-bold text-white">@{u.username} ({u.display_name})</Text>
            
            <TouchableOpacity className="p-4"><Plus size={16} color={"#fff"} onPress={() => requestFriend(u.id)} /></TouchableOpacity>
            </View>
          ))}
        </>
      )}


      <Text className="text-white">Hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii</Text>

      <SignOutButton />
    </SafeAreaView>
  );
}
