const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Ingredient = require("./models/Ingredient"); // Make sure this path is correct
const User = require("./models/User");
const Neighborhood = require("./models/Neighborhood");

require("dotenv").config({ path: __dirname + "/.env" });

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

// API Testing: http://localhost:5001/api/endpoint_name

const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = decoded;
    next();
  });
};

// test route
app.post("/api/test-user", async (req, res) => {
  try {
    const user = new User({
      firstName: "Test",
      username: "testuser",
      email: "test@gmail.com",
      password: "test123",
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

    // Duplicate username check
    const isDupUsername = await User.findOne({ username: username });
    const isDupEmail = await User.findOne({ email: email })
    if (isDupUsername) {
      return res.status(401).json({
        error: "Username already taken; please choose another one",
      });
    } 
    else if (isDupEmail) {
    return res.status(401).json({
      error: "Email already taken; please choose another one",
    });
    } else {
      //hash with salt
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save new user to db
      const newUser = await User.create({
        firstName: firstName,
        username: username,
        password: hashedPassword,
        email: email,
      });

      const token = jwt.sign(
        { _id: newUser._id},
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      const retObj = newUser.toObject();
      delete retObj.password;

      // Return user data
      res.json({ message: "User saved!", token: token, user: retObj }); // success
    }

    // Catch errors
  } catch (err) {
    console.error("Error saving user data:", err); // fail
    res
      .status(500)
      .json({ error: "Failed to save user", details: err.message });
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        error: "Both username and password are required",
      });
    }

    // Find user by username
    const user = await User.findOne({ username: username });

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        error: "Invalid login information; check your spelling",
      });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(401).json({ error: "Invalid login" });
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return user data
    const userData = {
      id: user._id,
      firstName: user.firstName,
      username: user.username,
      // password: user.password,
      email: user.email,
    };

    res.json({ token: token, user: userData });

    // Catch errors
  } catch (err) {
    res.status(500).json({
      error: "Failed to login",
      details: err.message,
    });
  }
});

// Join neighborhood that already exist
app.post("/api/join", auth, async (req, res) => {
  try {
    const { zipCode } = req.body;
    
    if (!/^\d{5}(-\d{4})?$/.test(zipCode)) {
      return res.status(400).json({
        error: "Invalid ZIP code format",
      });
    }

    const exists = await Neighborhood.exists({ zipCode });

    if(!exists){
      return res.json({ status: 'new', message: 'new ZIP code' });
    }

    await Neighborhood.findByIdAndUpdate(
      exists,
      { $addToSet: { members: req.user._id } }
    );

    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { neighborhoods: exists } }
    )

    res.json({ status: 'joined', message: 'joined ZIP code' });

  } catch (err) {
    res.status(500).json({ error: "Failed to join Neighborhood", details: err.message });
  }
});

// Create neighborhood and name it if your the first to join
app.post("/api/create", auth, async (req, res) => {
  try {
    const { name, zipCode } = req.body;

    const neighborhood = await Neighborhood.create({
      name: name, 
      zipCode: zipCode,
      members: [req.user._id],
      createdBy: req.user._id  
    });

    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { neighborhoods: neighborhood._id } }
    )

    res.json(neighborhood);
   
  } catch (err) {
    res.status(500).json({ error: "Failed to make Neighborhood", details: err.message });
  }
});

// Create Ingredient; token session required
app.post("/api/createIngredient", auth, async(req, res, next) => {
  
  // Directly pass request body and append postedBy field for creation
  try {
    const formData = {
      ...req.body,
      postedBy: req.user._id
    }

    const newIngredient = await Ingredient.create(formData);

    // success
    res.json({message: "Successfully created ingredient!", ingredient: newIngredient});

    // fail; display error
  } catch (err) {
    res.status(500).json({error: "Failed to create Ingredient", details: err.message})
  }
})

// Returns all ingredients posted within a neighborhood
// No parameters
// For now, it assumes the user has only one neighborhood
app.get("/api/getAllNeighborhoodIngredients", auth, async(req, res, next) => {
  try {
    const allIngredients = await Ingredient.find(req.user.neighborhood_id);
    res.json({ingredients: allIngredients});
    
  } catch (err) {
    res.status(500).json({error: "Failed to fetch ingredients", details: err.message})
  }
})

// serve frontend if built (droplet only)
const fs = require("fs");
const path = require("path");
const clientBuildPath = path.join(__dirname, "../client/dist");

if (fs.existsSync(clientBuildPath)) {
  console.log("Serving frontend from dist...");
  app.use(express.static(clientBuildPath));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

// start server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
