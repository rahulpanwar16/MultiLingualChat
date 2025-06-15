import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderName: text("sender_name").notNull(),
  senderInitials: text("sender_initials").notNull(),
  originalText: text("original_text").notNull(),
  translatedText: text("translated_text"),
  detectedLanguage: text("detected_language"),
  targetLanguage: text("target_language"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  translationStatus: text("translation_status").default("pending"), // pending, success, failed
  isFromCurrentUser: boolean("is_from_current_user").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  senderName: true,
  senderInitials: true,
  originalText: true,
  targetLanguage: true,
  isFromCurrentUser: true,
}).extend({
  targetLanguage: z.string().nullable().default(null),
  isFromCurrentUser: z.boolean().default(false),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export const languageSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export const userPreferencesSchema = z.object({
  userLanguage: z.string().default("en"),
  targetLanguage: z.string().default("es"),
  autoTranslate: z.boolean().default(true),
  showOriginal: z.boolean().default(true),
  autoDetect: z.boolean().default(true),
  qualityLevel: z.number().min(1).max(3).default(2),
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;
