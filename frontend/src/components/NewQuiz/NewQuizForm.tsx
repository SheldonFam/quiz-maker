import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";

import type { LevelPublic } from "@/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChoiceGroup } from "./ChoiceGroup";
import { newQuizSchema, type NewQuizValues } from "./newQuizSchema";

const questionCountChoices = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 15, label: "15" },
  { value: 20, label: "20" },
];

const languageChoices = [
  { value: "en", label: "English" },
  { value: "ms", label: "Bahasa Melayu" },
] as const;

type NewQuizFormProps = {
  levels: LevelPublic[];
  hasError: boolean;
  onGenerate: (values: NewQuizValues) => void;
};

export function NewQuizForm({
  levels,
  hasError,
  onGenerate,
}: NewQuizFormProps) {
  const form = useForm<NewQuizValues>({
    resolver: zodResolver(newQuizSchema),
    defaultValues: {
      level: "",
      subject: "",
      topic: "",
      question_count: 10,
      language: "en",
    },
  });

  const selectedLevelName = useWatch({ control: form.control, name: "level" });
  const selectedSubjectName = useWatch({
    control: form.control,
    name: "subject",
  });

  const selectedLevel = levels.find(
    (level) => level.name === selectedLevelName,
  );

  const subjects = selectedLevel?.subjects ?? [];

  const selectedSubject = subjects.find(
    (subject) => subject.name === selectedSubjectName,
  );

  const suggestedTopics = selectedSubject?.topics ?? [];

  const errors = form.formState.errors;

  return (
    <form
      onSubmit={form.handleSubmit(onGenerate)}
      noValidate
      className="overflow-hidden rounded-xl bg-card shadow-xs ring-1 ring-edge"
    >
      <div className="space-y-7 p-5 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="level">Level</FieldLabel>
            <Controller
              control={form.control}
              name="level"
              render={({ field, fieldState }) => (
                <Select
                  value={field.value || null}
                  onValueChange={(value) => {
                    field.onChange(value ?? "");
                    form.setValue("subject", "");
                    form.setValue("topic", "");
                  }}
                >
                  <SelectTrigger
                    id="level"
                    ref={field.ref}
                    className="w-full"
                    aria-invalid={fieldState.invalid}
                    aria-describedby={
                      fieldState.invalid ? "level-error" : undefined
                    }
                  >
                    <SelectValue placeholder="Choose a level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level.name} value={level.name}>
                        {level.name} ({level.curriculum})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError id="level-error" errors={[errors.level]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="subject">Subject</FieldLabel>
            <Controller
              control={form.control}
              name="subject"
              render={({ field, fieldState }) => (
                <Select
                  value={field.value || null}
                  onValueChange={(value) => {
                    field.onChange(value ?? "");
                    form.setValue("topic", "");
                  }}
                  disabled={subjects.length === 0}
                >
                  <SelectTrigger
                    id="subject"
                    ref={field.ref}
                    className="w-full"
                    aria-invalid={fieldState.invalid}
                    aria-describedby={
                      fieldState.invalid ? "subject-error" : undefined
                    }
                  >
                    <SelectValue
                      placeholder={
                        selectedLevel
                          ? "Choose a subject"
                          : "Choose a level first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.name} value={subject.name}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError id="subject-error" errors={[errors.subject]} />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="topic">Topic</FieldLabel>
          <Input
            id="topic"
            autoComplete="off"
            placeholder="For example: Pecahan"
            aria-invalid={errors.topic ? true : undefined}
            aria-describedby={errors.topic ? "topic-error" : undefined}
            className="h-11 text-base"
            {...form.register("topic")}
          />
          <FieldError id="topic-error" errors={[errors.topic]} />
          {suggestedTopics.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Syllabus topics:
              </span>
              {suggestedTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() =>
                    form.setValue("topic", topic, { shouldValidate: true })
                  }
                  className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-ink-muted inset-ring inset-ring-badge-ring transition-colors duration-150 hover:bg-primary-soft hover:text-primary-soft-foreground hover:inset-ring-primary-soft-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {topic}
                </button>
              ))}
            </div>
          )}
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <FieldSet className="gap-0">
            <FieldLegend variant="label" className="mb-2">
              Number of questions
            </FieldLegend>
            <Controller
              control={form.control}
              name="question_count"
              render={({ field }) => (
                <ChoiceGroup
                  choices={questionCountChoices}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FieldSet>

          <FieldSet className="gap-0">
            <FieldLegend variant="label" className="mb-2">
              Language
            </FieldLegend>
            <Controller
              control={form.control}
              name="language"
              render={({ field }) => (
                <ChoiceGroup
                  choices={languageChoices}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FieldSet>
        </div>

        {hasError && (
          <Alert variant="destructive">
            <CircleAlert />
            <AlertTitle>Couldn't create the quiz</AlertTitle>
            <AlertDescription>
              Your choices are still here. Press Create quiz to try again.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-border bg-surface-hover px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-sm text-muted-foreground">
          Each question has 4 choices, the correct answer and a short
          explanation.
        </p>
        <Button type="submit" size="lg">
          Create quiz
        </Button>
      </div>
    </form>
  );
}
