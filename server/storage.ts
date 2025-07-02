import { 
  users, 
  coinPurchases, 
  contactSubmissions,
  type User, 
  type InsertUser,
  type CoinPurchase,
  type InsertCoinPurchase,
  type ContactSubmission,
  type InsertContact
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(userId: number, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<User>;
  
  // Coin purchase operations
  createCoinPurchase(purchase: InsertCoinPurchase): Promise<CoinPurchase>;
  getCoinPurchasesByUser(userId: number): Promise<CoinPurchase[]>;
  updateCoinPurchaseStatus(id: number, status: string): Promise<CoinPurchase>;
  
  // Contact operations
  createContactSubmission(contact: InsertContact): Promise<ContactSubmission>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: number, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        stripeCustomerId,
        stripeSubscriptionId,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async createCoinPurchase(insertPurchase: InsertCoinPurchase): Promise<CoinPurchase> {
    const [purchase] = await db
      .insert(coinPurchases)
      .values(insertPurchase)
      .returning();
    return purchase;
  }

  async getCoinPurchasesByUser(userId: number): Promise<CoinPurchase[]> {
    return await db
      .select()
      .from(coinPurchases)
      .where(eq(coinPurchases.userId, userId));
  }

  async updateCoinPurchaseStatus(id: number, status: string): Promise<CoinPurchase> {
    const [purchase] = await db
      .update(coinPurchases)
      .set({ status })
      .where(eq(coinPurchases.id, id))
      .returning();
    return purchase;
  }

  async createContactSubmission(insertContact: InsertContact): Promise<ContactSubmission> {
    const [submission] = await db
      .insert(contactSubmissions)
      .values(insertContact)
      .returning();
    return submission;
  }
}

export const storage = new DatabaseStorage();
