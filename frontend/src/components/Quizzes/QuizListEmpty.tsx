import { Link } from "@tanstack/react-router";
import { FileText, SearchX } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

type QuizListEmptyProps = {
  hasFilters: boolean;
  onClearFilters: () => void;
};

export function QuizListEmpty({
  hasFilters,
  onClearFilters,
}: QuizListEmptyProps) {
  return (
    <Empty>
      {hasFilters ? (
        <>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchX />
            </EmptyMedia>
            <EmptyTitle>No quizzes match your search</EmptyTitle>
            <EmptyDescription>
              Try another word, or show every quiz again.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" onClick={onClearFilters}>
              Clear filters
            </Button>
          </EmptyContent>
        </>
      ) : (
        <>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText />
            </EmptyMedia>
            <EmptyTitle>No saved quizzes yet</EmptyTitle>
            <EmptyDescription>
              Create a quiz, check it, then save it here.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link to="/" className={buttonVariants()}>
              Create a quiz
            </Link>
          </EmptyContent>
        </>
      )}
    </Empty>
  );
}
