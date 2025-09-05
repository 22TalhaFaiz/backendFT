const express = require('express');
const { addProgress, getProgress } = require('../Controller/ProgressController');
const isAuthenticated = require('../Middleware/authMiddleware');

const router = express.Router();

router.post('/add', isAuthenticated, addProgress);
router.get('/', isAuthenticated, getProgress);

module.exports = router;
