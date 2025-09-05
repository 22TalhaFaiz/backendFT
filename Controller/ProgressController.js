const Progress = require('../Collection/Progress');

// Add progress entry
exports.addProgress = async (req, res) => {
    try {
        if (!req.session || !req.session.user || !req.session.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { weight, bodyMeasurements, performanceMetrics, date } = req.body;
        const userId = req.session.user.id;

        const progress = new Progress({
            userId,
            weight,
            bodyMeasurements,
            performanceMetrics,
            date: date || Date.now()
        });

        await progress.save();
        res.status(201).json(progress);
    } catch (error) {
        console.error("Progress add error:", error);
        res.status(500).json({ message: "Failed to add progress", error: error.message });
    }
};

// Get all progress entries for user
exports.getProgress = async (req, res) => {
    try {
        if (!req.session || !req.session.user || !req.session.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = req.session.user.id;
        const progressData = await Progress.find({ userId }).sort({ date: 1 }); // oldest first

        res.json(progressData);
    } catch (error) {
        console.error("Progress fetch error:", error);
        res.status(500).json({ message: "Failed to fetch progress", error: error.message });
    }
};
