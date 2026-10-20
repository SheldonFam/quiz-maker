import { useQuery } from "@tanstack/react-query";

import { readCurriculumOptions } from "@/client/@tanstack/react-query.gen";

export function NewQuizPage() {
  const curriculumQuery = useQuery(readCurriculumOptions());

  return (
    <div>
      <h1 className="text-2xl font-semibold">New quiz</h1>
      <p className="mt-2 text-gray-600">The quiz form goes here (step 3).</p>

      {curriculumQuery.isPending && <p className="mt-4">Loading levels...</p>}
      {curriculumQuery.isError && <p className="mt-4">Could not load the levels.</p>}
      {curriculumQuery.isSuccess && (
        <ul className="mt-4 list-disc pl-6">
          {curriculumQuery.data.data.map((level) => (
            <li key={level.name}>
              {level.name} ({level.curriculum})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
