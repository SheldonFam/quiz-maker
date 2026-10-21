import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import type { QuizPublic } from "@/client";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    <Card className="gap-0 py-0">
      <Table className="table-fixed">
        <TableHeader className="hidden sm:table-header-group">
          <TableRow>
            <TableHead className="pl-6">Quiz</TableHead>
            <TableHead className="w-32">Level</TableHead>
            <TableHead className="w-28">Questions</TableHead>
            <TableHead className="w-32">Saved</TableHead>
            <TableHead className="w-13 pr-6">
              <span className="sr-only">Open</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quizzes.map((quiz) => {
            const savedDate = dateFormat.format(new Date(quiz.created_at));

            return (
              <TableRow key={quiz.id} className="relative">
                <TableCell className="py-3.5 pl-4 sm:pl-6">
                  <Link
                    to="/quizzes/$quizId"
                    params={{ quizId: String(quiz.id) }}
                    className="block truncate font-semibold outline-none after:absolute after:inset-0 focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-ring"
                  >
                    {quiz.title}
                  </Link>
                  <span className="block truncate text-muted-foreground">
                    {quiz.subject} · {quiz.topic}
                  </span>
                  <span className="mt-1 block truncate text-muted-foreground tabular-nums sm:hidden">
                    {quiz.level} · {quiz.questions.length} questions ·{" "}
                    {savedDate}
                  </span>
                </TableCell>
                <TableCell className="hidden text-ink-muted sm:table-cell">
                  {quiz.level}
                </TableCell>
                <TableCell className="hidden text-ink-muted tabular-nums sm:table-cell">
                  {quiz.questions.length}
                </TableCell>
                <TableCell className="hidden text-ink-muted tabular-nums sm:table-cell">
                  {savedDate}
                </TableCell>
                <TableCell className="w-11 pr-4 sm:w-auto sm:pr-6">
                  <ChevronRight
                    className="size-5 text-icon"
                    aria-hidden="true"
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
