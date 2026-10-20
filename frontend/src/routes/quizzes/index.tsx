import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { SavedQuizzesPage } from "@/components/Quizzes/SavedQuizzesPage";

const quizzesSearchSchema = z.object({
  search: z.string().optional(),
  level: z.string().optional(),
});
export const Route = createFileRoute("/quizzes/")({
  validateSearch: quizzesSearchSchema,
  component: SavedQuizzesPage,
});
