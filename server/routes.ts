import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertUserSchema, insertContactSchema } from "@shared/schema";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_default", {
  apiVersion: "2024-06-20",
});

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to verify JWT token
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/auth/user", authenticateToken, async (req: any, res) => {
    res.json({
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
    });
  });

  // Stripe payment route for coin purchases
  app.post("/api/create-payment-intent", authenticateToken, async (req: any, res) => {
    try {
      const { coins, amount, currency = "AED" } = req.body;
      
      // Convert amount to cents for Stripe
      const amountInCents = Math.round(parseFloat(amount) * 100);
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: currency.toLowerCase(),
        metadata: {
          userId: req.user.id.toString(),
          coins: coins.toString(),
        },
      });

      // Create coin purchase record
      await storage.createCoinPurchase({
        userId: req.user.id,
        coins: parseInt(coins),
        amount: amount,
        currency: currency,
        paymentMethod: "stripe",
        paymentIntentId: paymentIntent.id,
        status: "pending",
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Coinbase Commerce webhook (simplified)
  app.post("/api/coinbase-webhook", async (req, res) => {
    try {
      // TODO: Implement proper Coinbase Commerce webhook verification
      const { event } = req.body;
      
      if (event?.type === "charge:confirmed") {
        const metadata = event.data?.metadata;
        if (metadata?.userId && metadata?.coins) {
          await storage.createCoinPurchase({
            userId: parseInt(metadata.userId),
            coins: parseInt(metadata.coins),
            amount: event.data.pricing.local.amount,
            currency: event.data.pricing.local.currency,
            paymentMethod: "coinbase",
            paymentIntentId: event.data.id,
            status: "completed",
          });
        }
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get user's coin purchases
  app.get("/api/coin-purchases", authenticateToken, async (req: any, res) => {
    try {
      const purchases = await storage.getCoinPurchasesByUser(req.user.id);
      res.json(purchases);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const submission = await storage.createContactSubmission(contactData);
      
      // TODO: Send email notification
      
      res.json({ message: "Contact form submitted successfully", id: submission.id });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Coin packages endpoint
  app.get("/api/coin-packages", async (req, res) => {
    const packages = [
      { id: 1, coins: 500, price: { AED: 22.41, USD: 6.10, EUR: 5.60, PKR: 1700 } },
      { id: 2, coins: 1000, price: { AED: 44.29, USD: 12.05, EUR: 11.05, PKR: 3350 } },
      { id: 3, coins: 2000, price: { AED: 88.05, USD: 23.96, EUR: 21.98, PKR: 6650 } },
      { id: 4, coins: 3000, price: { AED: 131.82, USD: 35.87, EUR: 32.90, PKR: 9950 } },
      { id: 5, coins: 5000, price: { AED: 219.35, USD: 59.70, EUR: 54.78, PKR: 16580 }, popular: true },
      { id: 6, coins: 10000, price: { AED: 438.17, USD: 119.30, EUR: 109.46, PKR: 33100 } },
      { id: 7, coins: 17500, price: { AED: 766.40, USD: 208.60, EUR: 191.50, PKR: 57925 } },
      { id: 8, coins: 20000, price: { AED: 875.81, USD: 238.40, EUR: 218.75, PKR: 66200 } },
    ];
    
    res.json(packages);
  });

  const httpServer = createServer(app);
  return httpServer;
}
