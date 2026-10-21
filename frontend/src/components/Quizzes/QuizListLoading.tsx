import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function QuizListLoading() {
  return (
    <Card className="gap-2 p-4" aria-busy="true">
      <span className="sr-only" role="status">
        Loading quizzes...
      </span>
      {Array.from({ length: 3 }, (_, index) => (
        <Skeleton key={index} className="h-12 rounded-lg" />
      ))}
    </Card>
  );
}
