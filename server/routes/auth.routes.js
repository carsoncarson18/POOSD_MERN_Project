const express = require("express");
const router = express.Router();
const { signup, login, activateEmail } = require("../controllers/auth.controller");


// Signup route - mk
router.post("/signup", signup);

// email activation route
router.get("/activate/:token", activateEmail)

// Login endpoint
router.post("/login", login);

module.exports = router;