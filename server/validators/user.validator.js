const { z } = require("zod");

const signupSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    username: z.string().min(5, "Username must be at least 3 characters"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be 6 characters long")
});

const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required")
});

const hoodNameSchema = z.string()
            .min(3,"Neighborhood name must be at least 3 characters")
            .max(16,"Neighborhood name must be at most 16 characters")
            .regex(/^[a-zA-Z][a-zA-Z0-9_-]*$/, "Name must start with a letter and only contain letters, numbers, underscores, or hyphens")


module.exports = { signupSchema, loginSchema, hoodNameSchema };