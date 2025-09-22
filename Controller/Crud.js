require("dotenv").config();
const User = require("../Collection/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSKEY,
  },
});

const Crud = {
  // LOGIN FUNCTION
  login: async function (req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and Password are required" });
      }

      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

      // ✅ Create JWT token
      const token = jwt.sign(
        { id: user._id, name: user.name, email: user.email },
        process.env.SESSION_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
      );

      // ✅ Send token to frontend
      res.status(200).json({
        message: "Login successful",
        token, // save this in localStorage or client
        user: { id: user._id, name: user.name, email: user.email },
      });

    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Server error during login" });
    }
  },

  // REGISTER FUNCTION
  create: async function (req, res) {
    try {
      const { name, email, passw, age, height, weight, gender, activityLevel, profilePicture } = req.body;

      if (!name || !email || !passw || !age || !height || !weight || !gender) {
        return res.status(400).json({ msg: "All fields are required" });
      }

      const email_check = await User.findOne({ email });
      if (email_check) return res.status(409).json({ msg: "Email already exists" });

      const hashed_pass = bcrypt.hashSync(passw, 10);

      const newUser = new User({
        name,
        email,
        password: hashed_pass,
        age,
        height,
        weight,
        gender,
        activityLevel,
        profilePicture,
      });

      await newUser.save();

      // Send confirmation email
      const emailBody = {
        to: email,
        from: process.env.EMAIL,
        subject: "Welcome to Fitness Tracker",
        html: `<h3>Hello ${name}</h3>
               <p>Your account has been created successfully. Let’s crush those fitness goals!</p>`,
      };
      transporter.sendMail(emailBody, (err) => {
        if (err) console.log("Email error:", err);
      });

      res.status(201).json({ msg: "User registered successfully" });
    } catch (error) {
      console.log("Error In Create:", error);
      res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = Crud;
