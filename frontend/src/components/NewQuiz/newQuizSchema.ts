import { z } from "zod";

export const newQuizSchema = z.object({
  level: z.string().min(1, "Choose a level."),
  subject: z.string().min(1, "Choose a subject."),
  topic: z
    .string()
    .trim()
    .min(1, "Enter a topic.")
    .max(255, "Keep the topic under 255 characters."),
  question_count: z.number().int().min(1).max(20),
  language: z.enum(["en", "ms"]),
});

export type NewQuizValues = z.infer<typeof newQuizSchema>;
