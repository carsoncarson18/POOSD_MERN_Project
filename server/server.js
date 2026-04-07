const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config({ path: __dirname + "/.env" });

// Import routes
const authRoutes = require("./routes/auth.routes");
const neighborhoodRoutes = require("./routes/neighborhood.routes");
const ingredientRoutes = require("./routes/ingredient.routes");

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

// Routes
app.use("/api", authRoutes);
app.use("/api", neighborhoodRoutes);
app.use("/api", ingredientRoutes);

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