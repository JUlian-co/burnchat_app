import { supabase } from "@/lib/supabase";
import { isSameDay, isWithinLast24Hours } from "@/utils/date";

export async function updateStreakForPair(senderId, receiverId) {
  const now = new Date();

  // 1. Sortieren, damit user_one_id immer die kleinere ID ist
  const isSenderUserOne = senderId < receiverId;
  const userOneId = isSenderUserOne ? senderId : receiverId;
  const userTwoId = isSenderUserOne ? receiverId : senderId;

  // 2. Bestehenden Streak suchen
  const { data: existingStreak, error: fetchError } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_one_id", userOneId)
    .eq("user_two_id", userTwoId)
    .maybeSingle();

  if (fetchError) {
    console.error("Error fetching streak:", fetchError);
    return;
  }

  // Falls noch kein Streak existiert -> Neu anlegen
  if (!existingStreak) {
    const { error: insertError } = await supabase.from("streaks").insert({
      user_one_id: userOneId,
      user_two_id: userTwoId,
      count: 0,
      user_one_last_post: isSenderUserOne ? now.toISOString() : null,
      user_two_last_post: isSenderUserOne ? null : now.toISOString(),
    });

    if (insertError) {
      console.error("Error creating new streak:", insertError);
    }
    return;
  }

  // 3. Auslesen, wann WER zuletzt gepostet hat
  const senderLastPost = isSenderUserOne
    ? existingStreak.user_one_last_post
    : existingStreak.user_two_last_post;

  const receiverLastPost = isSenderUserOne
    ? existingStreak.user_two_last_post
    : existingStreak.user_one_last_post;

  // Hat der Sender heute schon gepostet? (Doppelte Posts ignorieren)
  if (senderLastPost && isSameDay(senderLastPost, now)) {
    return;
  }

  // 4. Prüfen, ob der Empfänger in den letzten 24h gepostet hat
  const hasReceiverPostedToday =
    receiverLastPost && isWithinLast24Hours(receiverLastPost, now);

  let newCount = existingStreak.count;

  if (hasReceiverPostedToday) {
    // Beide haben innerhalb des Fensters gepostet 🔥
    newCount += 1;
  } else if (receiverLastPost && !isWithinLast24Hours(receiverLastPost, now)) {
    // Empfänger hat das 24h-Fenster verpasst -> Reset 💔
    newCount = 0;
  }

  // 5. Update in Supabase durchführen
  const updatePayload = {
    count: newCount,
    updated_at: now.toISOString(),
    ...(isSenderUserOne
      ? { user_one_last_post: now.toISOString() }
      : { user_two_last_post: now.toISOString() }),
  };

  const { error: updateError } = await supabase
    .from("streaks")
    .update(updatePayload)
    .eq("id", existingStreak.id);

  if (updateError) {
    console.error("Error updating streak:", updateError);
  }
}
