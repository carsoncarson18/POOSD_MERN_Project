const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Ingredient = require("./models/Ingredient");
const User = require("./models/User");
const Neighborhood = require("./models/Neighborhood");
const { upload } = require("./config/cloudinary");
const { signupSchema, loginSchema } = require("./validators/user.validator.js")
const z = require('zod')

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
    return res
      .status(500)
      .json({ error: "Failed to save user", details: err.message });
  }
});

// Signup route - mk
app.post("/api/signup", async (req, res) => {
  try {
    const { firstName, username, password, email } = req.body;

    // Duplicate username check
    const isDupUsername = await User.findOne({ username: req.body.username });
    const isDupEmail = await User.findOne({ email: req.body.email })
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
     
      // Begin validating the schema using zod
      const result = signupSchema.safeParse(req.body);
      
      if (!result.success) {
        const flatError = z.flattenError(result.error);
        return res.status(400).json({
          message: "Validation failed",
          errors: flatError.fieldErrors
        })
      }

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
        { _id: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      const retObj = newUser.toObject();
      delete retObj.password;

      // Return user data
      return res.json({ message: "User saved!", token: token, user: retObj }); // success
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

    const validateLogin = loginSchema.safeParse(req.body);
    if (!validateLogin.success) {
      const prettyError = z.flattenError(validateLogin.error)
        return res.status(400).json({
          message: "Validation failed",
          errors: prettyError
        })
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

    return res.json({ token: token, user: userData });

    // Catch errors
  } catch (err) {
    return res.status(500).json({
      error: "Failed to login",
      details: err.message,
    });
  }
});

// Join neighborhood that already exist
app.post("/api/joinHood", auth, async (req, res) => {
  try {
    const { zipCode } = req.body;

    if (!/^\d{5}(-\d{4})?$/.test(zipCode)) {
      return res.status(400).json({
        error: "Invalid ZIP code format",
      });
    }

    const exists = await Neighborhood.exists({ zipCode });

    if (!exists) {
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
app.post("/api/createHood", auth, async (req, res) => {
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
app.post("/api/createIngredient", auth, upload.single("image"), async (req, res, next) => {

  // Directly pass request body and append postedBy field for creation
  try {
    const formData = {
      ...req.body,
      postedBy: req.user._id,
      imageUrl: req.file ? req.file.path : null
    }

    
    const newIngredient = await Ingredient.create(formData);
    
    if (!newIngredient) {
      return res.status(401).json("Failed to create ingredient; ensure all fields are filled")
    }
    
    const addIngToUser = await User.findByIdAndUpdate(req.user._id, {$addToSet: { ingredients: newIngredient._id }})
    
    if (!addIngToUser) {
      return res.status(401).json("Failed to add ingredient to user array");
    }
    // success
    return res.json({message: "Successfully created ingredient!", ingredient: newIngredient});

    // success
    return res.json({ message: "Successfully created ingredient!", ingredient: newIngredient });

    // fail; display error
  } catch (err) {
    return res.status(500).json({ error: "Failed to create Ingredient", details: err.message })
  }
})

// Pass in ingredient id and whatever ur editing. Will only update
// fields that changed (supposedly)
app.post("/api/editIngredient", auth, async (req, res, next) => {
  try {

    // only allow the following fields to be updated
    const updates = {
      name: req.body.name,
      quantity: req.body.quantity,
      description: req.body.description,
      expiresAt: req.body.expiresAt,
      category: req.body.category
    }

    // Ensure ingredient in request was posted by the user
    const getIngredient = await Ingredient.findOne({ _id: req.body._id, postedBy: req.user._id });

    //if not, exit
    if (!getIngredient) {
      return res.status(401).json({ message: "Unauthorized; Only original poster can edit this ingredient" });

    } else {

      // Update ingredient
      const updateStat = await Ingredient.updateOne({ _id: req.body._id }, { $set: updates })

      // success
      return res.json({ message: "Successfully edited ingredient!", ingredientInfo: updateStat })
    }

    // failure
  } catch (err) {
    return res.status(500).json({ error: "Failed to edit ingredient", details: err.message })
  }
})

app.get("/api/getMyIngredients", auth, async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    // First, get the user's ingredient IDs
    const user = await User.findById(userId).select('ingredients');
    
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }
    
    // Second, find all ingredients with those IDs
    const ingredients = await Ingredient.find({
      _id: { $in: user.ingredients }
    });
    
    return res.status(200).json({
      count: ingredients.length,
      data: ingredients
    });
    
  } catch (err) {
    return res.status(500).json({ 
      message: "Failed to retrieve user ingredients",
      details: err.message
    });
  }
});

// Delete by id of ingredient
app.delete("/api/deleteIngredient", auth, async (req, res, next) => {
  try {
    const findIngredient = await Ingredient.findOne({ _id: req.body._id, postedBy: req.user._id })
    console.log(findIngredient)


    if (!findIngredient)
      return res.status(401).json({ message: "Ingredient doesn't exist, or you're not authorized to delete it." });

    const deleteIngredient = await Ingredient.deleteOne({ findIngredient })
    return res.json({ message: "Successfully deleted ingredient!", deleteResult: deleteIngredient })

  } catch (err) {
    return res.status(500).json({ error: "Failed to delete ingredient", details: err.message })
  }
})
// Returns all ingredients posted within a neighborhood
// Pass in the ID of the neighborhood to get them
app.get("/api/getAllHoodIngredients", auth, async (req, res, next) => {
  try {

    const allIngredients = await Ingredient.find({ neighborhood: req.body._id });
    return res.json({ ingredients: allIngredients });

  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch ingredients", details: err.message })
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
