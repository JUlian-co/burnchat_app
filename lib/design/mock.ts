// Nur fuer den Design-Playground. Kein Supabase, keine echten Daten.
// Die Bilder kommen von einem Platzhalter-Dienst und brauchen Internet —
// ohne Verbindung bleiben die Rahmen leer, das Layout stimmt trotzdem.

const photo = (seed: string) => `https://picsum.photos/seed/${seed}/600/800`;

export type MockUser = {
  id: string;
  username: string;
  displayName: string;
  streak: number;
};

export type MockPost = {
  id: string;
  authorId: string;
  imageUrl: string;
  minutesAgo: number;
};

export type MockSearchResult = {
  id: string;
  username: string;
  displayName: string;
  isFriend: boolean;
};

export const me = {
  id: "me",
  username: "alex",
  displayName: "Alexander",
};

export const friends: MockUser[] = [
  { id: "f1", username: "julian", displayName: "Julian", streak: 12 },
  { id: "f2", username: "mia", displayName: "Mia", streak: 4 },
  { id: "f3", username: "tobi", displayName: "Tobi", streak: 0 },
  { id: "f4", username: "lena", displayName: "Lena", streak: 31 },
];

export const posts: MockPost[] = [
  { id: "p1", authorId: "f1", imageUrl: photo("burn-1"), minutesAgo: 2 },
  { id: "p2", authorId: "f4", imageUrl: photo("burn-2"), minutesAgo: 14 },
  { id: "p3", authorId: "f2", imageUrl: photo("burn-3"), minutesAgo: 48 },
];

export const searchResults: MockSearchResult[] = [
  { id: "s1", username: "noah", displayName: "Noah", isFriend: false },
  { id: "f2", username: "mia", displayName: "Mia", isFriend: true },
  { id: "s3", username: "jonas", displayName: "Jonas", isFriend: false },
];

export const findFriend = (id: string) => friends.find((f) => f.id === id);
