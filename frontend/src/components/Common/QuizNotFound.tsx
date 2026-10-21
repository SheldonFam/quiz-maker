import { Link } from "@tanstack/react-router";
import { FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";
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
        <Button nativeButton={false} render={<Link to="/quizzes" />}>
          Back to saved quizzes
        </Button>
      </EmptyContent>
    </Empty>
  );
}
