require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const db = require("./Connection");

const app = express();
const PORT = process.env.PORT || 3000; // 🔧 Define PORT variable

// ✅ Fixed CORS configuration
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://fitnesstracker-beige-gamma.vercel.app",
    "https://backendft-production-9ad8.up.railway.app"
  ], // 🔧 Use array format for multiple origins
  credentials: true,
}));

// Middleware
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: "/",
    secure: process.env.NODE_ENV === "production", // 🔧 Dynamic secure setting
    httpOnly: true,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
  }
}));

// Routes
app.use("/api/auth", require("./Routes/route")); 
app.use("/api/auth", require("./Routes/fpRoutes"));
app.use("/api/workouts", require("./Routes/workoutRoutes"));
app.use("/api/analytics", require("./Routes/analyticsRoutes"));
app.use("/api/profile", require("./Routes/profileRoute"));
app.use("/api/nutrition", require("./Routes/nutritionRoute"));
app.use("/api/progress", require("./Routes/progressRoutes"));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Fitness Tracker API is running!" });
});

// Start server after DB connection
db()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server started on PORT=${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  });