import { z } from "zod";

export const RegisterSchema = z.object({
  fullName: z.string().min(4, "Fullname must be at least 4 characters."),
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

export type RegisterType = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type LoginType = z.infer<typeof LoginSchema>;

export const UsernameSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-z0-9_-]+$/,
      "Only lowercase letters, numbers, underscores, or hyphens"
    )
    .transform((val) => val.toLowerCase()),
});

export type UsernameType = z.infer<typeof UsernameSchema>;
