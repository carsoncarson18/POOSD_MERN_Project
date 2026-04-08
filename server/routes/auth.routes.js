const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/auth.controller");

// Signup route - mk
router.post("/signup", signup);

// Login endpoint
router.post("/login", login);

module.exports = router;