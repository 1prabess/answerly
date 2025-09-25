import { z } from "zod";

// Zod for registering a user
export const RegisterSchema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters."),
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

export type RegisterType = z.infer<typeof RegisterSchema>;
