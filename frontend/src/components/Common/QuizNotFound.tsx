import { Link } from "@tanstack/react-router";
import { FileQuestion } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function QuizNotFound() {
  return (
    <Empty className="mx-auto max-w-3xl">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileQuestion />
        </EmptyMedia>
        <EmptyTitle>
          <h1>Quiz not found</h1>
        </EmptyTitle>
        <EmptyDescription>It may have been deleted.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link to="/quizzes" className={buttonVariants()}>
          Back to saved quizzes
        </Link>
      </EmptyContent>
    </Empty>
  );
}
