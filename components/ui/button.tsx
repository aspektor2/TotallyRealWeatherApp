import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "sky" | "sun" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

// Duolingo-style chunky buttons: a solid bottom "edge" that compresses on press.
const chunky =
  "border-b-4 active:border-b-2 active:translate-y-[2px] font-extrabold uppercase tracking-wide";

const variants: Record<Variant, string> = {
  primary: cn(chunky, "bg-leaf text-white border-leaf-edge hover:brightness-105"),
  sky: cn(chunky, "bg-sky text-white border-sky-edge hover:brightness-105"),
  sun: cn(chunky, "bg-sun text-ink border-sun-edge hover:brightness-105"),
  outline: cn(
    chunky,
    "border-2 border-b-4 border-line bg-white text-sky hover:bg-cloud"
  ),
  ghost: "font-bold text-slateink hover:bg-cloud hover:text-ink",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-xs",
  md: "h-12 px-5 text-sm",
  lg: "h-14 px-7 text-sm",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
