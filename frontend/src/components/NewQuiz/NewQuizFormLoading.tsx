import { Skeleton } from "@/components/ui/skeleton";

export function NewQuizFormLoading() {
  return (
    <div
      className="space-y-7 rounded-xl bg-card p-5 shadow-xs ring-1 ring-edge sm:p-8"
      aria-busy="true"
    >
      <span className="sr-only" role="status">
        Loading levels...
      </span>
      <div className="grid gap-6 sm:grid-cols-2">
        <Skeleton className="h-15 rounded-lg" />
        <Skeleton className="h-15 rounded-lg" />
      </div>
      <Skeleton className="h-18 rounded-lg" />
      <div className="grid gap-6 sm:grid-cols-2">
        <Skeleton className="h-15 rounded-lg" />
        <Skeleton className="h-15 rounded-lg" />
      </div>
    </div>
  );
}
