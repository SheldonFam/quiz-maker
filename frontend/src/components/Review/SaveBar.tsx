import { useState } from "react";

import { ConfirmDialog } from "@/components/Common/ConfirmDialog";
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
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);

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
          <Button
            variant="ghost"
            onClick={() => setIsDiscardDialogOpen(true)}
            disabled={isSaving}
          >
            {discardLabel}
          </Button>
          <ConfirmDialog
            open={isDiscardDialogOpen}
            onOpenChange={setIsDiscardDialogOpen}
            title={discardTitle}
            description={discardDescription}
            confirmLabel={discardLabel}
            cancelLabel="Keep editing"
            onConfirm={onDiscard}
          />
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
