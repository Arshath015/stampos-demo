const CATEGORY_GROUPS: { label: string; options: { name: string; score: number }[] }[] = [
  {
    label: "Face & Base",
    options: [
      { name: "Foundation", score: 92 },
      { name: "Compact Powder", score: 52 },
    ],
  },
  {
    label: "Lips",
    options: [
      { name: "Ultrastay Lipstick", score: 78 },
      { name: "Lip Liner", score: 65 },
    ],
  },
  {
    label: "Eyes & Tools",
    options: [
      { name: "Eyeshadow Palette", score: 28 },
      { name: "Makeup Brushes", score: 15 },
    ],
  },
  {
    label: "Men's Fashion",
    options: [
      { name: "T-shirts", score: 18 },
      { name: "Jeans", score: 12 },
    ],
  },
  {
    label: "Women's Fashion",
    options: [
      { name: "Dresses", score: 10 },
      { name: "Sarees", score: 6 },
    ],
  },
];

function scoreColor(score: number) {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-info";
  if (score >= 40) return "text-warning";
  return "text-danger";
}

export { CATEGORY_GROUPS, scoreColor };

export function CategoryPicker({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (name: string, score: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3.5">
      {CATEGORY_GROUPS.map((group) => (
        <div key={group.label}>
          <div className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wide text-t4">
            {group.label}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {group.options.map((opt) => {
              const active = selected === opt.name;
              const low = opt.score < 40;
              return (
                <button
                  key={opt.name}
                  type="button"
                  onClick={() => onSelect(opt.name, opt.score)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
                    active
                      ? "border-gold bg-gold-sub text-gold"
                      : "border-border text-t3 hover:border-border-h"
                  } ${low ? "opacity-50" : ""}`}
                >
                  {opt.name}
                  <span className={`font-bold ${scoreColor(opt.score)}`}>{opt.score}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
