import type { QuizPublic } from "@/client";

const optionLetters = ["A", "B", "C", "D"];

type PaperSheetProps = {
  quiz: QuizPublic;
  copy: "student" | "teacher";
};

export function PaperSheet({ quiz, copy }: PaperSheetProps) {
  const isTeacherCopy = copy === "teacher";
  const copyLabel = isTeacherCopy ? "Teacher copy" : "Student copy";

  return (
    <article
      aria-label={copyLabel}
      className="flex w-full max-w-160 flex-col bg-paper px-[8%] py-[7%] text-[12.5px] leading-[1.45] text-paper-ink shadow-xl ring-1 ring-black/5 [color-scheme:light] [print-color-adjust:exact] sm:aspect-[210/297] print:max-w-none print:break-before-page print:p-0 print:shadow-none print:ring-0 print:first:break-before-auto sm:print:aspect-auto"
    >
      <div className="mb-3.5 flex items-start justify-between gap-3 border-b-[1.5px] border-paper-ink pb-2.5">
        <div>
          <h2 className="text-[18px] font-bold tracking-[-0.01em]">
            {quiz.title}
          </h2>
          <p className="text-[11px] text-paper-muted tabular-nums">
            {quiz.level} · {quiz.subject} · {quiz.questions.length} questions ·{" "}
            {isTeacherCopy
              ? "Correct answers filled in"
              : "Circle one answer for each question"}
          </p>
        </div>
        <p className="text-[11px] whitespace-nowrap text-paper-muted">
          {copyLabel}
        </p>
      </div>

      {!isTeacherCopy && (
        <div className="mb-4 grid grid-cols-[2fr_1fr_1fr] gap-3.5 text-[11px]">
          <span className="border-b border-paper-line pb-3.5">Name</span>
          <span className="border-b border-paper-line pb-3.5">Class</span>
          <span className="border-b border-paper-line pb-3.5">Date</span>
        </div>
      )}

      <ol className="grid gap-3">
        {quiz.questions.map((question, position) => (
          <li key={question.id} className="break-inside-avoid">
            <p className="flex gap-2 font-semibold">
              <span className="w-4.5 shrink-0 tabular-nums">
                {position + 1}.
              </span>
              {question.text}
            </p>

            <div className="mt-1 grid grid-cols-1 gap-x-4 gap-y-0.75 pl-6.5 sm:grid-cols-2">
              {question.options.map((option, optionIndex) => {
                const isAnswer =
                  isTeacherCopy && optionIndex === question.correct_index;

                return (
                  <span
                    key={optionIndex}
                    className={
                      isAnswer
                        ? "flex items-center gap-2 font-bold"
                        : "flex items-center gap-2"
                    }
                  >
                    <span
                      className={
                        isAnswer
                          ? "grid size-4 shrink-0 place-items-center rounded-full border-[1.2px] border-paper-ink bg-paper-ink text-[9px] leading-none font-semibold text-paper"
                          : "grid size-4 shrink-0 place-items-center rounded-full border-[1.2px] border-paper-ink text-[9px] leading-none font-semibold"
                      }
                    >
                      {optionLetters[optionIndex]}
                    </span>
                    {option}
                    {isAnswer && (
                      <span className="sr-only"> (correct answer)</span>
                    )}
                  </span>
                );
              })}
            </div>

            {isTeacherCopy && (
              <p className="mt-1.5 ml-6.5 text-[11.5px] text-paper-muted">
                <span className="font-semibold text-paper-ink">Why: </span>
                {question.explanation}
              </p>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-auto flex justify-between pt-2.5 text-[10px] text-paper-muted">
        <span>{quiz.title}</span>
        <span>{copyLabel}</span>
      </div>
    </article>
  );
}
