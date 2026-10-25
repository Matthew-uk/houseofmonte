import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const BASE =
  "inline-flex h-12 w-full items-center justify-center px-6 text-ui font-medium uppercase transition-opacity duration-150 hover:opacity-85 disabled:cursor-not-allowed disabled:bg-surface disabled:text-muted disabled:hover:opacity-100";

const VARIANTS = {
  primary: "bg-fg text-inverse",
  secondary: "border border-fg bg-transparent text-fg",
};

// DESIGN.md §5 Buttons. Full-width by default (mobile first); callers narrow it.
export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return <button className={`${BASE} ${VARIANTS[variant]} ${className}`} {...props} />;
}
