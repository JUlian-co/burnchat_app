import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useReducedMotion,
  withTiming,
} from "react-native-reanimated";
import SignOutButton from "@/components/social-auth-buttons/sign-out-button";
import {
  Avatar,
  Card,
  Chip,
  EmptyState,
  haptics,
  Icon,
  ListGroup,
  ListRow,
  NavBar,
  Screen,
  Text,
  TextField,
  useColors,
} from "@/components/ui";
import { useAuthContext } from "@/hooks/use-auth-context";
import { touchTarget } from "@/lib/design/tokens";
import { supabase } from "@/lib/supabase";

export default function PostsScreen() {
  const { profile, friends } = useAuthContext();
  const colors = useColors();
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [pictures, setPictures] = useState([]);

  // 1. Alle Posts von freunden von Server holen
  const fetchRawPosts = async () => {
    const friendIds = (friends ?? []).map((f) => f.id);

    if (friendIds.length === 0) {
      return [];
    }

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .in("user_id", friendIds)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts: ", error);
      return [];
    }

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
        const rawPosts = await fetchRawPosts();
        const validNotViewedPosts = await processAndFilterPosts(
          rawPosts,
          profile.id,
        );

        const postsAfterFriendship = validNotViewedPosts.filter(
          (p) =>
            p.created_at > friends.find((f) => f.id === p.user_id)?.created_at,
        );

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
          const picFromFriend = friends.some(
            (f) => f.id === payload.new.user_id,
          );

          if (!picFromFriend) {
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
    const exists = await friendshipExists(friendId);

    if (exists) return;

    const { error } = await supabase
      .from("friendships")
      .insert({ user_id: profile.id, friend_id: friendId, status: "accepted" }); // TODO: Status auf pending

    if (error) {
      console.error("Error sending friend request: ", error);
      haptics.error();
    } else {
      haptics.success();
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
    <Screen>
      <NavBar
        title={showUsers ? "Suchen" : "Burnchat"}
        subtitle={showUsers ? undefined : "Antippen laesst das Bild verbrennen."}
        trailing={
          <Pressable
            onPress={() => setShowUsers((prev) => !prev)}
            accessibilityRole="button"
            accessibilityLabel={
              showUsers ? "Suche schliessen" : "Freunde suchen"
            }
            style={{ width: touchTarget, height: touchTarget }}
            className="items-center justify-center rounded-full bg-elevated active:scale-[0.92] active:opacity-60"
          >
            <Icon
              name={showUsers ? "close" : "search"}
              size={19}
              color={colors.label}
            />
          </Pressable>
        }
      />

      {showUsers ? (
        <View className="flex-1 gap-4 px-4">
          <TextField
            variant="filled"
            placeholder="Nutzername"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            onChangeText={(e) => searchUsers(e)}
          />

          {users.length > 0 ? (
            <ScrollView
              contentContainerClassName="pb-8"
              keyboardShouldPersistTaps="handled"
            >
              <ListGroup>
                {users.map((u, index) => (
                  <ListRow
                    key={u.id}
                    title={u.display_name || u.username}
                    subtitle={`@${u.username}`}
                    leading={<Avatar name={u.display_name || u.username} />}
                    showSeparator={index < users.length - 1}
                    trailing={
                      u.isFriend ? (
                        <Chip tone="sage" label="Freund" icon="check" />
                      ) : (
                        <Pressable
                          onPress={() => requestFriend(u.id)}
                          accessibilityRole="button"
                          accessibilityLabel={`${u.username} hinzufuegen`}
                          hitSlop={8}
                          className="size-9 items-center justify-center rounded-full bg-accent active:scale-[0.9] active:opacity-70"
                        >
                          <Icon name="add" size={17} color={colors["on-fill"]} />
                        </Pressable>
                      )
                    }
                  />
                ))}
              </ListGroup>
            </ScrollView>
          ) : (
            <EmptyState
              icon={<Icon name="personAdd" size={40} color={colors.muted} />}
              title="Wen suchst du?"
              description="Tippe den Nutzernamen ein. Treffer erscheinen sofort."
            />
          )}
        </View>
      ) : (
        <>
          <View className="w-full flex-1 items-center justify-center">
            <Pictures
              photos={pictures}
              setPhotos={setPictures}
              hasFriends={friends?.length > 0}
              onFindFriends={() => setShowUsers(true)}
            />
          </View>

          <View className="px-4 pb-3">
            <Card className="flex-row items-center gap-3">
              <Avatar
                name={profile?.display_name || profile?.username || ""}
                size={44}
              />
              <View className="flex-1">
                <Text variant="headline">
                  {profile?.display_name || "Kein Profil"}
                </Text>
                <Text variant="footnote" tone="muted">
                  @{profile?.username ?? "unbekannt"}
                </Text>
              </View>
              <SignOutButton />
            </Card>
          </View>
        </>
      )}
    </Screen>
  );
}

// Pressable, das Reanimateds Ein- und Ausblend-Animationen versteht.
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Der Brennmoment: die Karte flammt kurz auf und ist weg. Laeuft als Worklet
// auf dem UI-Thread, deshalb das "worklet"-Kennwort — sonst ruckelt es,
// sobald JavaScript gerade beschaeftigt ist.
const burnAway = () => {
  "worklet";
  return {
    initialValues: { opacity: 1, transform: [{ scale: 1 }] },
    animations: {
      opacity: withTiming(0, { duration: 380 }),
      transform: [{ scale: withTiming(1.08, { duration: 380 }) }],
    },
  };
};

function Pictures({ photos, setPhotos, hasFriends, onFindFriends }) {
  const { profile } = useAuthContext();
  const colors = useColors();
  // Systemeinstellung "Bewegung reduzieren" — dann wird nur weich geblendet
  // statt aufzuflammen. Bei Apple ist das Pflicht, nicht Kuer.
  const reduceMotion = useReducedMotion();

  const clickedCPicture = async (pictureId) => {
    haptics.tap();

    const { error } = await supabase
      .from("post_views")
      .insert({ post_id: pictureId, user_id: profile.id });

    if (error) {
      console.error("Error recording post view: ", error);
    }

    setPhotos((photos) => photos.filter((p) => p.id !== pictureId));
  };

  if (!photos || photos.length === 0) {
    return hasFriends ? (
      <EmptyState
        icon={<Icon name="flame" size={40} color={colors.accent} />}
        title="Alles gesehen"
        description="Neue Bilder deiner Freunde landen sofort hier."
      />
    ) : (
      <EmptyState
        icon={<Icon name="personAdd" size={40} color={colors.muted} />}
        title="Noch keine Freunde"
        description="Ohne Freunde bleibt es hier leer. Such jemanden ueber die Lupe oben."
        actionTitle="Freunde finden"
        onAction={onFindFriends}
      />
    );
  }

  return (
    // Der Container muss relative sein, damit die absolute-Kinder sich daran ausrichten
    <View style={styles.container}>
      {photos.map((p, index) => {
        // Das erste Element im Array (Index 0) ist die oberste Karte
        const isTopCard = index === 0;

        return (
          <AnimatedPressable
            key={p.id}
            entering={FadeIn.duration(220)}
            exiting={reduceMotion ? FadeOut.duration(280) : burnAway}
            accessibilityRole="button"
            accessibilityLabel={`Bild von ${p.username} verbrennen`}
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
                // Leichter Versatz fuer die hinteren Karten (Stapel-Effekt)
                transform: [
                  { translateY: index * 6 },
                  { scale: 1 - index * 0.03 },
                ],
              },
            ]}
          >
            <Card>
              <Image
                source={{ uri: p.image_url }}
                contentFit="cover"
                style={{ width: "100%", aspectRatio: 3 / 4, borderRadius: 8 }}
              />

              <View className="mt-3 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Avatar name={p.displayName || p.username} size={28} />
                  <Text variant="headline">@{p.username}</Text>
                </View>

                <Chip
                  tone="accent"
                  label={String(p.streakCount || 0)}
                  icon="flame"
                />
              </View>
            </Card>
          </AnimatedPressable>
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
    width: "88%",
    maxWidth: 400,
  },
});
