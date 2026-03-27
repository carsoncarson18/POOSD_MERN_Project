const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Ingredient = require("./models/Ingredient"); // Make sure this path is correct
const User = require("./models/User");

require("dotenv").config();

// be sure to add a .env file with MONGODB_URL=YOUR_URL_HERE in the server folder
const url = process.env.MONGODB_URL;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect to mongodb
mongoose
  .connect(url)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Server running");
});

// API Testing: http://localhost:5001/api/endpoint_name

// test route
app.post("/api/test-user", async (req, res) => {
  try {
    const user = new User({
      firstName: "Test",
      username: "testuser",
      email: "test@gmail.com",
    });

    const saved = await user.save();
    res.json({ message: "Test user saved!", user: saved });
  } catch (err) {
    console.error("Error saving user:", err);
    res
      .status(500)
      .json({ error: "Failed to save user", details: err.message });
  }
});

// Signup route - mk
app.post("/api/signup", async (req, res) => {
  try {

    const { firstName, username, password, email } = req.body;

    // Ensure all fields are filled in
    if (!username || !password || !firstName || !email) {
      return res.status(400).json({
        error: "All fields are required!",
      });
    }
    // Save new user to db
    const newUser = new User({
      firstName: firstName,
      username: username,
      password: password,
      email: email,
    });
    const saved = await newUser.save();

    // Return user data
    res.json({ message: "Test user saved!", user: saved }); // success

    // Catch errors
  } catch (err) {
    console.error("Error saving user data:", err); // fail
    res
      .status(500)
      .json({ error: "Failed to save user", details: err.message });
  }
});

// Login endpoint
app.post("/api/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        error: "Both username and password are required",
      });
    }

    // Find user by username
    const user = await User.findOne({ username: username, password: password });

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        error: "Invalid login information; check your spelling",
      });
    }

    // Return user data
    const userData = {
      id: user._id,
      firstName: user.firstName,
      username: user.username,
      // password: user.password,
      email: user.email,
    };

    res.json(userData);

    // Catch errors
  } catch (err) {
    res.status(500).json({
      error: "Failed to login",
      details: err.message,
    });
  }
});

// start server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
