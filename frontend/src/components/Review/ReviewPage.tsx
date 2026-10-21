import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";

import type { QuizPublic } from "@/client";
import {
  createQuizMutation,
  readQuizQueryKey,
  readQuizzesQueryKey,
  updateQuizMutation,
} from "@/client/@tanstack/react-query.gen";
import { toast } from "@/components/ui/toast";
import { toQuizCreate, useDraftQuizStore } from "@/stores/draftQuizStore";
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
    return (
      <div className="mx-auto max-w-3xl rounded-xl bg-card px-6 py-12 text-center shadow-xs ring-1 ring-edge">
        <h1 className="text-lg font-semibold">No quiz to review</h1>
        <p className="mt-1 text-ink-muted">
          Create a quiz first, then check it here.
        </p>
        <Link
          to="/"
          className="mt-4 inline-block font-semibold text-link hover:underline"
        >
          Create a quiz
        </Link>
      </div>
    );
  }

  const questionRequest = {
    level: draftQuiz.level,
    subject: draftQuiz.subject,
    topic: draftQuiz.topic,
    language: draftQuiz.language,
  };

  const savedQuizId =
    typeof draftQuiz.savedQuizId === "number" ? draftQuiz.savedQuizId : null;

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
        {savedQuizId !== null && (
          <p className="mb-1 text-sm font-medium text-link">
            Editing a saved quiz
          </p>
        )}
        <h1 className="text-2xl font-bold tracking-tight">{draftQuiz.title}</h1>
        <p className="mt-1 text-ink-muted tabular-nums">
          {draftQuiz.level} · {draftQuiz.subject} · {draftQuiz.questions.length}{" "}
          questions · {languageLabels[draftQuiz.language]}
        </p>
      </div>

      {draftQuiz.questions.length === 0 ? (
        <p className="rounded-xl bg-card px-6 py-12 text-center text-ink-muted shadow-xs ring-1 ring-edge">
          You deleted every question. Use Undo, or create a new quiz.
        </p>
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
        saveLabel={savedQuizId === null ? "Save quiz" : "Save changes"}
        isSaving={createQuiz.isPending || updateQuiz.isPending}
        hasError={createQuiz.isError || updateQuiz.isError}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />
    </div>
  );
}
