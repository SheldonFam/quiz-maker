import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <div>
      <h1 className="text-xl font-semibold">Page not found</h1>
      <Link to="/" className="text-indigo-600">
        Go to New quiz
      </Link>
    </div>
  );
}
