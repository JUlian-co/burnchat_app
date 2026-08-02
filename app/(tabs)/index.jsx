import { CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import { useRef, useState } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { useAuthContext } from "@/hooks/use-auth-context";
import { RefreshCcw } from "lucide-react-native";

export default function CameraScreen() {
  const { profile } = useAuthContext();
  const [facing, setFacing] = useState("front");
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef(null);
  const [picTaken, setPicTaken] = useState(false);
  const [revoked, setRevoked] = useState(false);
  // const [photo, setPhoto] = useState({ uri: null });

  if (!permission) {
    return <SafeAreaView className="flex-1 bg-black" />;
  }

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
    console.log("take pic called");
    const photo = await ref.current?.takePictureAsync();
    if (photo?.uri) {
      console.log("             Foto aufgenommen:", photo.uri);
      // setPhoto(photo);
      setPicTaken(true);

      setTimeout(() => {
        if (revoked) {
          console.log("revokeddd");
          setPicTaken(false);
          return;
        }
        console.log(revoked);
        console.log("not revoked");
        sendPicture(photo);
        setPicTaken(false);
      }, 3000);
    }
    // uploadImage(photo);
  };

  const sendPicture = async (photo) => {
    const photoUrl = await uploadImage(photo);

    console.warn("photourl in sendpic: ", photoUrl);
    const { error } = await supabase
      .from("posts")
      .insert({ user_id: profile.id, image_url: photoUrl });

    if (error) {
      console.error("error sending picture: ", error);
    }

    // setPhoto({ uri: null });
  };

  const uploadImage = async (asset) => {
    const formData = new FormData();
    formData.append("file", {
      uri: asset.uri,
      name: asset.fileName || "profile.jpg",
      type: asset.mimeType || "image/jpeg",
    });

    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(`uploads_${profile.id}_${Date.now()}.jpg`, formData, {
        contentType: asset.mimeType || "image/jpeg",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error.message);

      return null;
    } else {
      console.log("Erfolg!", data);

      const publicUrl = supabase.storage.from("uploads").getPublicUrl(data.path)
        .data.publicUrl;
      console.log(publicUrl);

      return publicUrl;
    }
  };

  const oops = async () => {
    /* TODO: Auch hier ist noch zu viel friction, dieser oops button sollte auch noch auf der kamera seite sein, also das gesamte imagetaken component muss weg */
    setRevoked(true);
  };

  const Camera = () => (
    <>
      {/* Der Container bleibt Tailwind, das klappt super */}
      <View className="w-full aspect-square overflow-hidden bg-neutral-900">
        <CameraView
          style={{ flex: 1 }} // <- Hier wieder klassisch style nutzen!
          ref={ref}
          facing={facing}
          mirror={facing === "front"}
        />
      </View>

      <View className="flex-row justify-around items-center mt-8 w-full px-4">
        <TouchableOpacity
          className="bg-white/20 px-6 py-4 rounded-xl active:bg-white/30"
          onPress={toggleCameraFacing}
        >
          <RefreshCcw size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white/20 px-6 py-4 rounded-xl active:bg-white/30"
          onPress={takePicture}
        >
          <Text className="text-white text-lg font-bold">Bild machen</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const TakenImage = () => (
    <View className="items-center justify-center">
      {/* <Image
        source={{ uri: photo.uri }}
        contentFit="contain"
        style={{ width: 300, aspectRatio: 1 }} // <- Auch hier sicheres Inline-Styling
        className="rounded-lg mb-6"
        onLoad={() => console.log("Bild erfolgreich geladen!")}
        onError={(err) => console.log("Fehler beim Bildladen:", err)}
      /> */}
      <Button onPress={() => setPicTaken(false)} title="Weiteres Bild machen" />
      {/* TODO: Das hier ist scheiße man soll nämlich bilder spamen können */}
      {/* <TouchableOpacity
        className="bg-emerald-400/80 px-6 py-4 rounded-xl active:bg-white/30 mt-4"
        onPress={sendPicture}
      >
        <Text>Senden</Text>
      </TouchableOpacity> */}
      <TouchableOpacity
        className="bg-emerald-400/80 px-6 py-4 rounded-xl active:bg-white/30 mt-4"
        onPress={oops}
      >
        <Text>Oops</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-black justify-center items-center">
      {/* {photo.uri ? <TakenImage /> : <Camera />} */}
      {picTaken ? <TakenImage /> : <Camera />}
    </SafeAreaView>
  );
}
