import { Skeleton } from "@/components/ui/skeleton";

export function QuizLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-4" aria-busy="true">
      <span className="sr-only" role="status">
        Loading quiz...
      </span>
      <Skeleton className="h-8 w-1/2 rounded-full" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}
