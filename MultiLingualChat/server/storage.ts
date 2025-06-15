import { users, messages, type User, type InsertUser, type Message, type InsertMessage } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Message operations
  getMessages(): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessageTranslation(
    id: number, 
    translatedText: string, 
    detectedLanguage: string, 
    status: string
  ): Promise<Message | undefined>;
  getMessagesSince(timestamp: Date): Promise<Message[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getMessages(): Promise<Message[]> {
    return await db.select().from(messages).orderBy(messages.timestamp);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values({
        ...insertMessage,
        targetLanguage: insertMessage.targetLanguage || null,
        isFromCurrentUser: insertMessage.isFromCurrentUser || false,
      })
      .returning();
    return message;
  }

  async updateMessageTranslation(
    id: number,
    translatedText: string,
    detectedLanguage: string,
    status: string
  ): Promise<Message | undefined> {
    const [updatedMessage] = await db
      .update(messages)
      .set({
        translatedText,
        detectedLanguage,
        translationStatus: status,
      })
      .where(eq(messages.id, id))
      .returning();
    return updatedMessage || undefined;
  }

  async getMessagesSince(timestamp: Date): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.timestamp, timestamp))
      .orderBy(messages.timestamp);
  }
}

export const storage = new DatabaseStorage();
