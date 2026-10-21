import { useMutation, useQuery } from "@tanstack/react-query";

import {
  generateQuizMutation,
  readCurriculumOptions,
} from "@/client/@tanstack/react-query.gen";
import { LoadError } from "@/components/Common/LoadError";
import { NewQuizForm } from "./NewQuizForm";
import { NewQuizFormLoading } from "./NewQuizFormLoading";
import type { NewQuizValues } from "./newQuizSchema";
import { GeneratingQuiz } from "./GeneratingQuiz";
import { useNavigate } from "@tanstack/react-router";
import { useDraftQuizStore } from "@/stores/draftQuizStore";

export function NewQuizPage() {
  const navigate = useNavigate();
  const startDraft = useDraftQuizStore((state) => state.startDraft);
  const curriculumQuery = useQuery(readCurriculumOptions());
  const generateQuiz = useMutation(generateQuizMutation());

  const handleGenerate = (values: NewQuizValues) => {
    generateQuiz.mutate(
      { body: values },
      {
        onSuccess: (quiz) => {
          startDraft(quiz);
          navigate({ to: "/review" });
        },
      },
    );
  };

  const handleCancel = () => {
    generateQuiz.reset();
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">New quiz</h1>
        <p className="mt-1 text-ink-muted">
          Pick a level, subject and topic. You can check and change every
          question before saving.
        </p>
      </div>

      {curriculumQuery.isPending && <NewQuizFormLoading />}
      {curriculumQuery.isError && (
        <LoadError
          title="Couldn't load the levels"
          onRetry={() => curriculumQuery.refetch()}
        />
      )}
      {curriculumQuery.isSuccess && (
        <>
          <div hidden={generateQuiz.isPending}>
            <NewQuizForm
              levels={curriculumQuery.data.data}
              hasError={generateQuiz.isError}
              onGenerate={handleGenerate}
            />
          </div>
          {generateQuiz.isPending && (
            <GeneratingQuiz
              questionCount={generateQuiz.variables.body.question_count}
              topic={generateQuiz.variables.body.topic}
              onCancel={handleCancel}
            />
          )}
        </>
      )}
    </div>
  );
}
