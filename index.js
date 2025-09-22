require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const MongoStore = require("connect-mongo");  // ✅ for session storage in Mongo
const db = require("./Connection");

const PORT = process.env.PORT || 3008;
const app = express();

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173", 
  "https://fitnesstracker-beige-gamma.vercel.app"
];

// ✅ CORS middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle OPTIONS preflight globally
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ JSON parser
app.use(express.json());

// ✅ Session config with MongoStore
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.URL, // 🔑 your Railway MongoDB URL
      collectionName: "sessions",
    }),
    cookie: {
      path: "/",
      secure: process.env.NODE_ENV === "production", // true on Railway
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// ✅ Routes
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
