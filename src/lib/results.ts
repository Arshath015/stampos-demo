import fs from "fs";
import path from "path";

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

/**
 * Confidence range per shot type, matched against a keyword anywhere in the
 * filename (see parseShotType below). Studio/texture shots are close-up,
 * controlled conditions — AI nails these consistently, so the range is
 * narrow and high. Model/environment shots involve pose, framing, and scene
 * composition — much more variable, so the range is wider and lower on
 * average.
 */
const SHOT_TYPE_RANGES: Record<string, [number, number]> = {
  studio: [90, 97],
  texture: [87, 95],
  flatlay: [85, 93],
  closeup: [85, 93],
  hand: [80, 90],
  environment: [68, 89],
  model: [65, 91],
};
const DEFAULT_RANGE: [number, number] = [75, 90];

/**
 * One legacy result set predates the shade-numbered naming convention and
 * was generated under the codename "pop" before we confirmed which shade it
 * actually was (it's Ultrastay Transferproof Lipstick Shade 13 — verified
 * byte-for-byte against the source asset folder). The files themselves are
 * deliberately left named `lipstick-pop-*` (do not rename working results),
 * but everywhere the app needs a real shade identifier, "pop" resolves to
 * "13" via this alias.
 */
const SHADE_ALIAS: Record<string, string> = { pop: "13" };

/**
 * Deterministic (not random-per-render) hash so the same file always scores
 * the same confidence across reloads.
 */
function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(h, 31) + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

/**
 * Naming convention: {product}-{shade}-{shot-type}[-{index}].{ext}
 *   e.g. foundation-05-studio.png, lipstick-04-environment-2.png
 * The shot-type is whichever known keyword appears as a hyphen-separated
 * segment in the filename (a trailing numeric segment like "-1"/"-2" for
 * multiple shots of the same type is ignored). Unrecognized/missing shot
 * types fall back to a mid-range default rather than failing.
 */
function parseShotType(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, "");
  const segments = base.split("-");
  for (const segment of segments) {
    if (segment in SHOT_TYPE_RANGES) return segment;
  }
  return "default";
}

/**
 * The shade identifier is always the second hyphen-segment
 * ({product}-{shade}-...), aliased through SHADE_ALIAS for the one legacy
 * exception documented above.
 */
function parseShade(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, "");
  const segments = base.split("-");
  const raw = segments[1] ?? "unknown";
  return SHADE_ALIAS[raw] ?? raw;
}

function confidenceForFile(filename: string): number {
  const shotType = parseShotType(filename);
  const [lo, hi] = SHOT_TYPE_RANGES[shotType] ?? DEFAULT_RANGE;
  const frac = (hashString(filename) % 1000) / 1000;
  return Math.round(lo + frac * (hi - lo));
}

export interface ResultImage {
  src: string;
  confidence: number;
  shotType: string;
  /** Normalized shade id, e.g. "05", "13" (see SHADE_ALIAS). */
  shade: string;
}

/**
 * Reads whatever's actually on disk under /public/images/results/<product>
 * and assigns each file a plausible confidence score based on its shot type
 * (see SHOT_TYPE_RANGES above), plus the shade it belongs to (see
 * parseShade). Drop AI-generated output files into that folder — named per
 * the convention documented on parseShotType/parseShade — and they show up
 * here automatically, scored and grouped appropriately, no code changes
 * needed. Server-only (uses node `fs`), so only import this from a Server
 * Component / page, never a "use client" file.
 */
export function getResultImages(product: "foundation" | "lipstick"): ResultImage[] {
  const dir = path.join(process.cwd(), "public", "images", "results", product);
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
      .sort()
      .map((f) => ({
        src: `/images/results/${product}/${f}`,
        confidence: confidenceForFile(f),
        shotType: parseShotType(f),
        shade: parseShade(f),
      }));
  } catch {
    return [];
  }
}

/** Same as getResultImages, filtered to a single shade (e.g. "05", "13"). */
export function getResultImagesForShade(product: "foundation" | "lipstick", shade: string): ResultImage[] {
  return getResultImages(product).filter((r) => r.shade === shade);
}

/** Every shade id that currently has at least one result image on disk, sorted. */
export function getResultShades(product: "foundation" | "lipstick"): string[] {
  const shades = new Set(getResultImages(product).map((r) => r.shade));
  return Array.from(shades).sort();
}

/**
 * Every shade grouped under its own array — the shape most Generate/Review
 * screens actually want (one product's SKUs, each with its own 7-ish
 * results), rather than one flat mixed pool.
 */
export function getResultImagesByShade(product: "foundation" | "lipstick"): Record<string, ResultImage[]> {
  const grouped: Record<string, ResultImage[]> = {};
  for (const img of getResultImages(product)) {
    (grouped[img.shade] ??= []).push(img);
  }
  return grouped;
}

/** Back-compat: plain path list, no confidence scoring. */
export function getResultImagePaths(product: "foundation" | "lipstick"): string[] {
  return getResultImages(product).map((r) => r.src);
}
