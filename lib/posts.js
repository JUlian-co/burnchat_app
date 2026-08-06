import { supabase } from "@/lib/supabase";

/**
 * Lädt ein Kamera-Asset in Supabase Storage hoch
 */
export async function uploadImage(asset, userId) {
  const formData = new FormData();
  formData.append("file", {
    uri: asset.uri,
    name: asset.fileName || "photo.jpg",
    type: asset.mimeType || "image/jpeg",
  });

  const path = `uploads_${userId}_${Date.now()}.jpg`;

  const { data, error } = await supabase.storage
    .from("uploads")
    .upload(path, formData, {
      contentType: asset.mimeType || "image/jpeg",
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error.message);
    return null;
  }

  const publicUrl = supabase.storage.from("uploads").getPublicUrl(data.path)
    .data.publicUrl;
  return publicUrl;
}

/**
 * Erstellt den eigentlichen Post in der Datenbank
 */
export async function createPost(userId, photoAsset) {
  const photoUrl = await uploadImage(photoAsset, userId);
  if (!photoUrl) return null;

  const { data, error } = await supabase
    .from("posts")
    .insert({ user_id: userId, image_url: photoUrl })
    .select()
    .single();

  if (error) {
    console.error("Error creating post:", error);
    return null;
  }

  return data;
}
