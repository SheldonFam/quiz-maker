import { Link, getRouteApi } from "@tanstack/react-router";

const routeApi = getRouteApi("/quizzes/$quizId/");

export function QuizPage() {
  const { quizId } = routeApi.useParams();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Quiz {quizId}</h1>
      <p className="mt-2 text-ink-muted">The quiz view goes here (step 9).</p>
      <Link
        to="/quizzes/$quizId/print"
        params={{ quizId }}
        className="mt-4 inline-block text-link"
      >
        Print
      </Link>
    </div>
  );
}
