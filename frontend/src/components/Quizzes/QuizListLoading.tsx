import { Skeleton } from "@/components/ui/skeleton";

export function QuizListLoading() {
  return (
    <div
      className="space-y-2 rounded-xl bg-card p-4 shadow-xs ring-1 ring-edge"
      aria-busy="true"
    >
      <span className="sr-only" role="status">
        Loading quizzes...
      </span>
      {Array.from({ length: 3 }, (_, index) => (
        <Skeleton key={index} className="h-12 rounded-lg" />
      ))}
    </div>
  );
}
