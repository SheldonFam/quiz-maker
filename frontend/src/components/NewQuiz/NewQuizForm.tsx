import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";

import type { LevelPublic } from "@/client";
import { Button } from "@/components/ui/button";
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
];

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
          <div className="space-y-2">
            <label htmlFor="level" className="text-sm font-medium">
              Level
            </label>
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
                    className="w-full"
                    aria-invalid={fieldState.invalid}
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
            {errors.level && (
              <p className="text-sm text-destructive">{errors.level.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Subject
            </label>
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
                    className="w-full"
                    aria-invalid={fieldState.invalid}
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
            {errors.subject && (
              <p className="text-sm text-destructive">
                {errors.subject.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="topic" className="text-sm font-medium">
            Topic
          </label>
          <Input
            id="topic"
            autoComplete="off"
            placeholder="For example: Pecahan"
            aria-invalid={errors.topic ? true : undefined}
            className="h-11 text-base"
            {...form.register("topic")}
          />
          {errors.topic && (
            <p className="text-sm text-destructive">{errors.topic.message}</p>
          )}
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
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <span className="text-sm font-medium">Number of questions</span>
            <Controller
              control={form.control}
              name="question_count"
              render={({ field }) => (
                <ChoiceGroup
                  label="Number of questions"
                  choices={questionCountChoices}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Language</span>
            <Controller
              control={form.control}
              name="language"
              render={({ field }) => (
                <ChoiceGroup
                  label="Language"
                  choices={languageChoices}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-border bg-surface-hover px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-sm text-muted-foreground">
          {hasError
            ? "Couldn't create the quiz. Try again."
            : "Each question has 4 choices, the correct answer and a short explanation."}
        </p>
        <Button type="submit" size="lg">
          Create quiz
        </Button>
      </div>
    </form>
  );
}
