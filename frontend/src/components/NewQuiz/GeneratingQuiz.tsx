import { Button } from "@/components/ui/button";

type GeneratingQuizProps = {
  questionCount: number;
  topic: string;
  onCancel: () => void;
};

export function GeneratingQuiz({
  questionCount,
  topic,
  onCancel,
}: GeneratingQuizProps) {
  const skeletonCardCount = Math.min(questionCount, 3);

  return (
    <div className="space-y-4">
      <div
        role="status"
        className="flex items-center justify-between gap-4 rounded-xl bg-card px-5 py-4 shadow-xs ring-1 ring-edge"
      >
        <div>
          <p className="font-semibold">
            Creating {questionCount} questions about {topic}
          </p>
          <p className="text-sm text-muted-foreground">
            This usually takes a few seconds.
          </p>
        </div>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      {Array.from({ length: skeletonCardCount }, (_, index) => (
        <SkeletonQuestionCard key={index} />
      ))}
    </div>
  );
}

function SkeletonQuestionCard() {
  return (
    <div
      aria-hidden="true"
      className="rounded-xl bg-card p-6 shadow-xs ring-1 ring-edge"
    >
      <div className="h-4 w-2/3 animate-pulse rounded-full bg-muted motion-reduce:animate-none" />
      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-10 animate-pulse rounded-lg bg-muted motion-reduce:animate-none"
          />
        ))}
      </div>
    </div>
  );
}
