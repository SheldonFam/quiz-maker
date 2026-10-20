import { z } from "zod";

const optionSchema = z.string().trim().min(1, "Fill in this option.");

export const questionSchema = z.object({
  text: z.string().trim().min(1, "Enter the question."),
  options: z.tuple([optionSchema, optionSchema, optionSchema, optionSchema]),
  correct_index: z.number().int().min(0).max(3),
  explanation: z.string().trim().min(1, "Enter an explanation."),
});

export type QuestionValues = z.infer<typeof questionSchema>;
