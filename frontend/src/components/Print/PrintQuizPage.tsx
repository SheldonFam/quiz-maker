import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { Printer } from "lucide-react";

import { readQuizOptions } from "@/client/@tanstack/react-query.gen";
import { BackLink } from "@/components/Common/BackLink";
import { PageHeader } from "@/components/Common/PageHeader";
import { QuizLoading } from "@/components/Common/QuizLoading";
import { QuizNotFound } from "@/components/Common/QuizNotFound";
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
    return <QuizLoading />;
  }

  if (quizQuery.isError) {
    return <QuizNotFound />;
  }

  const quiz = quizQuery.data;
  const showStudentCopy = copy !== "teacher";
  const showTeacherCopy = copy !== "student";

  return (
    <div className="mx-auto max-w-3xl">
      <div className="print:hidden">
        <BackLink to="/quizzes/$quizId" params={{ quizId: String(quiz.id) }}>
          {quiz.title}
        </BackLink>

        <PageHeader
          title="Print preview"
          actions={
            <>
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
            </>
          }
        />
      </div>

      <div className="grid justify-items-center gap-8 rounded-xl bg-paper-desk px-4 py-10 ring-1 ring-edge print:block print:rounded-none print:bg-transparent print:p-0 print:ring-0">
        {showStudentCopy && <PaperSheet quiz={quiz} copy="student" />}
        {showTeacherCopy && <PaperSheet quiz={quiz} copy="teacher" />}
      </div>
    </div>
  );
}
