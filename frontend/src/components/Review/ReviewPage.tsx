import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import {
  createQuizMutation,
  readQuizzesQueryKey,
} from "@/client/@tanstack/react-query.gen";
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

  const handleSave = () => {
    createQuiz.mutate(
      { body: toQuizCreate(draftQuiz) },
      {
        onSuccess: async (savedQuiz) => {
          toast.success("Quiz saved");
          await navigate({
            to: "/quizzes/$quizId",
            params: { quizId: String(savedQuiz.id) },
          });
          clearDraft();
        },
      },
    );
  };

  const handleDiscard = async () => {
    await navigate({ to: "/" });
    clearDraft();
  };

  return (
    <div className="mx-auto max-w-3xl pb-24">
      <div className="mb-8">
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
        isSaving={createQuiz.isPending}
        hasError={createQuiz.isError}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />
    </div>
  );
}
