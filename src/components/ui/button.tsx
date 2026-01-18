import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary: Rosy background, beige text
        default: "bg-primary text-primary-foreground rounded-full hover:bg-primary-hover",
        // Secondary: Beige background, rosy text
        secondary: "bg-background text-primary rounded-full hover:bg-background/90",
        // Outline: Beige background, rosy text, rosy border
        outline: "border-2 border-primary bg-background text-primary rounded-full hover:bg-background/90",
        destructive: "bg-destructive text-destructive-foreground rounded-md",
        // Ghost: Beige background on hover, rosy text
        ghost: "bg-transparent text-primary rounded-md hover:bg-background",
        link: "text-primary underline-offset-4 underline rounded-md",
        // Bridal specific variants - all using brand colors
        hero: "bg-primary text-primary-foreground px-8 py-6 text-base font-medium tracking-wide rounded-full hover:bg-primary-hover",
        heroOutline: "border-2 border-primary bg-background text-primary px-8 py-6 text-base font-medium tracking-wide rounded-full hover:bg-background/90",
        nav: "text-foreground bg-transparent font-normal tracking-wide rounded-md hover:text-primary",
        navCta: "bg-primary text-primary-foreground px-6 py-2 text-sm font-medium tracking-wide rounded-full hover:bg-primary-hover",
        addToCart: "bg-primary text-primary-foreground w-full py-3 rounded-full font-medium hover:bg-primary-hover",
        quickAdd: "bg-primary text-primary-foreground w-full py-2.5 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-b-md",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-8 text-base",
        xl: "h-14 rounded-md px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
