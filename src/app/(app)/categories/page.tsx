import { foundationShades, lipstickShades } from "@/lib/mock-data";
import { ImageResultGrid } from "@/components/ui/ImageResultGrid";

const categories = [
  { name: "Lip Color", skus: 1240, approval: 84, src: lipstickShades[12].src },
  { name: "Face Makeup", skus: 890, approval: 91, src: foundationShades[2].src },
  { name: "Eye Makeup", skus: 620, approval: 58, src: lipstickShades[13].src },
  { name: "Skin Care", skus: 440, approval: 89, src: foundationShades[3].src },
  { name: "Accessories", skus: 320, approval: 83, src: lipstickShades[8].src },
  { name: "Jewellery", skus: 180, approval: 41, src: lipstickShades[14].src },
  { name: "Flat Lay Items", skus: 210, approval: 86, src: lipstickShades[1].src },
  { name: "Footwear", skus: 150, approval: 87, src: foundationShades[0].src },
];

export default function CategoriesPage() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-lg font-extrabold text-t1">Categories</div>
        <div className="flex gap-1.5">
          {["All", "Foundation", "Lipstick", "Accessories"].map((f, i) => (
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
          meta: `${c.skus.toLocaleString()} SKUs · ${c.approval}% approval`,
        }))}
      />
    </div>
  );
}
