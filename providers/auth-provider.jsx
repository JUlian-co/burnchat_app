import { AuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

// TODO: Auch alle freunde fetchen

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState({
    id: null,
    username: null,
    displayname: null,
  });
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [retry, setRetry] = useState(false);

  useEffect(() => {
    // Session beim Start checken
    fetchSession();

    // Auf Änderungen hören (Login/Logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      // Hier liest Supabase den AsyncStorage aus:
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setIsLoading(false); // Erst wenn das fertig ist, darf die App rendern
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log("Fetched session:", session);
    setSession(session); // Wenn kein User da ist, wird das null
    setIsLoading(false); // Erst HIER setIsLoading auf false
  };

  useEffect(() => {
    const fetchProfile = async () => {
      console.warn("fetch prfile called");
      if (session?.user) {
        console.warn("in if session user ");

        console.log("Session user ID:", session.user.id);

        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (data) {
          setProfile(data);
          console.log("       Fetched profile:", data);
        } else if (error) {
          // Falls noch kein Profil da ist (z.B. Timing Problem beim Erstellen)
          console.error("Error fetching profile:", error.message);

          // TODO: Diese retry logik ist gerade noch ein scheiß aber sie tuts fürs erste
          setRetry(!retry);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    };

    const fetchFriends = async () => {
      if (session?.user) {
        const { data, error } = await supabase
          .from("friendships")
          .select("*")
          .or(`user_id.eq.${session.user.id},friend_id.eq.${session.user.id}`)
          .eq("status", "accepted");

        if (data) {
          console.log("Fetched friends: ", data);

          const { data: friendProfiles, error: friendError } = await supabase
            .from("users")
            .select("*")
            .in("id", [
              ...data.map((f) => f.user_id),
              ...data.map((f) => f.friend_id),
            ]);

          if (friendProfiles) {
            console.log("Fetched friend profiles: ", friendProfiles);

            const filteredData = friendProfiles.filter(
              (f) => f.id !== session.user.id,
            );

            console.log("Filtered friend profiles: ", filteredData);

            setFriends(filteredData);
          } else if (friendError) {
            console.error(
              "Error fetching friend profiles: ",
              friendError.message,
            );
          }
        } else if (error) {
          console.error("Error fetching friends: ", error.message);
        }
      }
    };

    fetchProfile();

    /* TODO: wir müssen für die friends noch ein supabase channel erstellen */
    fetchFriends(); // war auskommentiert aber hat trotzdem geklappt
  }, [session, retry]);

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        profile,
        friends, isLoggedIn: !!session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
