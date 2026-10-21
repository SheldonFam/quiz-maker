import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { PrintQuizPage } from "@/components/Print/PrintQuizPage";
import { copyValues } from "@/components/Print/copyOptions";

const printSearchSchema = z.object({
  copy: z.enum(copyValues).optional().catch(undefined),
});

export const Route = createFileRoute("/quizzes/$quizId/print")({
  validateSearch: printSearchSchema,
  component: PrintQuizPage,
});
