import z from "zod";

export const createQuestionSchema = z.object({
  title: z.string().min(6, "Title must be at least 6 characters."),
  description: z.string().optional(),
  image: z.string().url().optional(),
  authorId: z.string(),
});
