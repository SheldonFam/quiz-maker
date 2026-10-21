import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Link, getRouteApi } from "@tanstack/react-router";
import { FileText, SearchX } from "lucide-react";

import {
  readCurriculumOptions,
  readQuizzesOptions,
} from "@/client/@tanstack/react-query.gen";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { QuizFilters } from "./QuizFilters";
import { QuizList } from "./QuizList";
import { QuizListError } from "./QuizListError";
import { QuizListLoading } from "./QuizListLoading";

const routeApi = getRouteApi("/quizzes/");

export function SavedQuizzesPage() {
  const { search, level } = routeApi.useSearch();

  const navigate = routeApi.useNavigate();

  const quizzesQuery = useQuery({
    ...readQuizzesOptions({ query: { search, level } }),
    placeholderData: keepPreviousData,
  });

  const curriculumQuery = useQuery(readCurriculumOptions());

  const levelNames =
    curriculumQuery.data?.data.map((curriculumLevel) => curriculumLevel.name) ??
    [];

  const hasFilters = search !== undefined || level !== undefined;

  const handleSearchChange = (newSearch: string) => {
    navigate({
      search: (previous) => ({
        ...previous,
        search: newSearch === "" ? undefined : newSearch,
      }),
      replace: true,
    });
  };

  const handleClearFilters = async () => {
    await navigate({ search: {}, replace: true });
    document.getElementById("quiz-search")?.focus();
  };

  const handleLevelChange = (newLevel: string) => {
    navigate({
      search: (previous) => ({
        ...previous,
        level: newLevel === "" ? undefined : newLevel,
      }),
      replace: true,
    });
  };

  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Saved quizzes</h1>
          <p className="mt-1 text-ink-muted tabular-nums">
            {quizzesQuery.isSuccess
              ? `${quizzesQuery.data.count} ${quizzesQuery.data.count === 1 ? "quiz" : "quizzes"}`
              : "Your saved quizzes"}
          </p>
        </div>
        <Button nativeButton={false} render={<Link to="/" />}>
          New quiz
        </Button>
      </div>

      <div className="mb-4">
        <QuizFilters
          search={search ?? ""}
          level={level ?? ""}
          levelNames={levelNames}
          onSearchChange={handleSearchChange}
          onLevelChange={handleLevelChange}
        />
      </div>

      {quizzesQuery.isPending && <QuizListLoading />}

      {quizzesQuery.isError && (
        <QuizListError onRetry={() => quizzesQuery.refetch()} />
      )}

      {quizzesQuery.isSuccess && quizzesQuery.data.count === 0 && (
        <Empty>
          {hasFilters ? (
            <>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <SearchX />
                </EmptyMedia>
                <EmptyTitle>No quizzes match your search</EmptyTitle>
                <EmptyDescription>
                  Try another word, or show every quiz again.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear filters
                </Button>
              </EmptyContent>
            </>
          ) : (
            <>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileText />
                </EmptyMedia>
                <EmptyTitle>No saved quizzes yet</EmptyTitle>
                <EmptyDescription>
                  Create a quiz, check it, then save it here.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button nativeButton={false} render={<Link to="/" />}>
                  Create a quiz
                </Button>
              </EmptyContent>
            </>
          )}
        </Empty>
      )}

      {quizzesQuery.isSuccess && quizzesQuery.data.count > 0 && (
        <QuizList quizzes={quizzesQuery.data.data} />
      )}
    </div>
  );
}
