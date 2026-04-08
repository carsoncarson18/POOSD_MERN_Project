const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const {
  signupSchema,
  loginSchema
} = require('../validators/user.validator');

const { sendVerificationEmail } = require("../emails/email.service");
require("dotenv").config({ path: __dirname + "/.env" });

const { z } = require('zod')

// Signup route - mk
const signup = async (req, res) => {
  try {
  // Begin validating the schema using zod
    const result = signupSchema.safeParse(req.body);
    
    if (!result.success) {
      const flatError = z.flattenError(result.error);
      return res.status(400).json({
        message: "Validation failed",
        errors: flatError.fieldErrors
      })
    }

    const { firstName, username, password, email } = result.data;

    // Duplicate username check
    const isDupUsername = await User.findOne({ username: username});
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
      
      // Set up new user for db, but don't add yet
      const newUser = {
        firstName,
        username,
        hashedPassword,
        email
      };

      const token = jwt.sign(
        { 
          firstName,
          username,
          password: hashedPassword,
          email
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      const url = `${process.env.APP_URL}/api/activate/${token}`;
      const success = sendVerificationEmail(email, url, "Verify your email adress", "Confirm Email");

      if (!success) {
        return res.status(400).json({message: "Failed to do email verification :("});
      }

      // const retObj = newUser.toObject();
      // delete retObj.password;

      // Return user data
      return res.json({ message: "Register success! Please activate your email to finalize your account!"}); // success
    }

    // Catch errors
  } catch (err) {
    console.error("Error forming user data:", err); // fail
    res
      .status(500)
      .json({ error: "Failed to save user", details: err.message });
  }
};

const activateEmail = async (req, res ) => {
  try {
    const { token } = req.params;
    const user = jwt.verify(token, process.env.JWT_SECRET);
    
    const { firstName, username, password, email } = user;
    console.log(user);
    // Check if user already exists (in case they click the link twice)
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ message: "Account already activated!" });
    }

    const newUser = await User.create({
        firstName: firstName,
        username: username,
        password: password,
        email: email,
    });


    if (!newUser) {
      return res.status(400).json({message: "Failed to create user"});
    }
    return res.json({message: "Account has been successfully activated! Please login!", user: newUser})

  } catch (err) {
    console.error("Error saving user data:", err); // fail
    res
      .status(500)
      .json({ error: "Failed to save user", details: err.message });
  }
};

// Login endpoint
const login = async (req, res) => {
  try {

    const validateLogin = loginSchema.safeParse(req.body);
    if (!validateLogin.success) {
      const prettyError = z.flattenError(validateLogin.error)
        return res.status(400).json({
          message: "Validation failed",
          errors: prettyError
        })
    }

    const { username, password } = validateLogin.data;

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
      ...validateLogin,
    };

    return res.json({ token: token, user: userData });

    // Catch errors
  } catch (err) {
    return res.status(500).json({
      error: "Failed to login",
      details: err.message,
    });
  }
}

module.exports = { signup, login, activateEmail };
