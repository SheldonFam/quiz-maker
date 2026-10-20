type Choice<Value> = {
  value: Value;
  label: string;
};

type ChoiceGroupProps<Value> = {
  label: string;
  choices: Choice<Value>[];
  value: Value;
  onChange: (value: Value) => void;
};

export function ChoiceGroup<Value extends string | number>({
  label,
  choices,
  value,
  onChange,
}: ChoiceGroupProps<Value>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="grid grid-flow-col auto-cols-fr gap-2"
    >
      {choices.map((choice) => {
        const isSelected = choice.value === value;
        return (
          <button
            key={choice.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(choice.value)}
            className={
              isSelected
                ? "h-9 rounded-md bg-primary text-sm font-semibold text-primary-foreground tabular-nums shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                : "h-9 rounded-md bg-card text-sm font-semibold text-foreground tabular-nums shadow-xs inset-ring inset-ring-input transition-colors duration-150 hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            }
          >
            {choice.label}
          </button>
        );
      })}
    </div>
  );
}
