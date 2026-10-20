import { Link } from "@tanstack/react-router";

export function SavedQuizzesPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Saved quizzes</h1>
      <p className="mt-2 text-gray-600">The saved list goes here (step 8).</p>
      <Link
        to="/quizzes/$quizId"
        params={{ quizId: "1" }}
        className="mt-4 inline-block text-indigo-600"
      >
        Open quiz 1 (test link)
      </Link>
    </div>
  );
}
