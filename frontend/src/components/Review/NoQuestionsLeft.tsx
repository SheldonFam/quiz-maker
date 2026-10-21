import { Link } from "@tanstack/react-router";
import { ListX } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function NoQuestionsLeft() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ListX />
        </EmptyMedia>
        <EmptyTitle>
          <h2>No questions left</h2>
        </EmptyTitle>
        <EmptyDescription>
          You deleted every question. Create a new quiz to start again.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link to="/" className={buttonVariants()}>
          Create a new quiz
        </Link>
      </EmptyContent>
    </Empty>
  );
}
