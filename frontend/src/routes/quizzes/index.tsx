import { createFileRoute } from "@tanstack/react-router";

import { SavedQuizzesPage } from "@/components/Quizzes/SavedQuizzesPage";

export const Route = createFileRoute("/quizzes/")({
  component: SavedQuizzesPage,
});
