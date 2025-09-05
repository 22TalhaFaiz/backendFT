const express = require("express");
const { addNutritionData } = require("../Controller/NutritionController");
const Nutrition = require("../Collection/Nutrition"); // ✅ Import your model
const isAuthenticated = require("../Middleware/authMiddleware"); // ✅ Import auth middleware

const router = express.Router();

// ✅ Add new nutrition data
router.post("/", isAuthenticated, addNutritionData);

// ✅ Fetch nutrition entries only for the logged-in user
router.get("/g", isAuthenticated, async (req, res) => {
  try {
    const entries = await Nutrition.find({ user: req.session.user.id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    console.error("Error fetching nutrition entries:", error);
    res.status(500).json({ error: "Failed to fetch entries" });
  }
});

module.exports = router;
