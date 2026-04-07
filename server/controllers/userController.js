const User = require("./models/User");

// Signup route - mk
app.post("/api/signup", async (req, res) => {
  try {
    // Begin validating the schema using zod
    
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
    const isDupUsername = await User.findOne({ username: req.body.username });
    const isDupEmail = await User.findOne({ email: req.body.email })
    if (isDupUsername) {
      return res.status(401).json({
        error: "Username already taken; please choose another one",
      });
    }
    if (isDupEmail) {
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
});
