const express = require("express");
const router = express.Router();
const { signup, login, activateEmail, resetPassword, activatePassword } = require("../controllers/auth.controller");


// Signup route - mk
router.post("/signup", signup);

// email activation route
router.get("/activate/:token", activateEmail)

// password reset

router.post("/forgotPassword", resetPassword)
router.post("/resetPassword", activatePassword)

// Login endpoint
router.post("/login", login);

module.exports = router;