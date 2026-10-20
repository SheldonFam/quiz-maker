import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import type { DraftQuestion } from "@/stores/draftQuizStore";
import { questionSchema, type QuestionValues } from "./questionSchema";

const optionFields = [
  { letter: "A", name: "options.0" },
  { letter: "B", name: "options.1" },
  { letter: "C", name: "options.2" },
  { letter: "D", name: "options.3" },
] as const;

const fieldClassName =
  "w-full rounded-md bg-card px-3 py-2 text-sm text-foreground shadow-xs inset-ring inset-ring-input transition-shadow duration-150 outline-none placeholder:text-muted-foreground focus-visible:inset-ring-2 focus-visible:inset-ring-ring aria-invalid:inset-ring-destructive";

type QuestionEditorProps = {
  question: DraftQuestion;
  onSave: (values: QuestionValues) => void;
  onCancel: () => void;
};

export function QuestionEditor({
  question,
  onSave,
  onCancel,
}: QuestionEditorProps) {
  const form = useForm<QuestionValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: question.text,
      options: question.options,
      correct_index: question.correct_index,
      explanation: question.explanation,
    },
  });

  const { errors, isDirty } = form.formState;

  const handleSave = (values: QuestionValues) => {
    if (!isDirty) {
      onCancel();
      return;
    }
    onSave(values);
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSave)}
      noValidate
      className="space-y-5"
    >
      <div className="space-y-2">
        <label htmlFor={`text-${question.id}`} className="text-sm font-medium">
          Question
        </label>
        <textarea
          id={`text-${question.id}`}
          rows={2}
          aria-invalid={errors.text ? true : undefined}
          className={fieldClassName}
          {...form.register("text")}
        />
        {errors.text && (
          <p className="text-sm text-destructive">{errors.text.message}</p>
        )}
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">
          Options (pick the correct answer)
        </legend>
        <Controller
          control={form.control}
          name="correct_index"
          render={({ field }) => (
            <div className="grid gap-2.5 sm:grid-cols-2">
              {optionFields.map((optionField, optionIndex) => (
                <div key={optionField.name} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${question.id}`}
                      aria-label={`Option ${optionField.letter} is correct`}
                      checked={field.value === optionIndex}
                      onChange={() => field.onChange(optionIndex)}
                      className="size-4 shrink-0 accent-correct-strong"
                    />
                    <span className="w-4 text-xs font-semibold text-ink-muted">
                      {optionField.letter}
                    </span>
                    <input
                      aria-label={`Option ${optionField.letter}`}
                      aria-invalid={
                        errors.options?.[optionIndex] ? true : undefined
                      }
                      className={`${fieldClassName} h-9`}
                      {...form.register(optionField.name)}
                    />
                  </div>
                  {errors.options?.[optionIndex] && (
                    <p className="pl-12 text-sm text-destructive">
                      {errors.options[optionIndex].message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        />
      </fieldset>

      <div className="space-y-2">
        <label
          htmlFor={`explanation-${question.id}`}
          className="text-sm font-medium"
        >
          Explanation
        </label>
        <textarea
          id={`explanation-${question.id}`}
          rows={2}
          aria-invalid={errors.explanation ? true : undefined}
          className={fieldClassName}
          {...form.register("explanation")}
        />
        {errors.explanation && (
          <p className="text-sm text-destructive">
            {errors.explanation.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save changes</Button>
      </div>
    </form>
  );
}
