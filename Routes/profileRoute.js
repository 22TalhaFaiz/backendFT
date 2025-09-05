const express = require("express");
const ProfileController = require("../Controller/ProfileController");

const router = express.Router();

// Profile routes
router.get("/", ProfileController.getProfile);
router.put("/", ProfileController.updateProfile);
router.put("/password", ProfileController.updatePassword);
router.delete("/", ProfileController.deleteAccount); // Optional

module.exports = router;