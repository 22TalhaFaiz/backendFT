const express = require('express');
const isAuthenticated = require('../Middleware/authMiddleware');
const { getWorkoutFrequency , getNutritionFrequency } = require('../Controller/AnalyticsController');

const router = express.Router();

router.get('/frequency', isAuthenticated , getWorkoutFrequency)
router.get('/frequency', isAuthenticated , getNutritionFrequency)

module.exports = router;