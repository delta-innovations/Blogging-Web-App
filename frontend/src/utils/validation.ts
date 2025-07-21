import { z } from "zod";

// Password schema for registration (matches backend registerSchema)
const registerPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(64, "Password cannot be more than 64 characters long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)"
  );

// Password schema for login (matches backend loginSchema)
const loginPasswordSchema = z.string().min(8, "Password must be at least 8 characters long");

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: loginPasswordSchema,
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username cannot be more than 30 characters long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Invalid email format"),
  password: registerPasswordSchema,
});

export const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type BlogForm = z.infer<typeof blogSchema>;