import { Link } from "@tanstack/react-router";

import { useDraftQuizStore } from "@/stores/draftQuizStore";
import { QuestionCard } from "./QuestionCard";

const languageLabels = {
  en: "English",
  ms: "Bahasa Melayu",
};

export function ReviewPage() {
  const draftQuiz = useDraftQuizStore((state) => state.draftQuiz);

  if (draftQuiz === null) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl bg-card px-6 py-12 text-center shadow-xs ring-1 ring-edge">
        <h1 className="text-lg font-semibold">No quiz to review</h1>
        <p className="mt-1 text-ink-muted">
          Create a quiz first, then check it here.
        </p>
        <Link
          to="/"
          className="mt-4 inline-block font-semibold text-link hover:underline"
        >
          Create a quiz
        </Link>
      </div>
    );
  }

  const questionRequest = {
    level: draftQuiz.level,
    subject: draftQuiz.subject,
    topic: draftQuiz.topic,
    language: draftQuiz.language,
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">{draftQuiz.title}</h1>
        <p className="mt-1 text-ink-muted tabular-nums">
          {draftQuiz.level} · {draftQuiz.subject} · {draftQuiz.questions.length}{" "}
          questions · {languageLabels[draftQuiz.language]}
        </p>
      </div>

      {draftQuiz.questions.length === 0 ? (
        <p className="rounded-xl bg-card px-6 py-12 text-center text-ink-muted shadow-xs ring-1 ring-edge">
          You deleted every question. Use Undo, or create a new quiz.
        </p>
      ) : (
        <ol className="space-y-4">
          {draftQuiz.questions.map((question, position) => (
            <QuestionCard
              key={question.id}
              question={question}
              position={position}
              questionRequest={questionRequest}
            />
          ))}
        </ol>
      )}
    </div>
  );
}
