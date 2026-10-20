import { getRouteApi } from "@tanstack/react-router";

const routeApi = getRouteApi("/quizzes/$quizId/print");

export function PrintQuizPage() {
  const { quizId } = routeApi.useParams();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Print quiz {quizId}</h1>
      <p className="mt-2 text-ink-muted">
        Student copy, teacher copy and both go here (step 10).
      </p>
    </div>
  );
}
