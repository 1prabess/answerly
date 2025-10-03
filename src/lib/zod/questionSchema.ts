import z from "zod";

export const CreateQuestionSchema = z.object({
  title: z.string().min(6, "Title must be at least 6 characters."),
  description: z.string().optional(),
  image: z
    .any()
    .optional()
    .refine(
      (val) => !val || typeof val === "string" || val instanceof File,
      "Invalid image input"
    ),
  authorId: z.string(),
  tagNames: z.array(z.string()).nonempty("At least one tag is required"),
});

export type CreateQuestionType = z.infer<typeof CreateQuestionSchema>;
