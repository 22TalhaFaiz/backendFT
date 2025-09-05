const express = require("express");
const { forgotPassword, resetPassword } = require("../Controller/forgotPasswordController");
const router = express.Router();

// POST: Request password reset
router.post("/forgot-password", forgotPassword);

// POST: Reset password with token
router.post("/reset-password/:token", resetPassword);

module.exports = router;
