import { createFileRoute } from "@tanstack/react-router";

import { PrintQuizPage } from "@/components/Print/PrintQuizPage";

export const Route = createFileRoute("/quizzes/$quizId/print")({
  component: PrintQuizPage,
});
