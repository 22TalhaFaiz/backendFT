

const mongoose = require("mongoose");
require("dotenv").config();

const db_url = process.env.URL;

const Database_connect = async () => {
  try {
    await mongoose.connect(db_url);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
  }
};

module.exports = Database_connect;
