import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
<<<<<<< HEAD
import { Pressable, View } from "react-native";
import {
  Button,
  EmptyState,
  Glass,
  haptics,
  Icon,
  Screen,
  Text,
  useColors,
} from "@/components/ui";
import { useAuthContext } from "@/hooks/use-auth-context";
import { touchTarget } from "@/lib/design/tokens";
=======
import { Button, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RefreshCcw } from "lucide-react-native";
import { useAuthContext } from "@/hooks/use-auth-context";
>>>>>>> origin/main
import { createPost } from "@/lib/posts";

export default function CameraScreen() {
  const { profile, friends } = useAuthContext();
  const [facing, setFacing] = useState("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [picTaken, setPicTaken] = useState(false);
  const [revoked, setRevoked] = useState(false);
  const ref = useRef(null);
<<<<<<< HEAD
  const colors = useColors();

  if (!permission) return <Screen />;
=======

  if (!permission) return <SafeAreaView className="flex-1 bg-black" />;
>>>>>>> origin/main

  if (!permission.granted) {
    return (
      <Screen>
        {/* HIG: den Nutzen erklaeren BEVOR der Systemdialog kommt. */}
        <EmptyState
          icon={<Icon name="camera" size={40} color={colors.muted} />}
          title="Kamera freigeben"
          description="Burnchat braucht die Kamera, um Bilder an deine Freunde zu schicken."
          actionTitle="Kamera erlauben"
          onAction={requestPermission}
        />
      </Screen>
    );
  }

  const toggleCameraFacing = () => {
    haptics.select();
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
<<<<<<< HEAD
    haptics.shutter();
=======
>>>>>>> origin/main
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
<<<<<<< HEAD
        haptics.success();
=======
>>>>>>> origin/main
        setPicTaken(false);
      }, 3000);
    }
  };

<<<<<<< HEAD
  const oops = () => {
    haptics.warning();
    setRevoked(true);
  };

  return (
    <Screen className="justify-between">
      <View className="px-4 pb-2 pt-4">
        <Text variant="largeTitle">Jetzt</Text>
      </View>

      {/* Der Sucher bleibt durchgehend montiert. Ihn beim Ausloesen zu
          ersetzen wuerde die Kamera neu starten — sichtbares Flackern. */}
      <View className="mx-4 aspect-[3/4] overflow-hidden rounded-2xl bg-elevated">
        <CameraView
          style={{ flex: 1 }}
          ref={ref}
          facing={facing}
          mirror={facing === "front"}
        />

        {picTaken ? (
          <Glass
            tint="dark"
            intensity={60}
            className="absolute inset-0 items-center justify-center gap-5 px-8"
          >
            <Text variant="title2" tone="inverse" className="text-center">
              {revoked ? "Abgebrochen" : "Geht raus"}
            </Text>
            {!revoked ? (
              <Button title="Oops" variant="destructive" onPress={oops} />
            ) : null}
          </Glass>
        ) : null}
      </View>

      <View className="flex-row items-center justify-between px-10 pb-4 pt-5">
        <Pressable
          onPress={toggleCameraFacing}
          accessibilityRole="button"
          accessibilityLabel="Kamera wechseln"
          style={{ width: touchTarget, height: touchTarget }}
          className="items-center justify-center rounded-full active:scale-[0.9] active:opacity-60"
        >
          <Icon name="flip" size={24} color={colors.label} />
        </Pressable>

        {/* Der Ausloeser ist die Hauptaktion des Screens, also traegt er die
            Akzentfarbe. Der Innenring in Hintergrundfarbe schneidet den Kreis
            aus und macht ihn als Kamera-Knopf lesbar. */}
        <Pressable
          onPress={takePicture}
          disabled={picTaken}
          accessibilityRole="button"
          accessibilityLabel="Bild aufnehmen"
          style={{ width: 76, height: 76, opacity: picTaken ? 0.4 : 1 }}
          className="items-center justify-center rounded-full bg-accent active:scale-[0.94]"
        >
          <View className="size-16 rounded-full border-4 border-canvas" />
        </Pressable>

        <View style={{ width: touchTarget }} />
      </View>
    </Screen>
=======
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
>>>>>>> origin/main
  );
}
