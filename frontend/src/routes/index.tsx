import { createFileRoute } from "@tanstack/react-router";

import { NewQuizPage } from "@/components/NewQuiz/NewQuizPage";

export const Route = createFileRoute("/")({
  component: NewQuizPage,
});
