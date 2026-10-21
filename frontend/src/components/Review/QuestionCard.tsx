import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Pencil, RefreshCw, Trash2 } from "lucide-react";

import { generateQuestionMutation } from "@/client/@tanstack/react-query.gen";
import type { QuestionGenerateRequest } from "@/client";
import { QuestionContent } from "@/components/Common/QuestionContent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useDraftQuizStore, type DraftQuestion } from "@/stores/draftQuizStore";
import { QuestionEditor } from "./QuestionEditor";
import type { QuestionValues } from "./questionSchema";

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
          <QuestionContent question={question} showAnswer={true} />
        )}
      </div>
    </li>
  );
}
