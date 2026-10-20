import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Link, getRouteApi } from "@tanstack/react-router";

import {
  readCurriculumOptions,
  readQuizzesOptions,
} from "@/client/@tanstack/react-query.gen";
import { Button } from "@/components/ui/button";
import { QuizFilters } from "./QuizFilters";
import { QuizList } from "./QuizList";

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

      {quizzesQuery.isPending && (
        <div
          className="space-y-2 rounded-xl bg-card p-4 shadow-xs ring-1 ring-edge"
          aria-hidden="true"
        >
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded-lg bg-muted motion-reduce:animate-none"
            />
          ))}
        </div>
      )}

      {quizzesQuery.isError && (
        <div className="rounded-xl bg-card px-6 py-12 text-center shadow-xs ring-1 ring-edge">
          <p className="font-semibold">Couldn't load your quizzes.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => quizzesQuery.refetch()}
          >
            Try again
          </Button>
        </div>
      )}

      {quizzesQuery.isSuccess && quizzesQuery.data.count === 0 && (
        <div className="rounded-xl bg-card px-6 py-12 text-center shadow-xs ring-1 ring-edge">
          {hasFilters ? (
            <>
              <p className="font-semibold">No quizzes match your search.</p>
              <Link
                to="/quizzes"
                className="mt-2 inline-block font-semibold text-link hover:underline"
              >
                Clear filters
              </Link>
            </>
          ) : (
            <>
              <p className="font-semibold">No saved quizzes yet.</p>
              <p className="mt-1 text-ink-muted">
                Create a quiz, check it, then save it here.
              </p>
              <Link
                to="/"
                className="mt-4 inline-block font-semibold text-link hover:underline"
              >
                Create a quiz
              </Link>
            </>
          )}
        </div>
      )}

      {quizzesQuery.isSuccess && quizzesQuery.data.count > 0 && (
        <QuizList quizzes={quizzesQuery.data.data} />
      )}
    </div>
  );
}
