import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
      <Card
        role="status"
        className="flex-row items-center justify-between gap-4 px-5 py-4"
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
      </Card>

      {Array.from({ length: skeletonCardCount }, (_, index) => (
        <SkeletonQuestionCard key={index} />
      ))}
    </div>
  );
}

function SkeletonQuestionCard() {
  return (
    <Card aria-hidden="true" className="gap-0 p-6">
      <Skeleton className="h-4 w-2/3 rounded-full" />
      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-10 rounded-lg" />
        ))}
      </div>
    </Card>
  );
}
