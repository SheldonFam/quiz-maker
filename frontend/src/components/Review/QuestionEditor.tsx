import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { DraftQuestion } from "@/stores/draftQuizStore";
import { questionSchema, type QuestionValues } from "./questionSchema";

const optionFields = [
  { letter: "A", name: "options.0" },
  { letter: "B", name: "options.1" },
  { letter: "C", name: "options.2" },
  { letter: "D", name: "options.3" },
] as const;

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

  const textId = `text-${question.id}`;

  const explanationId = `explanation-${question.id}`;

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
      <Field>
        <FieldLabel htmlFor={textId}>Question</FieldLabel>
        <Textarea
          id={textId}
          aria-invalid={errors.text ? true : undefined}
          aria-describedby={errors.text ? `${textId}-error` : undefined}
          {...form.register("text")}
        />
        <FieldError id={`${textId}-error`} errors={[errors.text]} />
      </Field>

      <FieldSet className="gap-0">
        <FieldLegend variant="label" className="mb-2">
          Options
        </FieldLegend>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {optionFields.map((optionField, optionIndex) => {
            const optionId = `option-${optionIndex}-${question.id}`;
            const optionError = errors.options?.[optionIndex];

            return (
              <div key={optionField.name} className="space-y-1">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor={optionId}
                    className="w-4 text-xs font-semibold text-ink-muted"
                  >
                    {optionField.letter}
                  </label>
                  <Input
                    id={optionId}
                    aria-invalid={optionError ? true : undefined}
                    aria-describedby={
                      optionError ? `${optionId}-error` : undefined
                    }
                    {...form.register(optionField.name)}
                  />
                </div>
                <FieldError
                  id={`${optionId}-error`}
                  className="pl-6"
                  errors={[optionError]}
                />
              </div>
            );
          })}
        </div>
      </FieldSet>

      <Field>
        <FieldLabel id={`correct-${question.id}`}>Correct answer</FieldLabel>
        <Controller
          control={form.control}
          name="correct_index"
          render={({ field }) => (
            <RadioGroup
              aria-labelledby={`correct-${question.id}`}
              value={field.value}
              onValueChange={(newValue: number) => field.onChange(newValue)}
              className="flex flex-wrap gap-x-5 gap-y-2"
            >
              {optionFields.map((optionField, optionIndex) => (
                <label
                  key={optionField.name}
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <RadioGroupItem
                    value={optionIndex}
                    className="size-5 data-checked:bg-correct-strong"
                  />
                  {optionField.letter}
                </label>
              ))}
            </RadioGroup>
          )}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor={explanationId}>Explanation</FieldLabel>
        <Textarea
          id={explanationId}
          aria-invalid={errors.explanation ? true : undefined}
          aria-describedby={
            errors.explanation ? `${explanationId}-error` : undefined
          }
          {...form.register("explanation")}
        />
        <FieldError
          id={`${explanationId}-error`}
          errors={[errors.explanation]}
        />
      </Field>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save question</Button>
      </div>
    </form>
  );
}
