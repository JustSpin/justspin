import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[transform,background-color,color,opacity,border-color] duration-150 ease-out disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:not-disabled:scale-[0.96]",
  {
    variants: {
      variant: {
        chili:
          "bg-accent text-accent-fg shadow-[0_8px_24px_rgb(232_93_76_/_0.28)] hover:brightness-110",
        paper: "bg-fg text-bg hover:bg-fg/90",
        outline:
          "border border-hairline bg-transparent text-fg hover:bg-raised",
        ghost: "text-fg hover:bg-raised",
        muted: "bg-raised text-fg hover:bg-hairline",
        link: "text-accent underline-offset-4 hover:underline px-0 h-auto",
      },
      size: {
        sm: "h-9 rounded-sm px-3 text-sm",
        md: "h-11 rounded-md px-4 text-sm",
        lg: "h-12 rounded-lg px-5 text-base",
        xl: "h-14 rounded-xl px-6 text-base tracking-wide",
        icon: "size-11 rounded-md",
        pill: "h-10 rounded-full px-4 text-sm",
      },
    },
    defaultVariants: {
      variant: "chili",
      size: "md",
    },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
