const Workout = require("../Collection/Workout");
const Nutrition = require("../Collection/Nutrition");

exports.getWorkoutFrequency = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const workouts = await Workout.find({
      userId,
      date: { $gte: sevenDaysAgo }
    });

    const frequencyMap = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toLocaleDateString();
      frequencyMap[key] = 0;
    }

    workouts.forEach(workout => {
      const key = new Date(workout.date).toLocaleDateString();
      if (frequencyMap[key] !== undefined) {
        frequencyMap[key]++;
      }
    });

    const result = Object.entries(frequencyMap)
      .reverse()
      .map(([date, count]) => ({ date, count }));

    res.json(result);
  } catch (error) {
    console.error("Frequency route error:", error);
    res.status(500).json({ error: "Failed to fetch workout frequency" });
  }
};

exports.getNutritionFrequency = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    // Fetch nutrition logs from the last 7 days
    const nutritionLogs = await Nutrition.find({
      userId,
      date: { $gte: sevenDaysAgo }
    });

    // Initialize frequency map for the past 7 days
    const frequencyMap = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toLocaleDateString();
      frequencyMap[key] = 0;
    }

    // Count nutrition logs per day
    nutritionLogs.forEach(log => {
      const key = new Date(log.date).toLocaleDateString();
      if (frequencyMap[key] !== undefined) {
        frequencyMap[key]++;
      }
    });

    // Convert map to array sorted by date (old → new)
    const result = Object.entries(frequencyMap)
      .reverse()
      .map(([date, count]) => ({ date, count }));

    res.json(result);
  } catch (error) {
    console.error("Nutrition frequency route error:", error);
    res.status(500).json({ error: "Failed to fetch nutrition frequency" });
  }
};

