import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, getRouteApi, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Pencil, Printer, Trash2 } from "lucide-react";

import {
  deleteQuizMutation,
  readQuizOptions,
  readQuizzesQueryKey,
} from "@/client/@tanstack/react-query.gen";
import { QuestionContent } from "@/components/Common/QuestionContent";
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
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useDraftQuizStore } from "@/stores/draftQuizStore";
import { ShowAnswersSwitch } from "./ShowAnswersSwitch";

const routeApi = getRouteApi("/quizzes/$quizId/");

const languageLabels = {
  en: "English",
  ms: "Bahasa Melayu",
};

const dateFormat = new Intl.DateTimeFormat("en-MY", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function QuizPage() {
  const { quizId } = routeApi.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const startDraft = useDraftQuizStore((state) => state.startDraft);
  const [showAnswers, setShowAnswers] = useState(false);

  const quizQuery = useQuery(
    readQuizOptions({ path: { quiz_id: Number(quizId) } }),
  );

  const deleteQuiz = useMutation({
    ...deleteQuizMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: readQuizzesQueryKey() });
    },
  });

  if (quizQuery.isPending) {
    return (
      <div className="mx-auto max-w-3xl space-y-4" aria-hidden="true">
        <div className="h-8 w-1/2 animate-pulse rounded-full bg-muted motion-reduce:animate-none" />
        <div className="h-48 animate-pulse rounded-xl bg-muted motion-reduce:animate-none" />
      </div>
    );
  }

  if (quizQuery.isError) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl bg-card px-6 py-12 text-center shadow-xs ring-1 ring-edge">
        <h1 className="text-lg font-semibold">Quiz not found</h1>
        <p className="mt-1 text-ink-muted">It may have been deleted.</p>
        <Link
          to="/quizzes"
          className="mt-4 inline-block font-semibold text-link hover:underline"
        >
          Back to saved quizzes
        </Link>
      </div>
    );
  }

  const quiz = quizQuery.data;

  const handleEdit = async () => {
    startDraft(quiz, quiz.id);
    await navigate({ to: "/review" });
  };

  const handleDelete = () => {
    deleteQuiz.mutate(
      { path: { quiz_id: quiz.id } },
      {
        onSuccess: async () => {
          toast.add({ title: "Quiz deleted", type: "success" });
          await navigate({ to: "/quizzes" });
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/quizzes"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Saved quizzes
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{quiz.title}</h1>
        <p className="mt-1 text-ink-muted tabular-nums">
          {quiz.level} · {quiz.subject} · {quiz.questions.length} questions ·{" "}
          {languageLabels[quiz.language]} · Saved{" "}
          {dateFormat.format(new Date(quiz.created_at))}
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ShowAnswersSwitch checked={showAnswers} onChange={setShowAnswers} />
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Pencil />
            Edit
          </Button>
          <Link
            to="/quizzes/$quizId/print"
            params={{ quizId: String(quiz.id) }}
            className={buttonVariants({ variant: "outline" })}
          >
            <Printer />
            Print
          </Link>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="destructive">
                  <Trash2 />
                  Delete
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this quiz?</AlertDialogTitle>
                <AlertDialogDescription>
                  "{quiz.title}" will be deleted. This can't be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleteQuiz.isPending}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-background hover:bg-destructive/90 hover:text-background"
                  onClick={handleDelete}
                  disabled={deleteQuiz.isPending}
                >
                  {deleteQuiz.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <ol className="space-y-4">
        {quiz.questions.map((question, position) => (
          <li
            key={question.id}
            className="rounded-xl bg-card px-4 pt-4 pb-6 shadow-xs ring-1 ring-edge sm:px-6"
          >
            <p className="mb-2 text-sm font-semibold text-ink-muted tabular-nums">
              Question {position + 1}
            </p>
            <QuestionContent question={question} showAnswer={showAnswers} />
          </li>
        ))}
      </ol>
    </div>
  );
}
