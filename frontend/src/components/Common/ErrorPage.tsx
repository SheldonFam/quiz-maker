import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function ErrorPage() {
  return (
    <Empty className="mx-auto max-w-3xl">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TriangleAlert />
        </EmptyMedia>
        <EmptyTitle>
          <h1>Something went wrong</h1>
        </EmptyTitle>
        <EmptyDescription>
          This page stopped working. Reload it to try again.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={() => window.location.reload()}>Reload page</Button>
      </EmptyContent>
    </Empty>
  );
}
