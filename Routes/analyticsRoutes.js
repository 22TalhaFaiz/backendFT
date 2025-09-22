const express = require('express');
const {verifyToken} = require('../Middleware/authMiddleware');
const { getWorkoutFrequency , getNutritionFrequency } = require('../Controller/AnalyticsController');

const router = express.Router();

router.get('/frequency', verifyToken, getWorkoutFrequency)
router.get('/frequency', verifyToken , getNutritionFrequency)

module.exports = router;