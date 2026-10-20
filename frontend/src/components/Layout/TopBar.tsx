import { Link } from "@tanstack/react-router";

const navLinkClassName =
  "rounded-md px-3 py-2 text-sm font-medium text-ink-muted transition-colors duration-150 hover:bg-muted hover:text-foreground [&.active]:bg-muted [&.active]:font-semibold [&.active]:text-foreground";

export function TopBar() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-card print:hidden">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-base font-semibold"
        >
          <span className="size-6 rounded-lg bg-primary" aria-hidden="true" />
          Quiz Maker
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className={navLinkClassName}
          >
            New quiz
          </Link>
          <Link to="/quizzes" className={navLinkClassName}>
            Saved quizzes
          </Link>
        </nav>
      </div>
    </header>
  );
}
