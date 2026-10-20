import { createFileRoute } from "@tanstack/react-router";

import { QuizPage } from "@/components/Quiz/QuizPage";

export const Route = createFileRoute("/quizzes/$quizId/")({
  component: QuizPage,
});
