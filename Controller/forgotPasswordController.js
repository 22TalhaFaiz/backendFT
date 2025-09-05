require("dotenv").config();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../Collection/User");

// Nodemailer setup using your Gmail config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSKEY,
  },
});

// ========== 1. FORGOT PASSWORD ==========
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No user found" });

    // Generate secure reset token
    const token = crypto.randomBytes(32).toString("hex");

    // Save token + expiry to DB
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins expiry
    await user.save();

    // Reset link (Frontend page)
    const resetLink = `http://localhost:5173/reset-password/${token}`;

    // Send email
    await transporter.sendMail({
      from: `"Fitness Tracker" <${process.env.EMAIL}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
        <h2>Reset Password</h2>
        <p>Click the button below to reset your password:</p>
        <a href="${resetLink}" 
          style="background:#f97316;padding:10px 15px;color:#fff;border-radius:5px;text-decoration:none;">
          Reset Password
        </a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ========== 2. RESET PASSWORD ==========
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) return res.status(400).json({ message: "Password is required" });

    // Find user with matching token and valid expiry
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    // Hash new password
    const hashedPass = await bcrypt.hash(password, 10);

    // Update password and clear token
    user.password = hashedPass;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
