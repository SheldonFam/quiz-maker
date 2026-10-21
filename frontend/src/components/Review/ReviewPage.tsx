import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import type { QuizPublic } from "@/client";
import {
  createQuizMutation,
  readQuizQueryKey,
  readQuizzesQueryKey,
  updateQuizMutation,
} from "@/client/@tanstack/react-query.gen";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { toQuizCreate, useDraftQuizStore } from "@/stores/draftQuizStore";
import { NoQuestionsLeft } from "./NoQuestionsLeft";
import { NoQuizToReview } from "./NoQuizToReview";
import { QuestionCard } from "./QuestionCard";
import { SaveBar } from "./SaveBar";

const languageLabels = {
  en: "English",
  ms: "Bahasa Melayu",
};

export function ReviewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const draftQuiz = useDraftQuizStore((state) => state.draftQuiz);
  const editingQuestionId = useDraftQuizStore(
    (state) => state.editingQuestionId,
  );
  const clearDraft = useDraftQuizStore((state) => state.clearDraft);

  const createQuiz = useMutation({
    ...createQuizMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: readQuizzesQueryKey() });
    },
  });

  const updateQuiz = useMutation({
    ...updateQuizMutation(),
    onSuccess: (savedQuiz) => {
      queryClient.invalidateQueries({ queryKey: readQuizzesQueryKey() });
      queryClient.invalidateQueries({
        queryKey: readQuizQueryKey({ path: { quiz_id: savedQuiz.id } }),
      });
    },
  });

  if (draftQuiz === null) {
    return <NoQuizToReview />;
  }

  const questionRequest = {
    level: draftQuiz.level,
    subject: draftQuiz.subject,
    topic: draftQuiz.topic,
    language: draftQuiz.language,
  };

  const savedQuizId =
    typeof draftQuiz.savedQuizId === "number" ? draftQuiz.savedQuizId : null;

  const editedCount = draftQuiz.questions.filter(
    (question) => question.edited,
  ).length;

  const editingPosition = draftQuiz.questions.findIndex(
    (question) => question.id === editingQuestionId,
  );
  const editingQuestionNumber =
    editingPosition === -1 ? null : editingPosition + 1;

  const showSavedQuiz = async (savedQuiz: QuizPublic) => {
    toast.add({
      title: savedQuizId === null ? "Quiz saved" : "Changes saved",
      type: "success",
    });
    await navigate({
      to: "/quizzes/$quizId",
      params: { quizId: String(savedQuiz.id) },
    });
    clearDraft();
  };

  const handleSave = () => {
    const body = toQuizCreate(draftQuiz);

    if (savedQuizId === null) {
      createQuiz.mutate({ body }, { onSuccess: showSavedQuiz });
    } else {
      updateQuiz.mutate(
        { path: { quiz_id: savedQuizId }, body },
        { onSuccess: showSavedQuiz },
      );
    }
  };

  const handleDiscard = async () => {
    if (savedQuizId === null) {
      await navigate({ to: "/" });
    } else {
      await navigate({
        to: "/quizzes/$quizId",
        params: { quizId: String(savedQuizId) },
      });
    }
    clearDraft();
  };

  return (
    <div className="mx-auto max-w-3xl pb-24">
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {draftQuiz.title}
          </h1>
          {savedQuizId !== null && <Badge>Editing saved quiz</Badge>}
        </div>
        <p className="mt-1 text-ink-muted tabular-nums">
          {draftQuiz.level} · {draftQuiz.subject} · {draftQuiz.questions.length}{" "}
          questions · {languageLabels[draftQuiz.language]}
        </p>
      </div>

      {draftQuiz.questions.length === 0 ? (
        <NoQuestionsLeft />
      ) : (
        <ol className="space-y-4">
          {draftQuiz.questions.map((question, position) => (
            <QuestionCard
              key={question.id}
              question={question}
              position={position}
              questionRequest={questionRequest}
            />
          ))}
        </ol>
      )}

      <SaveBar
        questionCount={draftQuiz.questions.length}
        editedCount={editedCount}
        editingQuestionNumber={editingQuestionNumber}
        isSavedQuiz={savedQuizId !== null}
        isSaving={createQuiz.isPending || updateQuiz.isPending}
        hasError={createQuiz.isError || updateQuiz.isError}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />
    </div>
  );
}
