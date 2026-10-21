import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md text-sm font-semibold whitespace-nowrap transition-[color,background-color,box-shadow] duration-150 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover",
        outline:
          "bg-card text-foreground shadow-xs inset-ring inset-ring-input hover:bg-surface-hover active:bg-muted",
        secondary: "bg-secondary text-secondary-foreground hover:bg-border",
        ghost:
          "font-medium text-ink-muted hover:bg-muted hover:text-foreground",
        destructive:
          "font-medium text-ink-muted hover:bg-danger-soft hover:text-destructive",
        link: "text-link underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-3 py-2",
        xs: "h-6 gap-1 px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 px-2 py-1.5 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-10 px-4 py-2.5",
        icon: "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
