import { Button } from "@/components/ui/button";

type SaveBarProps = {
  questionCount: number;
  saveLabel: string;
  isSaving: boolean;
  hasError: boolean;
  onSave: () => void;
  onDiscard: () => void;
};

export function SaveBar({
  questionCount,
  saveLabel,
  isSaving,
  hasError,
  onSave,
  onDiscard,
}: SaveBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-card shadow-[0_-8px_24px_-12px_rgb(0_0_0/0.12)] print:hidden">
      <div className="mx-auto flex min-h-17 max-w-3xl items-center justify-between gap-4 px-4 py-3">
        <p className="text-sm text-ink-muted tabular-nums">
          {hasError ? (
            <span className="text-destructive">
              Couldn't save the quiz. Try again.
            </span>
          ) : (
            `${questionCount} questions`
          )}
        </p>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onDiscard} disabled={isSaving}>
            Discard
          </Button>
          <Button onClick={onSave} disabled={isSaving || questionCount === 0}>
            {isSaving ? "Saving..." : saveLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
