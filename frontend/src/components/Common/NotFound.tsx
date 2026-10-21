import { Link } from "@tanstack/react-router";
import { MapPinOff } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function NotFound() {
  return (
    <Empty className="mx-auto max-w-3xl">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MapPinOff />
        </EmptyMedia>
        <EmptyTitle>
          <h1>Page not found</h1>
        </EmptyTitle>
        <EmptyDescription>
          This link doesn't go anywhere in Quiz Maker.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link to="/" className={buttonVariants()}>
          Create a quiz
        </Link>
      </EmptyContent>
    </Empty>
  );
}
