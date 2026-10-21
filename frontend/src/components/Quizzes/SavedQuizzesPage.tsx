import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Link, getRouteApi } from "@tanstack/react-router";

import {
  readCurriculumOptions,
  readQuizzesOptions,
} from "@/client/@tanstack/react-query.gen";
import { LoadError } from "@/components/Common/LoadError";
import { PageHeader } from "@/components/Common/PageHeader";
import { buttonVariants } from "@/components/ui/button";
import { QuizFilters } from "./QuizFilters";
import { QuizList } from "./QuizList";
import { QuizListEmpty } from "./QuizListEmpty";
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
      <PageHeader
        title="Saved quizzes"
        description={
          quizzesQuery.isSuccess
            ? `${quizzesQuery.data.count} ${quizzesQuery.data.count === 1 ? "quiz" : "quizzes"}`
            : "Your saved quizzes"
        }
        actions={
          <Link to="/" className={buttonVariants()}>
            New quiz
          </Link>
        }
      />

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
        <LoadError
          title="Couldn't load your quizzes"
          onRetry={() => quizzesQuery.refetch()}
        />
      )}

      {quizzesQuery.isSuccess && quizzesQuery.data.count === 0 && (
        <QuizListEmpty
          hasFilters={hasFilters}
          onClearFilters={handleClearFilters}
        />
      )}

      {quizzesQuery.isSuccess && quizzesQuery.data.count > 0 && (
        <QuizList quizzes={quizzesQuery.data.data} />
      )}
    </div>
  );
}
