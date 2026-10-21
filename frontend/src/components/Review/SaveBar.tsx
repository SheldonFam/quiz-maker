import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type SaveBarProps = {
  questionCount: number;
  editedCount: number;
  editingQuestionNumber: number | null;
  isSavedQuiz: boolean;
  isSaving: boolean;
  hasError: boolean;
  onSave: () => void;
  onDiscard: () => void;
};

export function SaveBar({
  questionCount,
  editedCount,
  editingQuestionNumber,
  isSavedQuiz,
  isSaving,
  hasError,
  onSave,
  onDiscard,
}: SaveBarProps) {
  const isEditingQuestion = editingQuestionNumber !== null;
  const saveLabel = isSavedQuiz ? "Save changes" : "Save quiz";
  const discardLabel = isSavedQuiz ? "Discard changes" : "Discard draft";

  const discardTitle = isSavedQuiz
    ? "Discard your changes?"
    : "Discard this draft?";
  const discardDescription = isSavedQuiz
    ? "The saved quiz stays as it was before you started editing."
    : `All ${questionCount} questions will be removed. This can't be undone.`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-card shadow-[0_-8px_24px_-12px_rgb(0_0_0/0.12)] print:hidden">
      <div className="mx-auto flex min-h-17 max-w-3xl items-center justify-between gap-4 px-4 py-3">
        <p role="status" className="text-sm text-ink-muted tabular-nums">
          {hasError && (
            <span className="text-destructive">
              Couldn't save the quiz. Try again.
            </span>
          )}
          {!hasError && isEditingQuestion && (
            <span className="font-medium text-foreground">
              Finish editing question {editingQuestionNumber} first
            </span>
          )}
          {!hasError && !isEditingQuestion && (
            <>
              <span className="font-semibold whitespace-nowrap text-foreground">
                {questionCount} questions
              </span>
              <span className="max-sm:hidden">
                {" "}
                ·{" "}
                {editedCount === 0
                  ? "none edited yet"
                  : `${editedCount} edited by you`}
              </span>
            </>
          )}
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="ghost" disabled={isSaving}>
                  {discardLabel}
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{discardTitle}</AlertDialogTitle>
                <AlertDialogDescription>
                  {discardDescription}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep editing</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-background hover:bg-destructive/90 hover:text-background"
                  onClick={onDiscard}
                >
                  {discardLabel}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            onClick={onSave}
            disabled={isSaving || questionCount === 0 || isEditingQuestion}
          >
            {isSaving && <Spinner aria-hidden="true" />}
            {isSaving ? "Saving..." : saveLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
