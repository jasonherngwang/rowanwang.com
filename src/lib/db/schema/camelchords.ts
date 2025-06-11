import {
  pgSchema,
  text,
  timestamp,
  boolean,
  integer,
  serial,
} from "drizzle-orm/pg-core";
import { user } from "@/lib/db/schema";
import { InferSelectModel } from "drizzle-orm";

export const camelchordsSchema = pgSchema("camelchords");

export const libraries = camelchordsSchema.table("libraries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const songs = camelchordsSchema.table("songs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  isPublic: boolean("is_public").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  libraryId: integer("library_id")
    .notNull()
    .references(() => libraries.id, { onDelete: "cascade" }),
});

export type Song = InferSelectModel<typeof songs>;
export type Library = InferSelectModel<typeof libraries>;
export type LibraryWithSongs = Library & { songs: Song[] };
