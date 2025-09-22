require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const db = require("./Connection");
const PORT = process.env.PORT || 3008;

const app = express();

// ✅ Configure allowed origins dynamically
const allowedOrigins = [
  "http://localhost:5173", // Local development (Vite)
  "https://fitnesstracker-beige-gamma.vercel.app",
  "https://backendft-production-9ad8.up.railway.app"

];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Express JSON parser
app.use(express.json());

// ✅ Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: "/",
      secure: process.env.NODE_ENV === "production", // 🚀 only true on Railway
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // 🚀 none for cross-site, lax for localhost
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// ✅ Mount routes
app.use("/api/auth", require("./Routes/route"));
app.use("/api/auth", require("./Routes/fpRoutes"));
app.use("/api/workouts", require("./Routes/workoutRoutes"));
app.use("/api/analytics", require("./Routes/analyticsRoutes"));
app.use("/api/profile", require("./Routes/profileRoute"));
app.use("/api/nutrition", require("./Routes/nutritionRoute"));
app.use("/api/progress", require("./Routes/progressRoutes"));

// ✅ Start server after DB connection
db().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server started on PORT=${PORT}`);
  });
});