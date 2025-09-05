const express = require("express");
const { createWorkout, getWorkouts , deleteWorkout } = require("../Controller/WorkoutController");
const isAuthenticated = require("../Middleware/authMiddleware");

const router = express.Router();

router.post("/c", isAuthenticated, createWorkout);
router.get("/", isAuthenticated, getWorkouts);
router.delete("/:id", isAuthenticated, deleteWorkout);

module.exports = router;