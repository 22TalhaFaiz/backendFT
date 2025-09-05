const mongoose = require("mongoose");
require("dotenv").config();

const nutritionSchema = new mongoose.Schema(
  {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    food: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack"], // ✅ Categorize meals
      default: "Snack",
    },
    calories: {
      type: Number,
      required: true,
    },
    protein: {
      type: Number,
      required: true,
    },
    carbs: {
      type: Number,
      default: 0,
    },
    fats: {
      type: Number,
      default: 0,
    },
    servingSize: {
      type: String, // ✅ Example: "100g", "1 cup", "1 slice"
    },
    goal: {
      type: String,
      enum: ["Maintain", "Cutting", "Bulking"], // ✅ Useful for progress chart
      default: "Maintain",
    },
    notes: {
      type: String, // ✅ Optional field to add custom notes
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // ✅ Automatically adds createdAt & updatedAt
);

module.exports = mongoose.model("Nutrition", nutritionSchema);
