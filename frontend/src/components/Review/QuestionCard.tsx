import { useMutation } from "@tanstack/react-query";
import { Pencil, RefreshCw, Trash2 } from "lucide-react";

import { generateQuestionMutation } from "@/client/@tanstack/react-query.gen";
import type { QuestionGenerateRequest } from "@/client";
import { QuestionContent } from "@/components/Common/QuestionContent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { useDraftQuizStore, type DraftQuestion } from "@/stores/draftQuizStore";
import { QuestionEditor } from "./QuestionEditor";
import type { QuestionValues } from "./questionSchema";

const cardActionClassName = "max-sm:size-10 max-sm:px-0";

type QuestionCardProps = {
  question: DraftQuestion;
  position: number;
  questionRequest: QuestionGenerateRequest;
};

export function QuestionCard({
  question,
  position,
  questionRequest,
}: QuestionCardProps) {
  const editingQuestionId = useDraftQuizStore(
    (state) => state.editingQuestionId,
  );
  const startEditing = useDraftQuizStore((state) => state.startEditing);
  const stopEditing = useDraftQuizStore((state) => state.stopEditing);
  const replaceQuestion = useDraftQuizStore((state) => state.replaceQuestion);
  const updateQuestion = useDraftQuizStore((state) => state.updateQuestion);
  const deleteQuestion = useDraftQuizStore((state) => state.deleteQuestion);
  const restoreQuestion = useDraftQuizStore((state) => state.restoreQuestion);
  const generateQuestion = useMutation(generateQuestionMutation());

  const questionNumber = position + 1;
  const isEditing = editingQuestionId === question.id;
  const isAnotherQuestionOpen = editingQuestionId !== null && !isEditing;

  const handleNewVersion = () => {
    generateQuestion.mutate(
      { body: questionRequest },
      {
        onSuccess: (newQuestion) => {
          replaceQuestion(question.id, newQuestion);
        },
        onError: () => {
          toast.add({
            title: "Couldn't write a new version. Try again.",
            type: "error",
          });
        },
      },
    );
  };

  const handleSaveEdit = (values: QuestionValues) => {
    updateQuestion(question.id, values);
    stopEditing();
  };

  const handleDelete = () => {
    deleteQuestion(question.id);
    const toastId = toast.add({
      title: "Question deleted",
      actionProps: {
        children: "Undo",
        onClick: () => {
          restoreQuestion(question, position);
          toast.close(toastId);
        },
      },
    });
  };

  return (
    <li>
      <Card
        className={
          isEditing ? "gap-0 py-0 shadow-lg ring-2 ring-primary" : "gap-0 py-0"
        }
      >
        <CardHeader className="items-center gap-2 border-b border-border px-4 py-2 [.border-b]:pb-2 sm:gap-3 sm:px-6 sm:py-2.5 sm:[.border-b]:pb-2.5">
          <CardTitle className="flex min-w-0 items-center gap-2">
            <h2 className="text-sm font-semibold whitespace-nowrap tabular-nums">
              Question {questionNumber}
            </h2>
            {question.edited ? (
              <Badge>Edited</Badge>
            ) : (
              <Badge variant="secondary">AI draft</Badge>
            )}
          </CardTitle>
          {!isEditing && (
            <CardAction className="row-span-1 flex shrink-0 items-center gap-1 self-center">
              <Button
                variant="ghost"
                size="sm"
                className={cardActionClassName}
                aria-label={`Edit question ${questionNumber}`}
                onClick={() => startEditing(question.id)}
                disabled={isAnotherQuestionOpen}
              >
                <Pencil />
                <span className="sr-only sm:not-sr-only">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cardActionClassName}
                aria-label={`New version of question ${questionNumber}`}
                onClick={handleNewVersion}
                disabled={generateQuestion.isPending}
                focusableWhenDisabled
              >
                <RefreshCw
                  className={
                    generateQuestion.isPending
                      ? "animate-spin motion-reduce:animate-none"
                      : undefined
                  }
                />
                <span className="sr-only sm:not-sr-only">
                  {generateQuestion.isPending ? "Writing..." : "New version"}
                </span>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className={cardActionClassName}
                aria-label={`Delete question ${questionNumber}`}
                onClick={handleDelete}
              >
                <Trash2 />
                <span className="sr-only sm:not-sr-only">Delete</span>
              </Button>
            </CardAction>
          )}
        </CardHeader>

        <CardContent className="gap-0 px-4 pt-5 pb-6 sm:px-6">
          {isEditing ? (
            <QuestionEditor
              question={question}
              onSave={handleSaveEdit}
              onCancel={stopEditing}
            />
          ) : (
            <QuestionContent question={question} showAnswer={true} />
          )}
        </CardContent>
      </Card>
    </li>
  );
}
