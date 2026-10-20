import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
      <Link to="/" className="text-link">
        Go to New quiz
      </Link>
    </div>
  );
}
