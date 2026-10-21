import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Choice<Value> = {
  value: Value;
  label: string;
};

type ChoiceGroupProps<Value> = {
  choices: readonly Choice<Value>[];
  value: Value;
  onChange: (value: Value) => void;
};

export function ChoiceGroup<Value extends string | number>({
  choices,
  value,
  onChange,
}: ChoiceGroupProps<Value>) {
  const handleValueChange = (pressedValues: string[]) => {
    const pressedChoice = choices.find(
      (choice) => String(choice.value) === pressedValues[0],
    );
    if (pressedChoice) {
      onChange(pressedChoice.value);
    }
  };

  return (
    <ToggleGroup
      variant="outline"
      value={[String(value)]}
      onValueChange={handleValueChange}
      className="grid w-full auto-cols-fr grid-flow-col"
    >
      {choices.map((choice) => (
        <ToggleGroupItem key={choice.value} value={String(choice.value)}>
          {choice.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
