import { useQuery } from "@tanstack/react-query";
import { Link, getRouteApi } from "@tanstack/react-router";
import { ArrowLeft, Printer } from "lucide-react";

import { readQuizOptions } from "@/client/@tanstack/react-query.gen";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaperSheet } from "./PaperSheet";
import type { Copy } from "./copyOptions";

const routeApi = getRouteApi("/quizzes/$quizId/print");

export function PrintQuizPage() {
  const { quizId } = routeApi.useParams();

  const { copy = "student" } = routeApi.useSearch();
  const navigate = routeApi.useNavigate();

  const quizQuery = useQuery(
    readQuizOptions({ path: { quiz_id: Number(quizId) } }),
  );

  const handleCopyChange = (newCopy: Copy) => {
    navigate({
      search: { copy: newCopy === "student" ? undefined : newCopy },
      replace: true,
    });
  };

  if (quizQuery.isPending) {
    return (
      <div className="mx-auto max-w-3xl space-y-4" aria-hidden="true">
        <div className="h-8 w-1/2 animate-pulse rounded-full bg-muted motion-reduce:animate-none" />
        <div className="h-96 animate-pulse rounded-xl bg-muted motion-reduce:animate-none" />
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
  const showStudentCopy = copy !== "teacher";
  const showTeacherCopy = copy !== "student";

  return (
    <div className="mx-auto max-w-3xl">
      <div className="print:hidden">
        <Link
          to="/quizzes/$quizId"
          params={{ quizId: String(quiz.id) }}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {quiz.title}
        </Link>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Print preview</h1>
          <div className="flex flex-wrap items-center gap-3">
            <Tabs value={copy} onValueChange={handleCopyChange}>
              <TabsList aria-label="Pages to print" activateOnFocus>
                <TabsTrigger value="student">Student copy</TabsTrigger>
                <TabsTrigger value="teacher">Teacher copy</TabsTrigger>
                <TabsTrigger value="both">Both</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button onClick={() => window.print()}>
              <Printer />
              Print
            </Button>
          </div>
        </div>
      </div>

      <div className="grid justify-items-center gap-8 rounded-xl bg-paper-desk px-4 py-10 ring-1 ring-edge print:block print:rounded-none print:bg-transparent print:p-0 print:ring-0">
        {showStudentCopy && <PaperSheet quiz={quiz} copy="student" />}
        {showTeacherCopy && <PaperSheet quiz={quiz} copy="teacher" />}
      </div>
    </div>
  );
}
