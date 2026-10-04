import { foundationShades, lipstickShades } from "@/lib/mock-data";
import { ImageResultGrid } from "@/components/ui/ImageResultGrid";

const categories = [
  { name: "AOF Dewy Foundation", skus: 5, approval: 92, src: foundationShades[0].src },
  { name: "Ultrastay Lipstick", skus: 5, approval: 78, src: lipstickShades[0].src },
];

export default function CategoriesPage() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-lg font-extrabold text-t1">Categories</div>
        <div className="flex gap-1.5">
          {["All", "Foundation", "Lipstick"].map((f, i) => (
            <span
              key={f}
              className={`rounded-full border px-3 py-1 text-[11px] font-medium ${
                i === 0 ? "border-gold bg-gold-sub text-gold" : "border-border text-t3"
              }`}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      <ImageResultGrid
        columns={4}
        aspect="aspect-[4/3]"
        overlayAlwaysVisible
        images={categories.map((c) => ({
          id: c.name,
          src: c.src,
          title: c.name,
          meta: `${c.skus} SKUs · ${c.approval}% approval`,
        }))}
      />
    </div>
  );
}
