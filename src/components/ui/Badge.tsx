import { ReactNode } from "react";

const COLORS = {
  blue: "bg-accent-sub text-accent-h",
  green: "bg-success-sub text-success",
  red: "bg-danger-sub text-danger",
  yellow: "bg-warning-sub text-warning",
  purple: "bg-info-sub text-info",
  gold: "bg-gold-sub text-gold",
} as const;

export type BadgeColor = keyof typeof COLORS;

export function Badge({
  color = "blue",
  children,
}: {
  color?: BadgeColor;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${COLORS[color]}`}
    >
      {children}
    </span>
  );
}
