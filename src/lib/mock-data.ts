import type {
  Batch,
  CategoryGroupData,
  CategoryTrainingRow,
  Product,
} from "./types";

/**
 * Pulls the product line + shade number out of a batch/SKU product name
 * like "AOF Dewy Foundation — Shade 07" or "Ultrastay Transferproof
 * Lipstick — Shade 13" (also handles trailing variant suffixes, e.g.
 * "Shade 47 — White"). Returns null for SKUs outside the two hero product
 * lines (e.g. "Matte Setting Powder") — those have no per-shade result pool
 * and should fall back to a generic pool.
 */
export function parseBatchShade(productName: string): { line: "foundation" | "lipstick"; shade: string } | null {
  const match = productName.match(/Shade (\d+)/i);
  if (!match) return null;
  const shade = match[1].padStart(2, "0");
  if (/foundation/i.test(productName)) return { line: "foundation", shade };
  if (/lipstick/i.test(productName)) return { line: "lipstick", shade };
  return null;
}

const FOUNDATION_SHADE_NUMBERS = [
  "05", "07", "10", "15", "17", "20", "27", "35", "37", "40", "47",
];
const LIPSTICK_SHADE_NUMBERS = Array.from({ length: 20 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

export const foundationShades = FOUNDATION_SHADE_NUMBERS.map((shade) => ({
  shade,
  src: `/images/products/foundation/foundation-shade-${shade}.jpg`,
}));

export const lipstickShades = LIPSTICK_SHADE_NUMBERS.map((shade) => ({
  shade,
  src: `/images/products/lipstick/lipstick-shade-${shade}.jpg`,
}));

/**
 * The subset of shades that currently have real generated *result* images
 * on disk (public/images/results/**) — i.e. the shades Generate/Review can
 * actually demo end-to-end, not just show as a product reference photo.
 * "13" is the pre-existing legacy shade whose result files are still named
 * lipstick-pop-* (see SHADE_ALIAS in src/lib/results.ts) — do not rename.
 */
export const foundationSkuShades = ["05", "07", "15", "20", "47"];
export const lipstickSkuShades = ["01", "04", "13", "15", "17"];

export interface SkuOption {
  shade: string;
  label: string;
  /** Real product reference photo — the color/texture source of truth for
   * this shade, never an invented CSS color. */
  swatchSrc: string;
}

export const foundationSkus: SkuOption[] = foundationSkuShades.map((shade) => ({
  shade,
  label: `Shade ${shade}`,
  swatchSrc: `/images/products/foundation/foundation-shade-${shade}.jpg`,
}));

export const lipstickSkus: SkuOption[] = lipstickSkuShades.map((shade) => ({
  shade,
  label: `Shade ${shade}`,
  swatchSrc: `/images/products/lipstick/lipstick-shade-${shade}.jpg`,
}));

export const products: Product[] = [
  {
    id: "aof-dewy-foundation",
    name: "AOF Dewy Foundation",
    category: "AOF Dewy Foundation",
    brandScore: 92,
    shadeCount: 11,
    shades: foundationShades,
  },
  {
    id: "ultrastay-transferproof-lipstick",
    name: "Ultrastay Transferproof Lipstick",
    category: "Ultrastay Lipstick",
    brandScore: 78,
    shadeCount: 20,
    shades: lipstickShades,
  },
];

/** Results grid for the Generate wizard — Step 4. Confidence-tiered per image. */
export const generateResults = {
  foundation: [
    { shade: "05", confidence: 92 },
    { shade: "07", confidence: 94 },
    { shade: "10", confidence: 91 },
    { shade: "15", confidence: 89 },
    { shade: "17", confidence: 78 },
    { shade: "20", confidence: 88 },
    { shade: "27", confidence: 62 },
    { shade: "35", confidence: 86 },
    { shade: "37", confidence: 90 },
    { shade: "40", confidence: 75 },
  ].map((r) => ({
    id: `foundation-${r.shade}`,
    src: `/images/products/foundation/foundation-shade-${r.shade}.jpg`,
    confidence: r.confidence,
    shade: r.shade,
  })),
  lipstick: [
    { shade: "01", confidence: 96 },
    { shade: "02", confidence: 90 },
    { shade: "03", confidence: 87 },
    { shade: "04", confidence: 72 },
    { shade: "05", confidence: 93 },
    { shade: "06", confidence: 60 },
    { shade: "07", confidence: 88 },
    { shade: "08", confidence: 94 },
    { shade: "09", confidence: 81 },
    { shade: "10", confidence: 91 },
  ].map((r) => ({
    id: `lipstick-${r.shade}`,
    src: `/images/products/lipstick/lipstick-shade-${r.shade}.jpg`,
    confidence: r.confidence,
    shade: r.shade,
  })),
};

export const batches: Batch[] = [
  {
    id: "#008",
    productName: "AOF Dewy Foundation — Shade 07",
    category: "AOF Dewy Foundation",
    images: 24,
    reviewState: "in-progress",
    reviewedCount: 18,
    approved: 15,
    rejected: 3,
    action: "review",
    updated: "2h ago",
  },
  {
    id: "#007",
    productName: "Matte Setting Powder",
    category: "Concealer",
    images: 16,
    reviewState: "pending-batch-review",
    action: "start-review",
    updated: "Yesterday",
  },
  {
    id: "#006",
    productName: "Ultrastay Transferproof Lipstick — Shade 13",
    category: "Ultrastay Lipstick",
    images: 20,
    reviewState: "complete",
    approved: 18,
    rejected: 2,
    action: "export",
    updated: "3 days ago",
  },
  {
    id: "#005",
    productName: "AOF Dewy Foundation — Shade 05",
    category: "AOF Dewy Foundation",
    images: 24,
    reviewState: "generating",
    action: "generating",
    updated: "~2 min",
  },
  {
    id: "#004",
    productName: "AOF Dewy Foundation — Shade 15",
    category: "AOF Dewy Foundation",
    images: 24,
    reviewState: "in-progress",
    reviewedCount: 12,
    approved: 10,
    rejected: 2,
    action: "review",
    updated: "4 days ago",
  },
  {
    id: "#003",
    productName: "AOF Dewy Foundation — Shade 20",
    category: "AOF Dewy Foundation",
    images: 24,
    reviewState: "complete",
    approved: 22,
    rejected: 2,
    action: "export",
    updated: "5 days ago",
  },
  {
    id: "#002",
    productName: "SUGAR Pop Lipstick Duo",
    category: "Lip Liner",
    images: 20,
    reviewState: "in-progress",
    reviewedCount: 10,
    approved: 8,
    rejected: 2,
    action: "review",
    updated: "6 days ago",
  },
  {
    id: "#001",
    productName: "AOF Dewy Foundation — Shade 47 — White",
    category: "AOF Dewy Foundation",
    images: 24,
    reviewState: "complete",
    approved: 20,
    rejected: 4,
    action: "export",
    updated: "1 week ago",
  },
];

export const categoryTaxonomy: CategoryGroupData[] = [
  {
    label: "Beauty & Cosmetics",
    accent: "var(--gold)",
    subgroups: [
      {
        title: "Face & Base",
        chips: [
          "Foundation",
          "Concealer",
          "Compact Powder",
          "Setting Spray",
          "Primer",
          "Blush",
          "Highlighter",
          "Bronzer",
        ],
      },
      {
        title: "Lips",
        chips: [
          "Ultrastay Lipstick",
          "Lipstick (Matte)",
          "Lipstick (Glossy)",
          "Lipstick (Liquid)",
          "Lip Liner",
          "Lip Gloss",
          "Lip Balm",
        ],
      },
      {
        title: "Eyes & Brows",
        chips: [
          "Kajal",
          "Eyeliner",
          "Mascara",
          "Eyeshadow Palette",
          "Eyebrow Pencil",
          "Eye Primer",
        ],
      },
      {
        title: "Tools & Skincare",
        chips: [
          "Makeup Brushes",
          "Beauty Sponge",
          "Compact Mirror",
          "Face Serum",
          "Moisturizer",
          "Makeup Remover",
        ],
      },
    ],
  },
  {
    label: "Fashion & Apparel",
    accent: "#A78BFA",
    subgroups: [
      {
        title: "Men's",
        chips: [
          "T-shirts",
          "Casual Shirts",
          "Formal Shirts",
          "Jeans",
          "Jackets",
          "Trousers",
          "Blazers",
          "Ethnic Kurtas",
          "Shorts",
          "Activewear",
        ],
      },
      {
        title: "Women's",
        chips: [
          "Tops",
          "Blouses",
          "Dresses",
          "Skirts",
          "Trousers",
          "Ethnic Kurtas",
          "Sarees",
          "Lehenga",
          "Jumpsuits",
          "Activewear",
          "Lingerie",
        ],
      },
      {
        title: "Accessories",
        chips: ["Bags", "Belts", "Watches", "Sunglasses", "Scarves", "Hats"],
      },
      {
        title: "Footwear",
        chips: ["Sneakers", "Formal", "Sandals", "Heels", "Boots", "Flats"],
      },
    ],
  },
];

export const defaultSelectedChips: Record<string, string[]> = {
  "Face & Base": ["Foundation"],
  Lips: ["Ultrastay Lipstick"],
};

export const categoryTraining: CategoryTrainingRow[] = [
  { name: "AOF Dewy Foundation", score: 92 },
  { name: "Ultrastay Lipstick", score: 78 },
  { name: "Ultrastay Lipstick — Matte", score: 65 },
  { name: "Eyeshadow Palette", score: 45 },
  { name: "Eyes & Brows — Mascara", score: 28 },
  { name: "Tools & Skincare — Brushes", score: 15 },
];

export function trainingTier(score: number) {
  if (score >= 80) return { label: "Excellent", badge: "green" as const };
  if (score >= 60) return { label: "Good", badge: "blue" as const };
  if (score >= 40) return { label: "Basic", badge: "yellow" as const };
  return { label: "Not ready", badge: "red" as const };
}

export const dashboardStats = {
  imagesGenerated: { value: 12847, delta: "+18%", sub: "vs last month" },
  approvalRate: { value: 84.2, delta: "+6.1%", sub: "improving" },
  activeBrands: { value: 8, sub: "3 Enterprise · 5 Growth" },
  reviewBacklog: { value: 24, delta: "+8", sub: "since yesterday" },
};

export const brandUnderstanding = {
  overall: 72,
  identity: 85,
  identityWeight: 30,
  categoryTrainingScore: 66,
  categoryTrainingWeight: 70,
};

export const costSavings = {
  saved: "₹36.6L",
  savedPct: "95%",
  traditional: "₹38.5L",
  stampOs: "₹1.9L",
};

export const skuTable = [
  {
    product: "AOF Dewy Foundation — Shade 07",
    sub: "4 color variants",
    category: "AOF Dewy Foundation",
    batches: 4,
    images: 96,
    reviewPct: 75,
    tags: ["Summer 2026"],
    updated: "2h ago",
  },
  {
    product: "Matte Setting Powder",
    sub: "1 batch",
    category: "Concealer",
    batches: 1,
    images: 16,
    reviewPct: null,
    reviewLabel: "Pending",
    tags: ["Summer 2026"],
    updated: "Yesterday",
  },
  {
    product: "Ultrastay Transferproof Lipstick — Shade 13",
    sub: "2 batches",
    category: "Ultrastay Lipstick",
    batches: 2,
    images: 40,
    reviewPct: 100,
    tags: ["Nykaa Catalog"],
    updated: "3d ago",
  },
  {
    product: "SUGAR Pop Lipstick Duo",
    sub: "1 batch",
    category: "Lip Liner",
    batches: 1,
    images: 20,
    reviewPct: 50,
    tags: [],
    updated: "5d ago",
  },
  {
    product: "Ultrastay Lipstick Duo",
    sub: "1 batch",
    category: "Setting Spray",
    batches: 1,
    images: 12,
    reviewPct: 100,
    tags: ["Website Heroes"],
    updated: "1w ago",
  },
];

export const reviewQueue = {
  pendingBatchReview: [
    {
      batchId: "#007",
      product: "Matte Setting Powder",
      meta: "Concealer · 16 images · Generated yesterday",
    },
  ],
  inIndividualReview: [
    {
      batchId: "#008",
      product: "AOF Dewy Foundation — Shade 07",
      meta: "AOF Dewy Foundation · 18 of 24 reviewed · 75% done",
      pct: 75,
    },
    {
      batchId: "#002",
      product: "SUGAR Pop Lipstick Duo",
      meta: "Lip Liner · 10 of 20 reviewed · 50% done",
      pct: 50,
    },
  ],
  complete: [
    {
      batchId: "#006",
      product: "Ultrastay Transferproof Lipstick — Shade 13",
      meta: "Ultrastay Lipstick · 18 approved, 2 rejected · 3 days ago",
    },
    {
      batchId: "#003",
      product: "AOF Dewy Foundation — Shade 20",
      meta: "AOF Dewy Foundation · 22 approved, 2 rejected · 5 days ago",
    },
  ],
};

export const brand = {
  name: "SUGAR Cosmetics",
  plan: "Solo plan",
  created: "30 Apr 2026",
  tagline: "Modern essentials for everyday style",
  personality:
    "Indian D2C beauty brand targeting Gen Z & millennials. Bold, playful aesthetic — vibrant colour-pop, clean studio photography.",
  ageRange: "22 – 35",
  gender: "Unisex",
  positioning: ["Budget", "Mid-range", "Premium", "Luxury"],
  positioningSelected: ["Mid-range"],
  aesthetic: [
    "Minimalist",
    "Earthy",
    "Editorial",
    "Streetwear",
    "Maximalist",
    "Ethnic fusion",
    "Athleisure",
    "Boho",
  ],
  aestheticSelected: ["Minimalist", "Earthy", "Editorial"],
};
