const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  activateEmail,
  resetPassword,
  activatePassword,
} = require("../controllers/auth.controller");

// Signup route - mk
router.post("/signup", signup);

// email activation route
router.get("/activate/:token", activateEmail);

// password reset (sends email and redirects to:
// `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`)
router.post("/forgotPassword", resetPassword);

// Updates the password in the database; token and password
// are passed in req.body
router.post("/resetPassword", activatePassword);

// Login endpoint
router.post("/login", login);

module.exports = router;
