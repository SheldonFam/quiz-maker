import * as React from "react";
import { cn } from "cn";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-md bg-card px-3 py-2 text-sm text-foreground shadow-xs inset-ring inset-ring-input transition-shadow duration-150 outline-none placeholder:text-muted-foreground focus-visible:inset-ring-2 focus-visible:inset-ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:inset-ring-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
