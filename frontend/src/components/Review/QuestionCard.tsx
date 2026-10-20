import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Check, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { generateQuestionMutation } from "@/client/@tanstack/react-query.gen";
import type { QuestionGenerateRequest } from "@/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDraftQuizStore, type DraftQuestion } from "@/stores/draftQuizStore";
import { QuestionEditor } from "./QuestionEditor";
import type { QuestionValues } from "./questionSchema";

const optionLetters = ["A", "B", "C", "D"];

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
  const [isEditing, setIsEditing] = useState(false);
  const replaceQuestion = useDraftQuizStore((state) => state.replaceQuestion);
  const updateQuestion = useDraftQuizStore((state) => state.updateQuestion);
  const deleteQuestion = useDraftQuizStore((state) => state.deleteQuestion);
  const restoreQuestion = useDraftQuizStore((state) => state.restoreQuestion);
  const generateQuestion = useMutation(generateQuestionMutation());

  const handleNewVersion = () => {
    generateQuestion.mutate(
      { body: questionRequest },
      {
        onSuccess: (newQuestion) => {
          replaceQuestion(question.id, newQuestion);
        },
      },
    );
  };

  const handleSaveEdit = (values: QuestionValues) => {
    updateQuestion(question.id, values);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteQuestion(question.id);
    toast("Question deleted", {
      action: {
        label: "Undo",
        onClick: () => restoreQuestion(question, position),
      },
    });
  };

  return (
    <li
      className={
        isEditing
          ? "overflow-hidden rounded-xl bg-card shadow-lg ring-2 ring-primary"
          : "overflow-hidden rounded-xl bg-card shadow-xs ring-1 ring-edge"
      }
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tabular-nums">
            Question {position + 1}
          </span>
          {question.edited ? (
            <Badge>Edited</Badge>
          ) : (
            <Badge variant="secondary">AI draft</Badge>
          )}
        </div>
        {!isEditing && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Pencil />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewVersion}
              disabled={generateQuestion.isPending}
            >
              <RefreshCw />
              {generateQuestion.isPending ? "Writing..." : "New version"}
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 />
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="px-4 pt-5 pb-6 sm:px-6">
        {isEditing ? (
          <QuestionEditor
            question={question}
            onSave={handleSaveEdit}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <p className="text-base font-semibold">{question.text}</p>

            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {question.options.map((option, optionIndex) => {
                const isCorrect = optionIndex === question.correct_index;

                return (
                  <li
                    key={optionIndex}
                    className={
                      isCorrect
                        ? "flex items-center gap-3 rounded-lg bg-correct-soft px-3 py-2.5 font-semibold text-correct inset-ring inset-ring-correct-ring"
                        : "flex items-center gap-3 rounded-lg px-3 py-2.5 inset-ring inset-ring-border"
                    }
                  >
                    <span
                      className={
                        isCorrect
                          ? "flex size-6 shrink-0 items-center justify-center rounded-md bg-correct-strong text-xs font-semibold text-correct-foreground"
                          : "flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-ink-muted"
                      }
                    >
                      {optionLetters[optionIndex]}
                    </span>
                    <span className="flex-1">{option}</span>
                    {isCorrect && (
                      <Check className="size-4" aria-label="Correct answer" />
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 rounded-lg bg-surface-hover px-4 py-3 text-sm text-ink-muted inset-ring inset-ring-border">
              <span className="font-semibold text-foreground">
                Explanation:{" "}
              </span>
              {question.explanation}
            </div>
          </>
        )}
      </div>
    </li>
  );
}
