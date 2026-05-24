import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* const ExpoSecureStoreAdapter = {
  getItem: (key) => {
    console.debug("getItem", { key, getItemAsync });
    return getItemAsync(key);
  },
  setItem: (key, value) => {
    if (value.length > 2048) {
      console.warn(
        "Value being stored in SecureStore is larger than 2048 bytes and it may not be stored successfully. In a future SDK version, this call may throw an error."
      );
    }
    return setItemAsync(key, value);
  },
  removeItem: (key) => {
    return deleteItemAsync(key);
  },
}; */

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
