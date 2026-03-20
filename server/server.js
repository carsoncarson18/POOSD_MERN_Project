const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Ingredient = require("./models/Ingredient"); // Make sure this path is correct
const User = require("./models/User");

require('dotenv').config();

// be sure to add a .env file with MONGODB_URL=YOUR_URL_HERE in the server folder
const url = process.env.MONGODB_URL
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect to mongodb
mongoose.connect(url)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
    res.send("Server running");
});

// API Testing: http://localhost:5001/api/endpoint_name

// test route
app.post("api/test-user", async (req, res) => {
    try {
        const user = new User({
            firstName: "Test",
            username: "testuser",
            email: "test@gmail.com"
        });

        const saved = await user.save();
        res.json({ message: "Test user saved!", user: saved });
    } catch (err) {
        console.error("Error saving user:", err);
        res.status(500).json({ error: "Failed to save user", details: err.message });
    }
});

// Signup route - mk
app.post('/api/signup', async (req, res) => {
  try {
    const newUser = new User({
      firstName: req.body.firstName,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
    });
    const saved = await newUser.save();
    res.json({ message: "Test user saved!", user: saved }); // success
  } catch (err) { 
    console.error('Error saving user data:', err);          // fail
    res.status(500).json({ error: "Failed to save user", details: err.message });
  }
});


// start server
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});