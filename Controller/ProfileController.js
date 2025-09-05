require("dotenv").config();
const User = require("../Collection/User");
const bcrypt = require("bcrypt");

const ProfileController = {
  // GET user profile
  getProfile: async function (req, res) {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await User.findById(req.session.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        name: user.name,
        email: user.email,
        age: user.age,
        height: user.height,
        weight: user.weight,
        gender: user.gender,
        activityLevel: user.activityLevel,
        profilePicture: user.profilePicture
      });
    } catch (error) {
      console.error("Get Profile Error:", error);
      res.status(500).json({ message: "Server error while fetching profile" });
    }
  },

  // UPDATE user profile
  updateProfile: async function (req, res) {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { name, email, age, height, weight, gender, activityLevel, profilePicture } = req.body;

      // Basic validation
      if (!name || !email || !age || !height || !weight || !gender) {
        return res.status(400).json({ message: "All required fields must be provided" });
      }

      // Check if email is already taken by another user
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: req.session.user.id } 
      });
      
      if (existingUser) {
        return res.status(409).json({ message: "Email already exists" });
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.session.user.id,
        { 
          name, 
          email, 
          age: parseInt(age), 
          height: parseFloat(height), 
          weight: parseFloat(weight), 
          gender, 
          activityLevel, 
          profilePicture 
        },
        { new: true, runValidators: true }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update session data
      req.session.user.name = updatedUser.name;
      req.session.user.email = updatedUser.email;

      res.status(200).json({ 
        message: "Profile updated successfully", 
        user: {
          name: updatedUser.name,
          email: updatedUser.email,
          age: updatedUser.age,
          height: updatedUser.height,
          weight: updatedUser.weight,
          gender: updatedUser.gender,
          activityLevel: updatedUser.activityLevel,
          profilePicture: updatedUser.profilePicture
        }
      });
    } catch (error) {
      console.error("Update Profile Error:", error);
      res.status(500).json({ message: "Server error while updating profile" });
    }
  },

  // UPDATE password
  updatePassword: async function (req, res) {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Both current and new password are required" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters long" });
      }

      const user = await User.findById(req.session.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Hash new password
      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
      
      await User.findByIdAndUpdate(req.session.user.id, { 
        password: hashedNewPassword 
      });

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Update Password Error:", error);
      res.status(500).json({ message: "Server error while updating password" });
    }
  },

  // DELETE user account (bonus feature)
  deleteAccount: async function (req, res) {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ message: "Password is required to delete account" });
      }

      const user = await User.findById(req.session.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify password before deletion
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect password" });
      }

      await User.findByIdAndDelete(req.session.user.id);
      
      // Destroy session
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destroy error:", err);
        }
      });

      res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
      console.error("Delete Account Error:", error);
      res.status(500).json({ message: "Server error while deleting account" });
    }
  }
};

module.exports = ProfileController;