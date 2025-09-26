import { z } from "zod";

// Register account
export const RegisterSchema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters."),
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

export type RegisterType = z.infer<typeof RegisterSchema>;

// Login to account
export const LoginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type LoginType = z.infer<typeof LoginSchema>;
