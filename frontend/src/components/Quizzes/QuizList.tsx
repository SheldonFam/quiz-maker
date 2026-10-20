import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import type { QuizPublic } from "@/client";

const dateFormat = new Intl.DateTimeFormat("en-MY", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

type QuizListProps = {
  quizzes: QuizPublic[];
};

export function QuizList({ quizzes }: QuizListProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-card shadow-xs ring-1 ring-edge">
      <div className="hidden grid-cols-[1fr_7rem_6rem_7rem_1.25rem] gap-4 border-b border-input px-6 py-3 text-sm font-semibold sm:grid">
        <span>Quiz</span>
        <span>Level</span>
        <span>Questions</span>
        <span>Saved</span>
        <span />
      </div>
      <ul className="divide-y divide-border">
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            <Link
              to="/quizzes/$quizId"
              params={{ quizId: String(quiz.id) }}
              className="grid grid-cols-[1fr_1.25rem] items-center gap-x-4 gap-y-1 px-4 py-3.5 transition-colors duration-150 hover:bg-surface-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring sm:grid-cols-[1fr_7rem_6rem_7rem_1.25rem] sm:px-6"
            >
              <span className="min-w-0">
                <span className="block truncate font-semibold">
                  {quiz.title}
                </span>
                <span className="block truncate text-sm text-muted-foreground">
                  {quiz.subject} · {quiz.topic}
                </span>
              </span>
              <span className="hidden text-ink-muted sm:block">
                {quiz.level}
              </span>
              <span className="hidden text-ink-muted tabular-nums sm:block">
                {quiz.questions.length}
              </span>
              <span className="hidden text-ink-muted tabular-nums sm:block">
                {dateFormat.format(new Date(quiz.created_at))}
              </span>
              <ChevronRight
                className="size-5 text-icon sm:col-start-5"
                aria-hidden="true"
              />
              <span className="col-span-2 text-sm text-muted-foreground tabular-nums sm:hidden">
                {quiz.level} · {quiz.questions.length} questions ·{" "}
                {dateFormat.format(new Date(quiz.created_at))}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
