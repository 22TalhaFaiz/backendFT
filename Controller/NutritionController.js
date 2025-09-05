const axios = require("axios");
const Nutrition = require("../Collection/Nutrition");

const addNutritionData = async (req, res) => {
  const { food, category, calories, protein, carbs, fats, servingSize, goal, notes } = req.body;

  try {
    // Make sure user is available in session
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let nutritionInfo = { calories, protein, carbs, fats };

    // Only fetch from Nutritionix if macros are missing
    if (!calories || !protein || !carbs || !fats) {
      const response = await axios.post(
        "https://trackapi.nutritionix.com/v2/natural/nutrients",
        { query: food },
        {
          headers: {
            "x-app-id": process.env.NUTRITIONIX_APP_ID,
            "x-app-key": process.env.NUTRITIONIX_APP_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      const item = response.data.foods[0];
      nutritionInfo = {
        calories: item.nf_calories,
        protein: item.nf_protein,
        carbs: item.nf_total_carbohydrate,
        fats: item.nf_total_fat,
      };
    }

    const newEntry = new Nutrition({
      food,
      category,
      servingSize,
      goal,
      notes,
      ...nutritionInfo,
      user: req.session.user.id, // ✅ Associate entry with logged-in user
    });

    await newEntry.save();
    res.status(201).json(newEntry);

  } catch (error) {
    console.error("Error in addNutritionData:", error.message);
    res.status(500).json({ error: "Failed to fetch or save nutrition data" });
  }
};

module.exports = { addNutritionData };
