import { ReactNode } from "react";

/**
 * Single-select option card. Selection/exclusivity is owned by the parent
 * (it renders a group of these and keeps one `value` in state) — this
 * component only renders the visual selected/unselected state and reports
 * clicks. Used for role pickers, background/image-type pickers, etc., where
 * options are genuinely mutually exclusive (unlike ToggleChip).
 */
export function RadioCard({
  selected,
  onSelect,
  title,
  description,
  icon,
  align = "left",
  className = "",
}: {
  selected: boolean;
  onSelect: () => void;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative rounded-xl border p-4 text-left transition-all duration-200 ${
        align === "center" ? "text-center" : ""
      } ${
        selected
          ? "border-gold bg-gold-sub"
          : "border-white/10 bg-white/[0.03] hover:-translate-y-0.5 hover:border-gold/30 hover:bg-gold-sub/40"
      } ${className}`}
    >
      {selected && (
        <span className="absolute right-2.5 top-2.5 h-4 w-4 rounded-full bg-gold" />
      )}
      {icon && (
        <div
          className={`mb-2.5 flex h-10 w-10 items-center justify-center rounded-[10px] bg-white/5 text-lg text-gold ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {icon}
        </div>
      )}
      <div className="text-[13px] font-bold text-[#f8f8f2]">{title}</div>
      {description && (
        <div className="mt-0.5 text-[10.5px] leading-relaxed text-white/45">
          {description}
        </div>
      )}
    </button>
  );
}
