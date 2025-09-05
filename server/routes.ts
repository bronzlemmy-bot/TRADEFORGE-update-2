import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import jwt from "jsonwebtoken";
import { insertUserSchema, signinSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface AuthRequest extends Request {
  user?: any;
}

// JWT middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Signup route
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      const user = await storage.createUser(validatedData);
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Don't send password in response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json({
        message: "User created successfully",
        user: userWithoutPassword,
        token
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      res.status(400).json({ message: error.message || "Failed to create user" });
    }
  });

  // Signin route
  app.post("/api/auth/signin", async (req, res) => {
    try {
      const validatedData = signinSchema.parse(req.body);
      
      const user = await storage.validateUser(validatedData.email, validatedData.password);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Don't send password in response
      const { password, ...userWithoutPassword } = user;
      
      res.json({
        message: "Sign in successful",
        user: userWithoutPassword,
        token
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      res.status(400).json({ message: error.message || "Failed to sign in" });
    }
  });

  // Protected dashboard route
  app.get("/api/user/dashboard", authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return mock dashboard data
      const dashboardData = {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
        portfolio: {
          totalValue: 127532.84,
          dailyPnL: 1847.92,
          dailyPnLPercent: 1.47,
          openPositions: 12,
          buyingPower: 45267.13,
        },
        recentTrades: [
          {
            id: 1,
            symbol: "AAPL",
            action: "Buy 100 shares",
            price: 175.32,
            pnl: 247.50,
            timestamp: new Date().toISOString(),
          },
          {
            id: 2,
            symbol: "TSLA", 
            action: "Sell 50 shares",
            price: 267.89,
            pnl: -132.75,
            timestamp: new Date().toISOString(),
          },
          {
            id: 3,
            symbol: "MSFT",
            action: "Buy 75 shares", 
            price: 387.45,
            pnl: 421.13,
            timestamp: new Date().toISOString(),
          },
        ],
        watchlist: [
          { symbol: "AAPL", name: "Apple Inc.", price: 175.32, change: 2.4 },
          { symbol: "GOOGL", name: "Alphabet Inc.", price: 2847.63, change: -0.8 },
          { symbol: "AMZN", name: "Amazon.com Inc.", price: 3134.26, change: 1.7 },
        ],
        marketOverview: {
          sp500: { value: 4327.81, change: 0.82 },
          nasdaq: { value: 13567.98, change: -0.34 },
          dow: { value: 34721.12, change: 1.15 },
        },
      };

      res.json(dashboardData);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch dashboard data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
