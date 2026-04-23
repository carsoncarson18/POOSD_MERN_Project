const { z } = require("zod");

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(16, "Username must not exceed 16 characters"),
  email: z.email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be 8 characters long")
    .max(72, "Password must not exceed 72 characters")
    .regex(
      /[-!"#$%&'()*+,./:;<=>?@\[\\\]^_`{|}~]/,
      "Password must include at least one special character",
    ),
});

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const passwordValidator = signupSchema.shape.password;

const emailVerifySchema = signupSchema.shape.email;

module.exports = {
  signupSchema,
  loginSchema,
  passwordValidator,
  emailVerifySchema,
};
