import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "default" | "primary" | "ghost" | "gold";
type Size = "md" | "sm";

const VARIANT_CLASSES: Record<Variant, string> = {
  default:
    "border border-border bg-glass text-t2 hover:border-border-h hover:text-t1 hover:bg-glass-hover",
  primary:
    "border border-transparent bg-gradient-to-br from-accent to-accent-h text-white shadow-[0_2px_8px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_16px_rgba(59,130,246,0.4)] hover:-translate-y-px",
  ghost: "border border-transparent bg-transparent text-t3 hover:text-t1",
  gold: "border border-transparent bg-gold text-[#0a0a0b] hover:bg-gold-h hover:-translate-y-px",
};

const SIZE_CLASSES: Record<Size, string> = {
  md: "px-3.5 py-1.5 text-xs",
  sm: "px-2.5 py-1 text-[11px]",
};

export function Button({
  variant = "default",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}) {
  return (
    <button
      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md font-semibold transition-all duration-150 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
