const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const {
  signupSchema,
  loginSchema,
  emailVerifySchema,
  passwordValidator,
} = require("../validators/user.validator");

const {
  sendVerificationEmail,
  sendForgotPasswordEmail,
} = require("../emails/email.service");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const { z } = require("zod");

const getAppUrl = () => {
  const url = process.env.FRONTEND_URL || process.env.APP_URL;
  return url ? url.replace(/\/+$/, "") : "";
};

// Signup route - mk
const signup = async (req, res) => {
  try {
    // Begin validating the schema using zod
    const result = signupSchema.safeParse(req.body);

    if (!result.success) {
      const flatError = z.flattenError(result.error);
      return res.status(400).json({
        message: "Validation failed",
        errors: flatError,
      });
    }

    const { firstName, username, password, email } = result.data;

    // Duplicate username check
    const isDupUsername = await User.findOne({ username: username });
    const isDupEmail = await User.findOne({ email: email });

    if (isDupEmail) {
        if (!isDupEmail.isVerified) {
          return res.status(401).json({
          error: "Verification email already sent; please check your inbox",
        });
        } else {
        return res.status(401).json({
          error: "Email already taken; please choose another one",
        });
      }
    } else if (isDupUsername) {
      return res.status(401).json({
        error: "Username already taken; please choose another one",
      });
    } else {
      //hash with salt
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        firstName: firstName,
        username: username,
        password: hashedPassword,
        email: email,
      });

      const token = jwt.sign(
        {
          firstName,
          username,
          password: hashedPassword,
          email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
      );

      const appUrl = getAppUrl();

      if (!appUrl) {
        return res.status(500).json({
          error: "Frontend URL is not configured",
        });
      }

      const url = `${appUrl}/activate/${token}`;
      const verificationResult = await sendVerificationEmail(
        email,
        url,
        "Verify your email adress",
        "Confirm Email",
      );

      if (!verificationResult?.statusCode) {
        console.error(
          "Failed to send verification email:",
          verificationResult?.error || "unknown error",
        );
        return res
          .status(502)
          .json({ message: "Failed to do email verification :(" });
      }

      // Return user data
      return res.json({
        message:
          "Register success! Please activate your email to finalize your account!",
      }); // success
    }

    // Catch errors
  } catch (err) {
    console.error("Error forming user data:", err); // fail
    res
      .status(500)
      .json({ error: "Failed to save user", details: err.message });
  }
};

const activateEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = jwt.verify(token, process.env.JWT_SECRET);

    const { firstName, username, password, email } = user;
    console.log(user);

    const newUser = await User.findByIdAndUpdate({isVerified: true});

    if (!newUser) {
      return res.status(400).json({ message: "Failed to create user" });
    }
    return res.json({
      message: "Account has been successfully activated! Please login!",
      user: newUser,
    });
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
      const prettyError = z.flattenError(validateLogin.error);
      return res.status(400).json({
        message: "Validation failed",
        errors: prettyError
      });
    }

    const { username, password } = validateLogin.data;

    // Find user by username
    const user = await User.findOne({ username: username });

    // Check if user exists
    if (!user) {
      return res.status(400).json({
        error: "Invalid login information; check your spelling",
      });
    }

    if (!user.isVerified) {
      const appUrl = getAppUrl();

      if (!appUrl) {
        return res.status(500).json({
          error: "Frontend URL is not configured",
        });
      }

      const token = jwt.sign(
        {
          userId: user._id
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
      );

      const url = `${appUrl}/activate/${token}`;
      const verificationResult = await sendVerificationEmail(
        validateLogin.email,
        url,
        "Verify your email address",
        "Confirm Email",
      );

      return res.status(200).json({
        details: "Verify your email to complete your registration; resent verification email!",
      });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(401).json({ error: "Invalid login" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({ token: token, user_id: user._id });

    // Catch errors
  } catch (err) {
    return res.status(500).json({
      error: "Failed to login",
      details: err.message,
    });
  }
};

// Takes in email and sends email confirming password change request
const resetPassword = async (req, res) => {
  try {

    // Validate email
    const { email } = req.body;
    const validateEmail = emailVerifySchema.safeParse(email);

    if (!validateEmail.success) {
      const prettyError = z.flattenError(validateEmail);
      return res.status(400).json({
        message: "Email validation failed",
        errors: prettyError,
      });
    }

    // Confirm user is in database
    const isUser = await User.findOne({ email: email });
    console.log(validateEmail.data);

    // If not, send vague error to protect privacy
    if (!isUser) {
      return res
        .status(200)
        .json({
          message:
            "If an account exists, you will receive a password reset email",
        });
    }

    // make jwt token (expires in one hour)
    const resetToken = jwt.sign(
      {
        userId: isUser._id,
        purpose: "password-reset",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    // Redirect user to this url in the email
    const appUrl = getAppUrl();

    if (!appUrl) {
      return res.status(500).json({
        error: "Frontend URL is not configured",
      });
    }

    const url = `${appUrl}/resetPassword/${resetToken}`;

    // Send email!
    const sendResetLink = await sendForgotPasswordEmail(
      validateEmail.data,
      "Forgot Your Password for Scraps?",
      url,
      "Password Change Request",
      "Reset Password"
    );

    // Failure to send email
    if (!sendResetLink?.statusCode) {
      console.error(
        "Failed to send password reset email:",
        sendResetLink?.error || "unknown error",
      );
      return res.status(400).json({ error: "Failed to send email" });
    }

    // Sucess
    return res.json({
      message:
        "If an account exists, you will receive a password reset email",
    }); // success
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to complete password reset", details: err.message });
  }
};

// Get token from email and pass in new password
const activatePassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Confirm token exists
    if (!token) {
      return res.status(400).json({ error: "No token passed through" });
    }

    try {
      // Grab user id from token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Confirm password reset
      if (decoded.purpose !== 'password-reset') {
        return res.status(400).json({ error: "Invalid token purpose" });
      }

      // Ensure new password meets requirements
      const validatePassword = passwordValidator.safeParse(password);
      console.log(validatePassword.data);

      if (!validatePassword.success) {
        const prettyError = z.flattenError(validatePassword.error);
        return res.status(400).json({
          message: "Password validation failed",
          errors: prettyError
        });
      }

      // Check if user still exists
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

      // Hash password and send it off to the database
      const hashedPassword = await bcrypt.hash(validatePassword.data, 10);

      user.password = hashedPassword;
      const saved = await user.save();

      return res.json({
        message: "Password has successfully been reset!",
      }); // success!
    } catch (err) {
      res
        .status(500)
        .json({
          error: "Failed to update password in database",
          details: err.message,
        }); // failure (database side)
    }
  } catch (err) {
    console.error("Token error:", err); // failure (token)
    res
      .status(500)
      .json({ error: "Failed to validate session", details: err.message });
  }
};

module.exports = { signup, login, activateEmail, resetPassword, activatePassword };
