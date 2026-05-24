import { pgTable, uuid, varchar, integer, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

// 1. Die User-Tabelle
export const users = pgTable('users', {
  id: uuid('id').primaryKey(), // Kommt direkt von Supabase Auth
  username: varchar('username', { length: 30 }).notNull().unique(), // Für die Suche & Profil-Link
  displayName: varchar('display_name', { length: 50 }).notNull(),   // Echter Name (z.B. "Luca")
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    usernameIdx: uniqueIndex('username_idx').on(table.username),
  };
});

// 2. Die Freundschafts-Tabelle (Beziehungen)
export const friendships = pgTable('friendships', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  friendId: uuid('friend_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  // Status: 'pending' (Anfrage gesendet), 'accepted' (Freunde), 'declined' (Abgelehnt)
  // TODO: Vllt mal noch ein enum
  status: varchar('status', { length: 20 }).default('pending').notNull(), 
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. Die Streak/Flammen-Tabelle (Das Herzstück deines Suchtfaktors!)
export const streaks = pgTable('streaks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userOneId: uuid('user_one_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  userTwoId: uuid('user_two_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  count: integer('count').default(0).notNull(), // Die Anzahl der Flammen
  lastInteraction: timestamp('last_interaction').defaultNow().notNull(), // Wann wurde das letzte Live-Bild geschickt?
});