import { z } from "zod";

export const CreateCommunitySchema = z.object({
  name: z
    .string()
    .min(1, "Community name is required.")
    .max(18, "Community name cannot exceed 18 characters."),
  description: z.string().optional(),
  avatar: z.instanceof(File).optional().nullable(),
  banner: z.instanceof(File).optional().nullable(),
});

export type CreateCommunityType = z.infer<typeof CreateCommunitySchema>;

// Type for the mutation payload
export type CreateCommunityPayload = {
  name: string;
  description?: string;
  avatar?: string;
  banner?: string;
};
