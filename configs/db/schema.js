import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  uniqueIndex,
  unique,
} from "drizzle-orm/pg-core";

// 1. Die User-Tabelle
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey(), // Kommt direkt von Supabase Auth
    username: varchar("username", { length: 30 }).notNull().unique(), // Für die Suche & Profil-Link
    displayName: varchar("display_name", { length: 50 }).notNull(), // Echter Name (z.B. "Luca")
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      usernameIdx: uniqueIndex("username_idx").on(table.username),
    };
  },
);

// 2. Die Freundschafts-Tabelle (Beziehungen)
export const friendships = pgTable(
  "friendships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    friendId: uuid("friend_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    // Status: 'pending' (Anfrage gesendet), 'accepted' (Freunde), 'declined' (Abgelehnt)
    // TODO: Vllt mal noch ein enum
    status: varchar("status", { length: 20 }).default("pending").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      // TODO: In zukunft wenn gut läuft dann professioneller über rls oder so machen, keine abfrage davor
      uniqueUserFriend: unique("unique_user_friend").on(
        table.userId,
        table.friendId,
      ), // Verhindert exakt doppelte zeilen
    };
  },
);

export const streaks = pgTable(
  "streaks",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Die beiden Freunde
    userOneId: uuid("user_one_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    userTwoId: uuid("user_two_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    count: integer("count").default(0).notNull(), // Anzahl der Tage/Flammen

    // WICHTIG: Wann hat JEDER Einzelne zuletzt ein Bild geschickt?
    userOneLastPost: timestamp("user_one_last_post"),
    userTwoLastPost: timestamp("user_two_last_post"),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    // Verhindert doppelte Streak-Einträge für dasselbe Paar
    userPairIdx: uniqueIndex("user_pair_idx").on(
      table.userOneId,
      table.userTwoId,
    ),
  }),
);

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(), // Wer hat das Bild gemacht?
  imageUrl: varchar("image_url").notNull(), // Der öffentliche Link aus dem Supabase Storage
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Wer hat was gesehen? (Wichtig für das "Verbrennen")
export const postViews = pgTable(
  "post_views",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    postId: uuid("post_id")
      .references(() => posts.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(), // Wer hat es angeschaut?
    viewedAt: timestamp("viewed_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      // Verhindert, dass ein View doppelt gezählt wird
      uniquePostView: unique("unique_post_view").on(table.postId, table.userId),
    };
  },
);
