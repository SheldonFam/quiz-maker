import { Link } from "@tanstack/react-router";
import { FilePlus2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function NoQuizToReview() {
  return (
    <Empty className="mx-auto max-w-3xl">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FilePlus2 />
        </EmptyMedia>
        <EmptyTitle>
          <h1>No quiz to review</h1>
        </EmptyTitle>
        <EmptyDescription>
          Create a quiz first, then check it here.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button nativeButton={false} render={<Link to="/" />}>
          Create a quiz
        </Button>
      </EmptyContent>
    </Empty>
  );
}
