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

  // Protected profile route
  app.get("/api/user/profile", authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return mock profile data
      const profileData = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        accountType: "Premium",
        memberSince: "January 2023",
        totalTrades: 247,
        successRate: 73.6,
        verificationStatus: "Verified",
        twoFactorEnabled: true,
        lastLogin: "Today at 10:23 AM",
      };

      res.json(profileData);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch profile data" });
    }
  });

  // Bot endpoints
  app.get("/api/bots", authenticateToken, async (req: any, res) => {
    try {
      // Mock bot data
      const bots = [
        {
          id: "bot1",
          name: "Momentum Trader",
          status: "active",
          strategy: "Momentum Trading",
          capital: 10000,
          maxRisk: 2,
          profitTarget: 10,
          stopLoss: 5,
          createdAt: new Date().toISOString(),
          performance: {
            totalTrades: 245,
            winRate: 73.5,
            totalPnL: 2847.32,
            monthlyReturn: 12.4
          }
        },
        {
          id: "bot2",
          name: "Scalper Pro",
          status: "paused",
          strategy: "Scalping",
          capital: 5000,
          maxRisk: 1.5,
          profitTarget: 5,
          stopLoss: 3,
          createdAt: new Date().toISOString(),
          performance: {
            totalTrades: 567,
            winRate: 68.2,
            totalPnL: 1234.56,
            monthlyReturn: 8.7
          }
        }
      ];
      res.json(bots);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch bots" });
    }
  });

  app.post("/api/bots", authenticateToken, async (req: any, res) => {
    try {
      const { name, strategy, capital, maxRisk, profitTarget, stopLoss } = req.body;
      const newBot = {
        id: `bot${Date.now()}`,
        name,
        strategy,
        capital,
        maxRisk,
        profitTarget,
        stopLoss,
        status: "stopped",
        createdAt: new Date().toISOString(),
        performance: {
          totalTrades: 0,
          winRate: 0,
          totalPnL: 0,
          monthlyReturn: 0
        }
      };
      res.status(201).json({ message: "Bot created successfully", bot: newBot });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create bot" });
    }
  });

  app.post("/api/bots/:id/start", authenticateToken, async (req: any, res) => {
    try {
      const { id } = req.params;
      res.json({ message: "Bot started successfully", botId: id });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to start bot" });
    }
  });

  app.post("/api/bots/:id/pause", authenticateToken, async (req: any, res) => {
    try {
      const { id } = req.params;
      res.json({ message: "Bot paused successfully", botId: id });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to pause bot" });
    }
  });

  // Signal endpoints
  app.get("/api/signals", authenticateToken, async (req: any, res) => {
    try {
      const signals = [
        {
          id: "signal1",
          symbol: "AAPL",
          action: "BUY",
          price: 175.32,
          targetPrice: 185.00,
          stopLoss: 168.50,
          confidence: 87,
          timeframe: "4H",
          strategy: "Breakout Pattern",
          status: "active",
          createdAt: new Date().toISOString()
        },
        {
          id: "signal2",
          symbol: "TSLA",
          action: "SELL",
          price: 267.89,
          targetPrice: 250.00,
          stopLoss: 275.00,
          confidence: 73,
          timeframe: "1D",
          strategy: "RSI Overbought",
          status: "active",
          createdAt: new Date().toISOString()
        },
        {
          id: "signal3",
          symbol: "GOOGL",
          action: "BUY",
          price: 2847.63,
          targetPrice: 2950.00,
          stopLoss: 2780.00,
          confidence: 92,
          timeframe: "1W",
          strategy: "Support Bounce",
          status: "executed",
          pnl: 342.18,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      res.json(signals);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch signals" });
    }
  });

  app.post("/api/signals/:id/execute", authenticateToken, async (req: any, res) => {
    try {
      const { id } = req.params;
      res.json({ message: "Signal executed successfully", signalId: id });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to execute signal" });
    }
  });

  // Copy Expert endpoints
  app.get("/api/copy-experts", authenticateToken, async (req: any, res) => {
    try {
      const experts = [
        {
          id: "expert1",
          name: "Sarah Johnson",
          username: "cryptoqueen",
          avatar: "/avatars/sarah.jpg",
          rating: 4.8,
          followers: 12450,
          following: false,
          performance: {
            totalReturn: 247.8,
            monthlyReturn: 18.2,
            winRate: 76.3,
            totalTrades: 1024,
            riskScore: 3.2
          },
          strategies: ["Swing Trading", "Technical Analysis", "Risk Management"],
          description: "Professional trader with 8+ years experience in crypto and forex markets. Specializes in medium-term swing trades with excellent risk management.",
          copyFee: 20,
          minCopyAmount: 500
        },
        {
          id: "expert2",
          name: "Michael Chen",
          username: "tradingpro",
          rating: 4.6,
          followers: 8934,
          following: true,
          performance: {
            totalReturn: 189.4,
            monthlyReturn: 14.7,
            winRate: 68.9,
            totalTrades: 756,
            riskScore: 2.8
          },
          strategies: ["Day Trading", "Scalping", "News Trading"],
          description: "Full-time day trader focusing on high-frequency strategies and news-based trading. Conservative risk approach with consistent returns.",
          copyFee: 15,
          minCopyAmount: 1000
        }
      ];
      res.json(experts);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch experts" });
    }
  });

  app.post("/api/copy-experts/:id/follow", authenticateToken, async (req: any, res) => {
    try {
      const { id } = req.params;
      res.json({ message: "Expert followed successfully", expertId: id });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to follow expert" });
    }
  });

  app.post("/api/copy-experts/:id/copy", authenticateToken, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { amount } = req.body;
      res.json({ message: "Copy trading started successfully", expertId: id, amount });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to start copy trading" });
    }
  });

  // Bitcoin Wallet endpoints
  app.get("/api/wallet/bitcoin", authenticateToken, async (req: any, res) => {
    try {
      const walletData = {
        address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
        balance: 0.05423789,
        pendingDeposits: 0.001,
        totalDeposited: 0.02443,
        successfulDeposits: 3,
        averageProcessingTime: 45,
        networkFee: 0.00001,
        minDeposit: 0.0001,
        maxDeposit: 10.0,
        exchangeRate: 43250
      };
      res.json(walletData);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch wallet data" });
    }
  });

  app.get("/api/wallet/bitcoin/deposits", authenticateToken, async (req: any, res) => {
    try {
      const deposits = [
        {
          id: "dep1",
          amount: 0.001,
          address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
          status: "pending",
          confirmations: 2,
          requiredConfirmations: 3,
          network: "Bitcoin",
          usdValue: 43.25,
          estimatedArrival: "25 minutes",
          createdAt: new Date(Date.now() - 1200000).toISOString()
        },
        {
          id: "dep2",
          amount: 0.0234,
          address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
          txHash: "a1b2c3d4e5f6789012345678901234567890abcdef123456789012345678901234",
          status: "confirmed",
          confirmations: 6,
          requiredConfirmations: 3,
          network: "Bitcoin",
          usdValue: 1012.05,
          processingTime: "42 minutes",
          createdAt: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: "dep3",
          amount: 0.00043,
          address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
          txHash: "b2c3d4e5f6789012345678901234567890abcdef123456789012345678901234a",
          status: "confirmed",
          confirmations: 15,
          requiredConfirmations: 3,
          network: "Bitcoin",
          usdValue: 18.60,
          processingTime: "38 minutes",
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      res.json(deposits);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch deposit history" });
    }
  });

  // Withdrawal endpoints
  app.get("/api/wallet/balance", authenticateToken, async (req: any, res) => {
    try {
      const balance = {
        btc: 0.05423789,
        usd: 15420.50
      };
      res.json(balance);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch balance" });
    }
  });

  app.get("/api/wallet/withdrawals", authenticateToken, async (req: any, res) => {
    try {
      const withdrawals = [
        {
          id: "with1",
          amount: 0.01,
          currency: "btc",
          address: "bc1qabcdef123456789012345678901234567890xyz",
          fee: 0.0005,
          status: "processing",
          createdAt: new Date().toISOString()
        },
        {
          id: "with2",
          amount: 500,
          currency: "usd",
          address: "Bank Account ****1234",
          fee: 5,
          status: "completed",
          txHash: "TXN123456789",
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      res.json(withdrawals);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch withdrawal history" });
    }
  });

  app.post("/api/wallet/withdraw", authenticateToken, async (req: any, res) => {
    try {
      const { amount, currency, address } = req.body;
      
      // Enhanced validation
      if (!amount || amount <= 0 || isNaN(amount)) {
        return res.status(400).json({ message: "Please enter a valid amount greater than 0" });
      }
      
      if (!address || !address.trim()) {
        return res.status(400).json({ message: "Withdrawal address is required" });
      }
      
      if (!currency || !['btc', 'usd'].includes(currency.toLowerCase())) {
        return res.status(400).json({ message: "Invalid currency selected" });
      }

      // Enhanced balance and minimum checks
      const balances = { btc: 0.05423789, usd: 15420.50 };
      const availableBalance = currency === 'btc' ? balances.btc : balances.usd;
      const minimumWithdraw = currency === 'btc' ? 0.001 : 10;
      const fee = currency === 'btc' ? 0.0005 : 5;
      
      if (amount < minimumWithdraw) {
        return res.status(400).json({ 
          message: `Minimum withdrawal amount is ${currency === 'btc' ? '0.001 BTC' : '$10'}` 
        });
      }
      
      if (amount > availableBalance) {
        return res.status(400).json({ 
          message: `Insufficient balance. Available: ${availableBalance} ${currency.toUpperCase()}` 
        });
      }
      
      // Check if amount covers the fee
      if (amount <= fee) {
        return res.status(400).json({ 
          message: `Amount must be greater than network fee of ${currency === 'btc' ? '0.0005 BTC' : '$5'}` 
        });
      }

      // Enhanced address validation
      if (currency === 'btc') {
        // Basic Bitcoin address validation
        if (!address.match(/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/)) {
          return res.status(400).json({ message: "Invalid Bitcoin address format" });
        }
      }

      const withdrawal = {
        id: `with${Date.now()}`,
        amount: parseFloat(amount.toFixed(currency === 'btc' ? 8 : 2)),
        currency: currency.toLowerCase(),
        address: address.trim(),
        fee,
        netAmount: amount - fee,
        status: "pending",
        createdAt: new Date().toISOString()
      };
      
      res.status(201).json({ 
        message: "Withdrawal request submitted successfully", 
        withdrawal,
        estimatedArrival: currency === 'btc' ? '30-60 minutes' : '1-3 business days'
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to process withdrawal" });
    }
  });
  
  // Market Analysis endpoints
  app.get("/api/market/analysis", authenticateToken, async (req: any, res) => {
    try {
      const marketData = [
        {
          symbol: "AAPL",
          name: "Apple Inc.",
          price: 175.32,
          change: 4.23,
          changePercent: 2.47,
          volume: 89234567,
          marketCap: 2756789000000,
          analysis: {
            recommendation: "BUY",
            confidence: 87,
            supportLevel: 168.50,
            resistanceLevel: 182.00,
            rsi: 64.2,
            macd: "Bullish",
            sentiment: "Bullish"
          },
          news: [
            {
              title: "Apple Reports Strong Q4 Earnings",
              summary: "Apple exceeded expectations with iPhone sales driving revenue growth.",
              impact: "positive",
              timestamp: new Date().toISOString()
            },
            {
              title: "New iPhone Models Drive Market Interest",
              summary: "Latest iPhone release showing strong pre-order numbers.",
              impact: "positive",
              timestamp: new Date(Date.now() - 3600000).toISOString()
            }
          ]
        },
        {
          symbol: "TSLA",
          name: "Tesla Inc.",
          price: 267.89,
          change: -8.45,
          changePercent: -3.06,
          volume: 45678901,
          marketCap: 856789000000,
          analysis: {
            recommendation: "HOLD",
            confidence: 73,
            supportLevel: 255.00,
            resistanceLevel: 280.00,
            rsi: 45.8,
            macd: "Bearish",
            sentiment: "Neutral"
          },
          news: [
            {
              title: "Tesla Production Numbers Mixed",
              summary: "Q4 production met expectations but guidance remains cautious.",
              impact: "neutral",
              timestamp: new Date(Date.now() - 7200000).toISOString()
            }
          ]
        },
        {
          symbol: "GOOGL",
          name: "Alphabet Inc.",
          price: 2847.63,
          change: 12.89,
          changePercent: 0.45,
          volume: 23456789,
          marketCap: 1823456000000,
          analysis: {
            recommendation: "BUY",
            confidence: 92,
            supportLevel: 2780.00,
            resistanceLevel: 2950.00,
            rsi: 58.4,
            macd: "Bullish",
            sentiment: "Bullish"
          },
          news: [
            {
              title: "Google AI Advances Show Promise",
              summary: "New AI developments position Google strongly in the market.",
              impact: "positive",
              timestamp: new Date(Date.now() - 1800000).toISOString()
            }
          ]
        },
        {
          symbol: "MSFT",
          name: "Microsoft Corporation",
          price: 387.45,
          change: 2.67,
          changePercent: 0.69,
          volume: 34567890,
          marketCap: 2876543000000,
          analysis: {
            recommendation: "BUY",
            confidence: 85,
            supportLevel: 375.00,
            resistanceLevel: 400.00,
            rsi: 61.2,
            macd: "Bullish",
            sentiment: "Bullish"
          },
          news: [
            {
              title: "Microsoft Cloud Revenue Grows",
              summary: "Azure and Office 365 continue strong growth trajectory.",
              impact: "positive",
              timestamp: new Date(Date.now() - 5400000).toISOString()
            }
          ]
        }
      ];
      res.json(marketData);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch market analysis" });
    }
  });
  
  app.get("/api/market/indices", authenticateToken, async (req: any, res) => {
    try {
      const indices = {
        sp500: { value: 4327.81, change: 0.82 },
        nasdaq: { value: 13567.98, change: -0.34 },
        dow: { value: 34721.12, change: 1.15 },
        vix: { value: 18.42, change: -2.1 }
      };
      res.json(indices);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch market indices" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
