import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RefreshCcw } from "lucide-react-native";
import { useAuthContext } from "@/hooks/use-auth-context";
import { createPost } from "@/lib/posts";

export default function CameraScreen() {
  const { profile, friends } = useAuthContext();
  const [facing, setFacing] = useState("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [picTaken, setPicTaken] = useState(false);
  const [revoked, setRevoked] = useState(false);
  const ref = useRef(null);

  if (!permission) return <SafeAreaView className="flex-1 bg-black" />;

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center items-center p-4">
        <Text className="text-white text-center mb-4">
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    if (photo?.uri) {
      setPicTaken(true);

      // 3 Sekunden Widerrufs-Fenster (Oops Button)
      setTimeout(async () => {
        if (revoked) {
          setPicTaken(false);
          setRevoked(false);
          return;
        }

        // Bild hochladen & Post in DB erstellen
        await createPost(profile.id, photo, friends);
        setPicTaken(false);
      }, 3000);
    }
  };

  const oops = () => setRevoked(true);

  return (
    <SafeAreaView className="flex-1 bg-black justify-center items-center">
      {picTaken ? (
        <View className="items-center justify-center">
          <Button
            onPress={() => setPicTaken(false)}
            title="Weiteres Bild machen"
          />
          <TouchableOpacity
            className="bg-emerald-400/80 px-6 py-4 rounded-xl mt-4"
            onPress={oops}
          >
            <Text className="font-bold">Oops (Abbrechen)</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View className="w-full aspect-square overflow-hidden bg-neutral-900">
            <CameraView
              style={{ flex: 1 }}
              ref={ref}
              facing={facing}
              mirror={facing === "front"}
            />
          </View>

          <View className="flex-row justify-around items-center mt-8 w-full px-4">
            <TouchableOpacity
              className="bg-white/20 px-6 py-4 rounded-xl"
              onPress={toggleCameraFacing}
            >
              <RefreshCcw size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white/20 px-6 py-4 rounded-xl"
              onPress={takePicture}
            >
              <Text className="text-white text-lg font-bold">Bild machen</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
