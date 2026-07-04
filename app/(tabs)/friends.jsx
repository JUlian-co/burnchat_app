import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthContext } from "@/hooks/use-auth-context";
import { Button, Text, TouchableOpacity, View } from "react-native";

export default function FriendsScreen() {
  const { friends } = useAuthContext();

  return (
    <SafeAreaView>
      <Text>Friends Screen</Text>

      {friends?.map((f) => (
        <View key={f.id} className="flex-row items-center space-x-4 py-2">
          <Text className="text-lg font-bold text-white">{f.displayname || f.username}</Text>
        </View>
      ))}
    </SafeAreaView>
  );
}
