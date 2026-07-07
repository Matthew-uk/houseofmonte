import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type Variant = "outline" | "filled";

const base =
  "inline-flex items-center justify-center rounded-button font-body uppercase " +
  "tracking-wider text-small transition-[background-color,color,transform,border-color] " +
  "duration-300 ease-out hover:scale-[1.02] focus-visible:outline-gold " +
  "disabled:opacity-40 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  // Outlined gold → inverts to filled gold on hover
  outline:
    "border border-gold text-gold bg-transparent hover:bg-gold hover:text-bg-primary",
  filled: "border border-gold bg-gold text-bg-primary hover:bg-gold-bright",
};

type ButtonAsButton = {
  as?: "button";
  variant?: Variant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonAsLink = {
  as: "a";
  variant?: Variant;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { variant = "outline", className = "", ...rest } = props;
  const classes = `${base} ${variants[variant]} px-6 py-3 ${className}`;

  if (props.as === "a") {
    const { as: _a, ...anchorRest } = rest as ButtonAsLink;
    void _a;
    return <a className={classes} {...anchorRest} />;
  }
  const { as: _b, ...buttonRest } = rest as ButtonAsButton;
  void _b;
  return <button className={classes} {...buttonRest} />;
}
