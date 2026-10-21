import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, getRouteApi, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Pencil, Printer, Trash2 } from "lucide-react";

import {
  deleteQuizMutation,
  readQuizOptions,
  readQuizzesQueryKey,
} from "@/client/@tanstack/react-query.gen";
import { ConfirmDialog } from "@/components/Common/ConfirmDialog";
import { QuestionContent } from "@/components/Common/QuestionContent";
import { QuizLoading } from "@/components/Common/QuizLoading";
import { QuizNotFound } from "@/components/Common/QuizNotFound";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { useDraftQuizStore } from "@/stores/draftQuizStore";

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
    return <QuizLoading />;
  }

  if (quizQuery.isError) {
    return <QuizNotFound />;
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
        <Label className="gap-2.5">
          <Switch checked={showAnswers} onCheckedChange={setShowAnswers} />
          Show answers
        </Label>
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
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 />
            Delete
          </Button>
          <ConfirmDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            title="Delete this quiz?"
            description={`"${quiz.title}" will be deleted. This can't be undone.`}
            confirmLabel="Delete"
            pendingLabel="Deleting..."
            isPending={deleteQuiz.isPending}
            onConfirm={handleDelete}
          />
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
