import { createFileRoute } from "@tanstack/react-router";

import { ReviewPage } from "@/components/Review/ReviewPage";

export const Route = createFileRoute("/review")({
  component: ReviewPage,
});
