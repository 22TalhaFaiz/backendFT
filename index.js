require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const db = require("./Connection");

// Add logging for debugging
console.log('🚀 Starting Fitness Tracker API...');
console.log('📊 Environment:', process.env.NODE_ENV || 'development');
console.log('📁 Current directory:', process.cwd());

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

// CORS configuration
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://fitnesstracker-beige-gamma.vercel.app",
    "https://backendft-production-9ad8.up.railway.app"
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite:  process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
  }
}));

// Health check endpoint (important for deployment platforms)
app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "Fitness Tracker API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
try {
  app.use("/api/auth", require("./Routes/route")); 
  app.use("/api/auth", require("./Routes/fpRoutes"));
  app.use("/api/workouts", require("./Routes/workoutRoutes"));
  app.use("/api/analytics", require("./Routes/analyticsRoutes"));
  app.use("/api/profile", require("./Routes/profileRoute"));
  app.use("/api/nutrition", require("./Routes/nutritionRoute"));
  app.use("/api/progress", require("./Routes/progressRoutes"));
  console.log('✅ Routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('🚨 Global error handler:', err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// Handle 404 routes

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server with timeout handling
const startServer = async () => {
  try {
    console.log('🔌 Connecting to database...');
    
    // Add timeout for database connection
    const dbTimeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database connection timeout')), 30000);
    });
    
    await Promise.race([db(), dbTimeout]);
    console.log('✅ Database connected successfully');
    
    const server = app.listen(PORT, HOST, () => {
      console.log(`✅ Server running on ${HOST}:${PORT}`);
      console.log(`🌐 Health check: http://${HOST}:${PORT}/`);
    });

    // Set server timeout
    server.timeout = 120000; // 2 minutes
    
    return server;
  } catch (error) {
    console.error("❌ Server startup failed:", error.message);
    console.error("❌ Full error:", error);
    process.exit(1);
  }
};

// Start the server
startServer();