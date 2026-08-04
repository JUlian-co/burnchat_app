import { Image } from "expo-image";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import SignOutButton from "@/components/social-auth-buttons/sign-out-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuthContext } from "@/hooks/use-auth-context";
import { SafeAreaView } from "react-native-safe-area-context";
import { Check, Plus, Search, X } from "lucide-react-native";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function HomeScreen() {
  const { profile, friends } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [pictures, setPictures] = useState([]);

  // 1. Alle Posts von freunden von Server holen
  const fetchRawPosts = async () => {
    console.log("               fetching raw posts for friends: ", friends);

    const friendIds = (friends ?? []).map((f) => f.id);

    if (friendIds.length === 0) {
      console.log("du hast keine freunde");
      return [];
    }

    console.log("90876890ß98765 FREUNDEEEEE: ", friends);

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .in("user_id", friendIds)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts: ", error);
      return [];
    }

    console.log("raw ", data);
    return data || [];
  };

  // 2. User-Details für einen einzelnen Post nachladen
  const attachUserDataToPost = async (post) => {
    const { data, error } = await supabase
      .from("users")
      .select("username, display_name")
      .eq("id", post.user_id)
      .single();

    if (error) {
      console.error("Error fetching user for post: ", error);
      return null;
    }
    return {
      ...post,
      username: data.username,
      displayName: data.display_name,
    };
  };

  // 3. Prüfen, ob ein bestimmter User einen Post schon gesehen hat
  const checkIfPostIsViewed = async (post, profileId) => {
    const { data } = await supabase
      .from("post_views")
      .select("*")
      .eq("post_id", post.id)
      .eq("user_id", profileId)
      .maybeSingle();

    return {
      post,
      isViewed: !!data,
    };
  };

  const processAndFilterPosts = async (rawPosts, profileId) => {
    // Filtere direkt Posts vom aktuellen User heraus
    const foreignPosts = rawPosts.filter((p) => p.user_id !== profileId);

    // User-Daten parallel für alle Posts laden
    const userPromises = foreignPosts.map((p) => attachUserDataToPost(p));
    const postsWithUser = (await Promise.all(userPromises)).filter(Boolean);

    // View-Status parallel für alle Posts prüfen
    const viewPromises = postsWithUser.map((p) =>
      checkIfPostIsViewed(p, profileId),
    );
    const viewResults = await Promise.all(viewPromises);

    // Nur nicht-gesehene Posts zurückgeben
    return viewResults.filter((res) => !res.isViewed).map((res) => res.post);
  };

  useEffect(() => {
    if (!profile?.id) return;

    // INITIALER LADEVORGANG
    const loadInitialPictures = async () => {
      if (friends?.length === 0) return;

      try {
        console.log(
          "               fetching initial pictures for friends: ",
          friends,
        );
        const rawPosts = await fetchRawPosts();
        const validNotViewedPosts = await processAndFilterPosts(
          rawPosts,
          profile.id,
        );

        const postsAfterFriendship = validNotViewedPosts.filter(
          (p) =>
            p.created_at > friends.find((f) => f.id === p.user_id)?.created_at,
        );

        console.log("posts nach freundschaft: ", postsAfterFriendship);
        setPictures(postsAfterFriendship);
      } catch (error) {
        console.error("Fehler beim initialen Laden:", error);
      }
    };

    loadInitialPictures();

    // REALTIME SUPABASE CHANNEL
    const postsChannel = supabase
      .channel("public:posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        // TODO: Hier noch RLS oder so machen weil man auf JEDES bild hört, egal ob von freund oder nicht
        async (payload) => {
          console.log("Neues Bild live empfangen!", payload.new);

          const picFromFriend = friends.some(
            (f) => f.id === payload.new.user_id,
          );

          if (!picFromFriend) {
            console.log("picture not from friend");
            return;
          }

          const processedLivePost = await processAndFilterPosts(
            [payload.new],
            profile.id,
          );

          // Wenn das Bild valid & nicht vom User selbst ist, fügen wir es oben in die Liste ein
          if (processedLivePost.length > 0) {
            setPictures((prevPictures) => [
              processedLivePost[0],
              ...prevPictures,
            ]);
          }
        },
      )
      .subscribe();

    // Clean-up Funktion: Wenn die Komponente schließt, Kanal schließen!
    return () => {
      supabase.removeChannel(postsChannel);
    };
  }, [profile?.id, friends]);

  const searchUsers = async (name) => {
    if (name.trim === "") {
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .ilike("username", `%${name}%`); // TODO: Limit hinzufügen

    if (error) {
      console.error("Error fetching users:", error);
    } else {
      console.log("Fetched users:", data);

      const filteredData = data.filter((u) => u.id !== profile.id);

      const checkedData = filteredData.map((u) => {
        const isFriend = friends.some((f) => f.id === u.id);
        return {
          ...u,
          isFriend,
        };
      });

      setUsers(checkedData);
    }
  };

  const requestFriend = async (friendId) => {
    console.log("Requesting friendship with user ID:", friendId);

    const exists = await friendshipExists(friendId);

    if (exists) return;

    const { error } = await supabase
      .from("friendships")
      .insert({ user_id: profile.id, friend_id: friendId, status: "accepted" }); // TODO: Status auf pending

    if (error) {
      console.error("Error sending friend request: ", error);

      if (error.code === "23505") {
        // Unique violation
        console.log("friend req already exists");
      }
    } else {
      console.log("Friend request sent successfully");
    }
  };

  const friendshipExists = async (friendId) => {
    const { data, error } = await supabase
      .from("friendships")
      .select("id") // Wir brauchen nur die ID zum Prüfen
      .or(
        `and(user_id.eq.${profile.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${profile.id})`,
      )
      .maybeSingle(); // Gibt null zurück wenn nichts gefunden wurde (kein PGRST116 Fehler!)

    if (error) {
      console.error("Error checking existing friendship: ", error);
      return false;
    }

    return Boolean(data); // Gibt true zurück wenn data existiert, sonst false
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* 1. Header: Suchleiste bleibt oben */}
      <View className="flex flex-row items-center w-full z-50 bg-black">
        <TouchableOpacity
          onPress={() => setShowUsers((prev) => !prev)}
          className="flex-row items-center justify-center bg-gray-400 size-14"
        >
          {showUsers ? <X /> : <Search size={28} />}
        </TouchableOpacity>

        {showUsers && (
          <TextInput
            placeholder="Freunde finden..."
            className="border border-gray-300 p-2 flex-1 h-full text-white" // Wichtig: flex-1 statt w-full, damit es neben dem Button bleibt
            onChangeText={(e) => searchUsers(e)}
          />
        )}
      </View>

      {/* 2. Suchergebnisse (überlagern den Feed, wenn aktiv) */}
      {showUsers && (
        <View className="absolute top-32 left-0 right-0 bottom-0 bg-black z-40 px-4">
          {users.map((u) => (
            <View
              key={u.id}
              className="py-4 border-b border-zinc-800 flex-row items-center justify-between w-full"
            >
              <Text className="text-lg font-bold text-white">
                @{u.username} ({u.display_name})
              </Text>

              {u.isFriend ? (
                <TouchableOpacity className="p-2" disabled>
                  <Check size={20} color={"#fff"} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  className="p-2"
                  onPress={() => requestFriend(u.id)}
                >
                  <Plus size={20} color={"#fff"} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      )}

      {/* 3. Der Bilder-Bereich: Nimmt EXAKT den freien Platz in der Mitte ein */}
      <View className="flex-1 justify-center items-center w-full my-4">
        <Pictures photos={pictures} setPhotos={setPictures} />
      </View>

      <Text className="text-white font-bold">
        Nutzername: {profile?.username}
      </Text>
      <Text className="text-white"> Anzeigename: {profile?.display_name}</Text>

      {/* 4. Footer: Der SignOut Button bleibt fest unten */}
      <View className="w-full items-center pb-4">
        <SignOutButton />
      </View>
    </SafeAreaView>
  );
}

function Pictures({ photos, setPhotos }) {
  const { profile } = useAuthContext();

  const clickedCPicture = async (pictureId) => {
    const { error } = await supabase
      .from("post_views")
      .insert({ post_id: pictureId, user_id: profile.id });

    if (error) {
      console.error("Error recording post view: ", error);
    } else {
      console.log("Post view recorded successfully");
    }

    setPhotos((photos) => photos.filter((p) => p.id !== pictureId));
  };

  if (!photos || photos.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-white text-lg">Alle bilder gesehen! 🔥</Text>
      </View>
    );
  }

  return (
    // Der Container muss relative sein, damit die absolute-Kinder sich daran ausrichten
    <View style={styles.container}>
      {photos.map((p, index) => {
        // Das erste Element im Array (Index 0) ist die oberste Karte
        const isTopCard = index === 0;

        return (
          <TouchableOpacity
            key={p.id}
            activeOpacity={0.9}
            // Klick-Logik: Nur die oberste Karte reagiert auf Klicks
            onPress={() => {
              if (isTopCard) {
                clickedCPicture(p.id);
              }
            }}
            // Nur die oberste Karte fängt Klicks ab, die dahinter sind "durchlässig"
            pointerEvents={isTopCard ? "auto" : "none"}
            style={[
              styles.card,
              {
                // Z-Index umdrehen: Index 0 kriegt den höchsten Z-Index (liegt ganz oben)
                zIndex: photos.length - index,
                // Optional: Ein ganz leichter Versatz für die hinteren Karten (3D-Effekt)
                transform: [
                  { translateY: index * 4 },
                  { scale: 1 - index * 0.02 },
                ],
              },
            ]}
          >
            <View className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 shadow-2xl">
              <Image
                source={{ uri: p.image_url }} // Wichtig: Bei URLs aus dem Web { uri: ... } nutzen
                contentFit="cover"
                style={{ width: "100%", aspectRatio: 3 / 4 }} // 3:4 Format wirkt mehr wie Kamera/Snapchat
                className="rounded-xl mb-4"
              />

              <View className="flex-row justify-between items-center px-1">
                <Text className="text-xl font-bold text-white">
                  @{p.username}
                </Text>
                {/* Hier kannst du später noch die Flammenzahl anzeigen */}
                <Text className="text-lg text-orange-500 font-black">
                  🔥 {p.streakCount || 0}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    position: "relative",
  },
  card: {
    position: "absolute",
    width: "85%", // Damit es links und rechts cool aussieht
    maxWidth: 400,
  },
});
