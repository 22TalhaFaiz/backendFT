const express = require("express");
const { createWorkout, getWorkouts , deleteWorkout } = require("../Controller/WorkoutController");
const { verifyToken } = require("../Middleware/authMiddleware"); // JWT middleware

const router = express.Router();

router.post("/c", verifyToken, createWorkout);
router.get("/", verifyToken, getWorkouts);
router.delete("/:id", verifyToken, deleteWorkout);

module.exports = router;