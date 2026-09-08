import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-md border border-border bg-well px-4 text-base text-fg placeholder:text-subtle",
          "transition-[border-color,box-shadow] duration-150 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:border-accent",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
