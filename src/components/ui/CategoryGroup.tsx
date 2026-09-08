"use client";

import { useState, KeyboardEvent } from "react";
import { ToggleChip } from "./ToggleChip";

/**
 * One expandable subgroup card (e.g. "Face & Base") — a row of independently
 * toggleable ToggleChips plus an inline "+ Add" control that appends a new
 * chip to the row.
 */
export function CategoryGroup({
  title,
  chips,
  defaultSelected = [],
}: {
  title: string;
  chips: string[];
  defaultSelected?: string[];
}) {
  const [items, setItems] = useState(chips);
  const [expanded, setExpanded] = useState(true);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  function commitDraft() {
    const trimmed = draft.trim();
    if (trimmed && !items.includes(trimmed)) {
      setItems((prev) => [...prev, trimmed]);
    }
    setDraft("");
    setAdding(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") commitDraft();
    if (e.key === "Escape") {
      setDraft("");
      setAdding(false);
    }
  }

  return (
    <div className="mb-2.5 rounded-lg border border-border bg-glass p-3.5">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mb-2.5 flex w-full items-center justify-between text-left"
      >
        <span className="flex items-center gap-2 text-[12.5px] font-semibold text-t1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2 2 7l10 5 10-5-10-5Z" />
            <path d="m2 17 10 5 10-5M2 12l10 5 10-5" />
          </svg>
          {title}
        </span>
        <span className="text-[10px] text-t4">
          {expanded ? "Click to collapse" : "Click to expand"}
        </span>
      </button>
      {expanded && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((chip) => (
            <ToggleChip
              key={chip}
              label={chip}
              defaultSelected={defaultSelected.includes(chip)}
            />
          ))}
          {adding ? (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={commitDraft}
              placeholder="New category…"
              className="w-32 rounded-full border border-gold bg-transparent px-3 py-1 text-[11px] text-t1 outline-none"
            />
          ) : (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="rounded-full border border-dashed border-border px-3 py-1 text-[11px] font-medium text-t3 transition-colors hover:border-gold hover:text-gold"
            >
              + Add
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * A labeled section ("Beauty & Cosmetics", "Fashion & Apparel") holding
 * several CategoryGroup subgroup cards, plus a control to append a brand
 * new subgroup card to the section.
 */
export function CategorySection({
  label,
  accent,
  subgroups,
  defaultSelected,
}: {
  label: string;
  accent: string;
  subgroups: { title: string; chips: string[] }[];
  defaultSelected?: Record<string, string[]>;
}) {
  const [groups, setGroups] = useState(subgroups);

  function addGroup() {
    const title = window.prompt("Name this category group:");
    if (title && title.trim()) {
      setGroups((prev) => [...prev, { title: title.trim(), chips: [] }]);
    }
  }

  return (
    <div className="mb-6">
      <div
        className="mb-2.5 text-[11px] font-bold uppercase tracking-[1.5px]"
        style={{ color: accent }}
      >
        {label}
      </div>
      {groups.map((group) => (
        <CategoryGroup
          key={group.title}
          title={group.title}
          chips={group.chips}
          defaultSelected={defaultSelected?.[group.title]}
        />
      ))}
      <button
        type="button"
        onClick={addGroup}
        className="mt-1 rounded-md border border-dashed border-border px-2.5 py-1 text-[11px] font-semibold text-t3 transition-colors hover:text-t1"
        style={{ borderColor: "var(--border)" }}
      >
        + Add category group
      </button>
    </div>
  );
}
