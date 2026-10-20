import { useMutation, useQuery } from "@tanstack/react-query";

import {
  generateQuizMutation,
  readCurriculumOptions,
} from "@/client/@tanstack/react-query.gen";
import { NewQuizForm } from "./NewQuizForm";
import type { NewQuizValues } from "./newQuizSchema";
import { GeneratingQuiz } from "./GeneratingQuiz";

export function NewQuizPage() {
  const curriculumQuery = useQuery(readCurriculumOptions());
  const generateQuiz = useMutation({
    ...generateQuizMutation(),
    onSuccess: (quiz) => {
      console.log("Generated quiz", quiz);
    },
  });

  const handleGenerate = (values: NewQuizValues) => {
    generateQuiz.mutate({ body: values });
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

      {curriculumQuery.isPending && (
        <p className="text-ink-muted">Loading levels...</p>
      )}
      {curriculumQuery.isError && (
        <p className="text-destructive">
          Couldn't load the levels. Is the backend running?
        </p>
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
