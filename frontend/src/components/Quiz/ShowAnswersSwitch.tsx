type ShowAnswersSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function ShowAnswersSwitch({
  checked,
  onChange,
}: ShowAnswersSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2.5 rounded-md text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <span
        className={
          checked
            ? "flex h-6 w-11 items-center rounded-full bg-primary p-0.5 transition-colors duration-150"
            : "flex h-6 w-11 items-center rounded-full bg-border p-0.5 transition-colors duration-150"
        }
      >
        <span
          className={
            checked
              ? "size-5 translate-x-5 rounded-full bg-white shadow-xs transition-transform duration-150"
              : "size-5 translate-x-0 rounded-full bg-white shadow-xs transition-transform duration-150"
          }
        />
      </span>
      Show answers
    </button>
  );
}
