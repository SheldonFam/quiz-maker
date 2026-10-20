import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const allLevelsValue = "all";

type QuizFiltersProps = {
  search: string;
  level: string;
  levelNames: string[];
  onSearchChange: (search: string) => void;
  onLevelChange: (level: string) => void;
};

export function QuizFilters({
  search,
  level,
  levelNames,
  onSearchChange,
  onLevelChange,
}: QuizFiltersProps) {
  const levelItems = [
    { value: allLevelsValue, label: "All levels" },
    ...levelNames.map((levelName) => ({ value: levelName, label: levelName })),
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-icon"
          aria-hidden="true"
        />
        <Input
          type="search"
          aria-label="Search quizzes"
          placeholder="Search by title or topic"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="pl-9"
        />
      </div>

      <Select
        items={levelItems}
        value={level === "" ? allLevelsValue : level}
        onValueChange={(value) =>
          onLevelChange(value === allLevelsValue || value === null ? "" : value)
        }
      >
        <SelectTrigger aria-label="Filter by level" className="w-full sm:w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {levelItems.map((levelItem) => (
            <SelectItem key={levelItem.value} value={levelItem.value}>
              {levelItem.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
