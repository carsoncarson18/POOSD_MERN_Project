const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Ingredient = require("./models/Ingredient"); // Make sure this path is correct
const User = require("./models/User");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect to mongodb
mongoose.connect("mongodb://localhost:27017/Scraps")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
    res.send("Server running");
});

// test route
app.post("/test-user", async (req, res) => {
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

// start server
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});