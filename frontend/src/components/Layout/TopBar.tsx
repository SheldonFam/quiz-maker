import { Link } from "@tanstack/react-router";

export function TopBar() {
  return (
    <header className="border-b border-gray-200 bg-white print:hidden">
      <nav className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
        <span className="font-semibold">Quiz Maker</span>
        <Link
          to="/"
          activeOptions={{ exact: true }}
          className="text-sm text-gray-600 [&.active]:font-semibold [&.active]:text-indigo-600"
        >
          New quiz
        </Link>
        <Link
          to="/quizzes"
          className="text-sm text-gray-600 [&.active]:font-semibold [&.active]:text-indigo-600"
        >
          Saved quizzes
        </Link>
      </nav>
    </header>
  );
}
