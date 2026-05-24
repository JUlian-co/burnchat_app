import { AuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState({
    id: null,
    device_token: null,
    username: null,
    displayName: null,
    createdAt: null,
    // profile_pic: null, TODO: muss noch
  });
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
      if (session?.user) {

        console.log("Session user ID:", session.user.id);

        /* const { data, error } = await supabase
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
        } */
      } else {
        setProfile(null);
      }
    };

    fetchProfile();
  }, [session, retry]);

  return (
    <AuthContext.Provider
      value={{ session, isLoading, profile, isLoggedIn: !!session }}
    >
      {children}
    </AuthContext.Provider>
  );
}