import {z } from "zod";
import { ObjectId } from "mongodb";

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

export { signupSchema, loginSchema };