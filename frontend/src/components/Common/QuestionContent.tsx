import { Check } from "lucide-react";

import type { QuestionCreate } from "@/client";

const optionLetters = ["A", "B", "C", "D"];

type QuestionContentProps = {
  question: QuestionCreate;
  showAnswer: boolean;
};

export function QuestionContent({
  question,
  showAnswer,
}: QuestionContentProps) {
  return (
    <>
      <p className="text-base font-semibold">{question.text}</p>

      <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {question.options.map((option, optionIndex) => {
          const isCorrect =
            showAnswer && optionIndex === question.correct_index;

          return (
            <li
              key={optionIndex}
              className={
                isCorrect
                  ? "flex items-center gap-3 rounded-lg bg-correct-soft px-3 py-2.5 font-semibold text-correct inset-ring inset-ring-correct-ring"
                  : "flex items-center gap-3 rounded-lg px-3 py-2.5 inset-ring inset-ring-border"
              }
            >
              <span
                className={
                  isCorrect
                    ? "flex size-6 shrink-0 items-center justify-center rounded-md bg-correct-strong text-xs font-semibold text-correct-foreground"
                    : "flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-ink-muted"
                }
              >
                {optionLetters[optionIndex]}
              </span>
              <span className="flex-1">{option}</span>
              {isCorrect && (
                <Check className="size-4" aria-label="Correct answer" />
              )}
            </li>
          );
        })}
      </ul>

      {showAnswer && (
        <div className="mt-4 rounded-lg bg-surface-hover px-4 py-3 text-sm text-ink-muted inset-ring inset-ring-border">
          <span className="font-semibold text-foreground">Explanation: </span>
          {question.explanation}
        </div>
      )}
    </>
  );
}
