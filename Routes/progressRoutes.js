const express = require('express');
const { addProgress, getProgress } = require('../Controller/ProgressController');
const { verifyToken } = require('../Middleware/authMiddleware');


const router = express.Router();

router.post('/add', verifyToken, addProgress);
router.get('/', verifyToken, getProgress);

module.exports = router;
