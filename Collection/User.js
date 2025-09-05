const mongoose = require("mongoose");

const user_structure = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  height: {
    type: Number, // in cm
    required: true,
  },
  weight: {
    type: Number, // in kg
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  activityLevel: {
    type: String,
    enum: ["Sedentary", "Lightly Active", "Moderately Active", "Very Active"],
    default: "Sedentary",
  },
  profilePicture: {
    type: String, // URL (from Cloudinary or imgbb)
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

module.exports = mongoose.model("users", user_structure);
