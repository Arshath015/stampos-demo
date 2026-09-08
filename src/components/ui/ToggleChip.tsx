"use client";

import { useState } from "react";

/**
 * Independently-toggleable multi-select pill. Each chip owns its own on/off
 * state — there is no shared/global listener forcing single-select across
 * chips (that was a real bug in the original prototype). Groups that need
 * genuine mutual exclusivity should use RadioCard instead.
 */
export function ToggleChip({
  label,
  defaultSelected = false,
  selected: controlledSelected,
  onToggle,
  variant = "default",
}: {
  label: string;
  defaultSelected?: boolean;
  selected?: boolean;
  onToggle?: (next: boolean) => void;
  variant?: "default" | "score";
}) {
  const [internal, setInternal] = useState(defaultSelected);
  const isControlled = controlledSelected !== undefined;
  const selected = isControlled ? controlledSelected : internal;

  function handleClick() {
    const next = !selected;
    if (!isControlled) setInternal(next);
    onToggle?.(next);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={selected}
      className={`select-none rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
        selected
          ? "border-gold bg-gold-sub text-gold"
          : "border-border bg-transparent text-t3 hover:border-gold hover:text-gold hover:bg-gold-sub"
      } ${variant === "score" ? "flex items-center gap-2" : ""}`}
    >
      {label}
    </button>
  );
}
