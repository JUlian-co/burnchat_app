import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthContext } from "@/hooks/use-auth-context";
import { Button, Text, TouchableOpacity, View } from "react-native";

export default function FriendsScreen() {
    const { friends } = useAuthContext()


    return (
        <SafeAreaView>
            <Text>Friends Screen</Text>


        </SafeAreaView>
    )
}