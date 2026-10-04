"use client";

import { useEffect, useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { StepWizard } from "@/components/ui/StepWizard";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ToggleChip } from "@/components/ui/ToggleChip";
import { ImageResultGrid } from "@/components/ui/ImageResultGrid";
import { CategoryPicker } from "@/components/generate/CategoryPicker";
import { ResultsRevealGrid } from "@/components/generate/ResultsRevealGrid";
import { useSimulatedUpload } from "@/components/ui/useSimulatedUpload";
import { useObjectUrls } from "@/components/ui/useObjectUrls";
import { UploadTrainingPanel } from "@/components/ui/UploadTrainingPanel";
import { generateResults, foundationShades, lipstickShades, foundationSkus, lipstickSkus, type SkuOption } from "@/lib/mock-data";
import type { ResultImage } from "@/lib/results";

type ProductLine = "foundation" | "lipstick";

function productLineFor(categoryName: string): ProductLine | null {
  if (categoryName === "Foundation") return "foundation";
  if (categoryName === "Ultrastay Lipstick") return "lipstick";
  return null;
}

function skuLabelFor(line: ProductLine): string {
  return line === "foundation" ? "AOF Dewy Foundation" : "Ultrastay Transferproof Lipstick";
}

const STEPS = ["Category", "Upload", "Configure", "Generate", "Review"];

/** Same tier boundaries as CategoryPicker's scoreColor, as a CSS color value
 * so the "Selected category" panel can react to whichever chip is picked. */
function categoryTone(score: number): string {
  if (score >= 80) return "var(--success)";
  if (score >= 60) return "var(--info)";
  if (score >= 40) return "var(--warning)";
  return "var(--danger)";
}

const BACKGROUNDS = [
  { name: "White", style: { background: "#fff" } },
  { name: "Gray", style: { background: "#9CA3AF" } },
  { name: "Black", style: { background: "#111" } },
  { name: "Garden", style: { background: "linear-gradient(135deg,#D1FAE5,#6EE7B7)" } },
  { name: "Urban", style: { background: "linear-gradient(135deg,#FDE68A,#FBBF24)" } },
  { name: "Beach", style: { background: "linear-gradient(135deg,#93C5FD,#60A5FA)" } },
  { name: "Cafe", style: { background: "linear-gradient(135deg,#D4A373,#A98467)" } },
];

export function GenerateClient({
  resultsFoundation,
  resultsLipstick,
}: {
  resultsFoundation: ResultImage[];
  resultsLipstick: ResultImage[];
}) {
  const results = {
    foundation:
      resultsFoundation.length > 0
        ? resultsFoundation.map((r, i) => ({ id: `foundation-live-${i}`, src: r.src, confidence: r.confidence, shotType: r.shotType, shade: r.shade }))
        : generateResults.foundation,
    lipstick:
      resultsLipstick.length > 0
        ? resultsLipstick.map((r, i) => ({ id: `lipstick-live-${i}`, src: r.src, confidence: r.confidence, shotType: r.shotType, shade: r.shade }))
        : generateResults.lipstick,
  };
  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [productName, setProductName] = useState("AOF Dewy Foundation — Shade 05");
  const [category, setCategory] = useState({ name: "Foundation", score: 92 });
  const [background, setBackground] = useState("White");
  // Which specific SKU (shade) within the selected category — this is what
  // makes Generate/Review show the correct color+texture per shade instead
  // of a generic reused product. Defaults to the original hero shade.
  const [selectedShade, setSelectedShade] = useState("05");
  // SKUs the user typed in themselves via "+ Add new SKU" — merged alongside
  // the catalog SKUs for whichever line they were added under. These have no
  // curated result pool on disk, so Generate/Review fall back to the rest of
  // that line's results rather than showing nothing (see shadeScopedResults).
  const [customSkus, setCustomSkus] = useState<Record<ProductLine, SkuOption[]>>({ foundation: [], lipstick: [] });
  const productLine = productLineFor(category.name);
  const baseSkuOptions = productLine === "foundation" ? foundationSkus : productLine === "lipstick" ? lipstickSkus : [];
  const skuOptions = productLine ? [...baseSkuOptions, ...customSkus[productLine]] : [];
  const currentSku = skuOptions.find((s) => s.shade === selectedShade) ?? skuOptions[0];

  function pickCategory(name: string, score: number) {
    setCategory({ name, score });
    const line = productLineFor(name);
    const base = line === "foundation" ? foundationSkus : line === "lipstick" ? lipstickSkus : [];
    const merged = line ? [...base, ...customSkus[line]] : [];
    if (merged.length > 0 && !merged.some((o) => o.shade === selectedShade)) {
      setSelectedShade(merged[0].shade);
    }
  }

  function pickShade(sku: SkuOption, line: ProductLine) {
    setSelectedShade(sku.shade);
    setProductName(`${skuLabelFor(line)} — ${sku.label}`);
  }

  /** Adds a user-typed SKU to the current line and selects it. Reuses an
   * existing SKU instead of creating a duplicate if the typed identifier
   * already matches one. No swatch photo of its own (see SkuGlyph) — Configure's
   * preview falls back to a generic in-line reference photo since there's no
   * real one for a SKU that was just typed in, not uploaded. */
  function addCustomSku(rawShade: string) {
    const shade = rawShade.trim();
    if (!shade || !productLine) return;
    const existing = skuOptions.find((s) => s.shade === shade);
    if (existing) {
      pickShade(existing, productLine);
      return;
    }
    const label = /^\d+$/.test(shade) ? `Shade ${shade}` : shade;
    const swatchSrc = productLine === "foundation" ? foundationShades[6].src : lipstickShades[6].src;
    const sku: SkuOption = { shade, label, swatchSrc };
    setCustomSkus((prev) => ({ ...prev, [productLine]: [...prev[productLine], sku] }));
    pickShade(sku, productLine);
  }

  // Scope the result pool shown in Generate/Review to the selected shade so
  // each SKU visibly keeps its own color/texture instead of a mixed pool of
  // every shade in the category. Falls back to the full pool when a shade
  // has no matching results (e.g. generic categories with no SKU concept).
  const shadeScopedResults = {
    foundation:
      productLine === "foundation" && results.foundation.some((r) => r.shade === selectedShade)
        ? results.foundation.filter((r) => r.shade === selectedShade)
        : results.foundation,
    lipstick:
      productLine === "lipstick" && results.lipstick.some((r) => r.shade === selectedShade)
        ? results.lipstick.filter((r) => r.shade === selectedShade)
        : results.lipstick,
  };
  // Whether the selected SKU has its own curated result files on disk, vs.
  // falling back to the rest of the line's pool above — surfaced in the
  // Results header so a freshly-added SKU doesn't silently show generic
  // images with no explanation.
  const hasOwnResults = {
    foundation: results.foundation.some((r) => r.shade === selectedShade),
    lipstick: results.lipstick.some((r) => r.shade === selectedShade),
  };

  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [activeProduct, setActiveProduct] = useState<"foundation" | "lipstick">("foundation");
  const [toolboxOpen, setToolboxOpen] = useState(false);

  const [reviewFilter, setReviewFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");
  // Bumped once per completed generation — tells ResultsRevealGrid to roll a
  // fresh set of simulated self-retries, independent of re-renders caused by
  // toggling the product tab or the config toolbox.
  const [revealToken, setRevealToken] = useState(0);

  function goto(n: number) {
    setStep(n);
    setMaxReached((m) => Math.max(m, n));
  }

  function startGeneration() {
    if (productLine) setActiveProduct(productLine);
    goto(3);
    setGenerating(true);
    setShowResults(false);
    setRevealed(false);
    setProgress(0);
  }

  useEffect(() => {
    if (!generating) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setGenerating(false);
          setShowResults(true);
          setRevealToken((t) => t + 1);
          setTimeout(() => setRevealed(true), 60);
          return 100;
        }
        return p + 4;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [generating]);

  function skipToResults() {
    setGenerating(false);
    setProgress(100);
    setShowResults(true);
    setRevealed(true);
    setRevealToken((t) => t + 1);
  }

  // Identifies which SKU the Upload step is currently for — switching this
  // (picking a different shade/category back on the Category step) swaps
  // out whatever's been uploaded so a different SKU's Upload step doesn't
  // start pre-loaded with the last SKU's photo. See useSimulatedUpload's
  // cacheKey doc for why this is a swap, not a hard reset.
  const uploadCacheKey = productLine ? `${category.name}::${selectedShade}` : category.name;
  const {
    phase: uploadPhase,
    progress: uploadProgress,
    fileNames: uploadFileNames,
    files: uploadFiles,
    openPicker: openUploadPicker,
    inputRef: uploadInputRef,
    handleFileChange: handleUploadFileChange,
    handleDrop: handleUploadDrop,
  } = useSimulatedUpload({ cacheKey: uploadCacheKey });
  const uploadPreviews = useObjectUrls(uploadFiles);
  const uploadSkuLabel = currentSku ? `${skuLabelFor(productLine as ProductLine)} — ${currentSku.label}` : category.name;
  const [uploadDragActive, setUploadDragActive] = useState(false);
  const [addingSku, setAddingSku] = useState(false);
  const [newSkuDraft, setNewSkuDraft] = useState("");

  function commitNewSku() {
    addCustomSku(newSkuDraft);
    setNewSkuDraft("");
    setAddingSku(false);
  }
  // At least one real photo of this exact SKU is required before Configure
  // is reachable — a generic "skip the upload" path would defeat the point
  // of a per-SKU upload step.
  const MIN_UPLOADS = 1;
  const uploadMinMet = uploadFiles.length >= MIN_UPLOADS;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between rounded-lg border border-glass-border bg-glass px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded bg-accent-sub px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-accent-h">
            New Generation
          </span>
          <span className="font-semibold text-t1">{productName}</span>
          <span className="text-t4">— Batch will be auto-assigned on generate</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-t3">
          <span className="pointer-events-none rounded-full border border-border px-3 py-1">
            {category.name === "Foundation" ? "AOF Dewy Foundation" : category.name}
          </span>
          <span>
            Brand score: <b className="text-t1">{category.score}</b>
          </span>
        </div>
      </div>

      <StepWizard steps={STEPS} current={step} maxReached={maxReached} onStepClick={goto} />

      {step === 0 && (
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <Card>
            <CardHeader title="Name this product" />
            <p className="mb-2 text-[11px] text-t4">
              Give this generation a name — could be a product name, SKU, or any
              identifier your workflow uses.
            </p>
            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. AOF Dewy Foundation — Shade 27, SKU-4821, SS26-Lip-01"
              className="mb-5 w-full rounded-md border border-border bg-s2 px-3 py-2 text-xs text-t1 outline-none focus:border-accent"
            />

            <CardHeader title="Quick start — repeat a recent config" />
            <div className="mb-5 flex flex-wrap gap-1.5">
              {[
                "AOF Dewy Foundation · White BG · Softbox",
                "Eyeshadow Palette · Garden BG · Natural",
                "Lipstick · Studio · Dramatic",
              ].map((preset, i) => (
                <button
                  key={preset}
                  onClick={() => goto(2)}
                  className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
                    i === 0 ? "border-gold bg-gold-sub text-gold" : "border-border text-t3 hover:border-border-h"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            <CardHeader title="Select product category" />
            <p className="mb-3 text-[11px] text-t4">
              Choose the category you&apos;re generating for. This determines
              which AI model and quality thresholds apply.
            </p>
            <CategoryPicker selected={category.name} onSelect={pickCategory} />

            {skuOptions.length > 0 && (
              <>
                <CardHeader title="Select shade" />
                <p className="mb-3 text-[11px] text-t4">
                  Each shade has its own trained color and texture. Pick which
                  SKU this generation is for.
                </p>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  {skuOptions.map((sku) => (
                    <button
                      key={sku.shade}
                      onClick={() => pickShade(sku, productLine as ProductLine)}
                      title={sku.label}
                      className={`flex items-center gap-2 rounded-full border-2 py-1 pl-1 pr-3 text-[11px] font-medium transition-colors ${
                        selectedShade === sku.shade ? "border-accent bg-accent-sub text-accent-h" : "border-border text-t3 hover:border-border-h"
                      }`}
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-glass-border bg-s2 text-t3">
                        <SkuGlyph size={13} />
                      </span>
                      {sku.label}
                    </button>
                  ))}
                  {addingSku ? (
                    <input
                      autoFocus
                      value={newSkuDraft}
                      onChange={(e) => setNewSkuDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitNewSku();
                        if (e.key === "Escape") {
                          setNewSkuDraft("");
                          setAddingSku(false);
                        }
                      }}
                      onBlur={commitNewSku}
                      placeholder="New shade name or number…"
                      className="w-44 rounded-full border border-gold bg-transparent px-3 py-1.5 text-[11px] text-t1 outline-none"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAddingSku(true)}
                      className="rounded-full border border-dashed border-border px-3 py-1.5 text-[11px] font-medium text-t3 transition-colors hover:border-gold hover:text-gold"
                    >
                      + Add new SKU
                    </button>
                  )}
                </div>
              </>
            )}
          </Card>

          <Card className="h-fit">
            <CardHeader title="Selected category" />
            <div
              className="rounded-lg p-5 text-center"
              style={{ background: `color-mix(in srgb, ${categoryTone(category.score)} 12%, transparent)` }}
            >
              {currentSku && (
                <span className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-glass-border bg-s2 text-t3">
                  <SkuGlyph size={30} />
                </span>
              )}
              <div className="text-2xl font-black" style={{ color: categoryTone(category.score) }}>
                {category.name === "Foundation" ? "AOF Dewy Foundation" : category.name}
              </div>
              {currentSku && <div className="mt-0.5 text-xs font-semibold text-t3">{currentSku.label}</div>}
              <div className="mt-2 text-xs text-t3">
                Brand score:{" "}
                <b className="font-extrabold" style={{ color: categoryTone(category.score) }}>
                  {category.score}
                </b>
                {" — "}
                {category.score >= 80 ? "Excellent" : category.score >= 60 ? "Good" : category.score >= 40 ? "Fair" : "Needs work"}
              </div>
              <p className="mt-3 text-[11px] text-t4">
                {category.score >= 80
                  ? "AI model is fully trained for this category. Expected approval rate: 90%+"
                  : category.score >= 40
                    ? "AI model has partial training data for this category. Expect more variability."
                    : "AI model has limited training data for this category."}
              </p>
            </div>
            {category.score < 40 && (
              <div className="mt-4 rounded-md bg-warning-sub px-2.5 py-2.5 text-[10px] text-warning">
                Brand score below 40. Generation quality may be inconsistent.
                Consider uploading more references first.
              </div>
            )}
            <Button variant="primary" onClick={() => goto(1)} className="mt-5 w-full justify-center">
              Continue to Upload
            </Button>
          </Card>
        </div>
      )}

      {step === 1 && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card
            className={`flex flex-col items-center justify-center gap-3 border-dashed p-12 text-center transition-colors ${
              uploadDragActive ? "border-accent bg-accent-sub/40" : ""
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setUploadDragActive(true);
            }}
            onDragLeave={() => setUploadDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setUploadDragActive(false);
              handleUploadDrop(e.dataTransfer.files);
            }}
          >
            <input
              ref={uploadInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUploadFileChange}
            />
            <div className="mb-1 text-[9px] font-bold uppercase tracking-wide text-accent-h">
              Photo for {uploadSkuLabel}
            </div>
            {uploadPhase === "idle" ? (
              <>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-t4">
                  <path d="M12 16V4m0 0L7 9m5-5 5 5" />
                  <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
                </svg>
                <div className="text-sm text-t2">Drop a real photo of this product here</div>
                <div className="text-[10.5px] text-t4">PNG, JPG, TIFF up to 50MB · at least {MIN_UPLOADS} photo of this exact SKU required</div>
                <div className="mt-2 flex gap-2">
                  <Button onClick={openUploadPicker}>Select file</Button>
                </div>
              </>
            ) : (
              <>
                <UploadTrainingPanel phase={uploadPhase} progress={uploadProgress} fileNames={uploadFileNames} previews={uploadPreviews} skuLabel={uploadSkuLabel} />
                {uploadPhase === "done" && (
                  <Button onClick={openUploadPicker}>Add another photo</Button>
                )}
              </>
            )}
          </Card>
          <Card>
            <CardHeader title="Selected product" />
            <div className="flex items-center gap-3 rounded-lg border border-glass-border bg-s2 p-3">
              {currentSku && (
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-glass-border bg-s3 text-t3">
                  {uploadPreviews.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element -- blob: object URL for a real upload
                    <img src={uploadPreviews[0]} alt="" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <SkuGlyph size={26} />
                  )}
                </span>
              )}
              <div>
                <div className="text-sm font-bold text-t1">{uploadSkuLabel}</div>
                <div className="text-[11px] text-t4">
                  {category.name === "Foundation" ? "AOF Dewy Foundation" : category.name}
                </div>
              </div>
            </div>
            <p className="mb-1 mt-4 text-[11px] text-t4">
              {uploadMinMet
                ? `${uploadFiles.length} photo${uploadFiles.length === 1 ? "" : "s"} uploaded for this SKU.`
                : `Upload at least ${MIN_UPLOADS} real photo of ${uploadSkuLabel} before continuing.`}
            </p>
            <p className="mb-4 text-[9px] tracking-wide text-t4">
              {uploadFiles.length} of {MIN_UPLOADS} minimum uploaded
            </p>
            <Button
              variant="primary"
              disabled={!uploadMinMet}
              onClick={() => uploadMinMet && goto(2)}
              className={`w-full justify-center ${!uploadMinMet ? "cursor-not-allowed opacity-40 hover:translate-y-0 hover:shadow-none" : ""}`}
            >
              Continue to Configure
            </Button>
          </Card>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <Card>
            <SectionLabel letter="A" title="Image Type" sub="Select which shot types to generate for each product" />
            <ImageTypeSection />

            <SectionLabel letter="B" title="Model Configuration" sub="Only for model-on-body shots" />
            <div className="mb-5 grid grid-cols-2 gap-3">
              <ChipGroup title="Gender" chips={["Female", "Male", "Non-binary"]} on={[0]} inline />
              <SelectField label="Ethnicity" options={["South Asian", "East Asian", "European", "African", "Middle Eastern", "Latin American", "Mixed"]} />
              <SelectField label="Body type" options={["Standard", "Plus size", "Petite", "Athletic", "Tall"]} />
              <SelectField label="Age range" options={["18-25", "25-35", "35-45", "45+"]} />
              <SelectField label="Skin tone" options={["Light", "Medium", "Tan", "Brown", "Dark"]} />
            </div>

            <SectionLabel letter="C" title="Background & Lighting" />
            <div className="mb-3 flex flex-wrap gap-2">
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg.name}
                  onClick={() => setBackground(bg.name)}
                  title={bg.name}
                  style={bg.style}
                  className={`h-11 w-11 rounded-md border-2 transition-all ${
                    background === bg.name ? "border-accent" : "border-border"
                  }`}
                />
              ))}
              <button className="flex h-11 w-11 items-center justify-center rounded-md border border-dashed border-border text-[10px] text-t4">
                +8
              </button>
            </div>
            <ChipGroup title="Lighting" chips={["Softbox", "Rim light", "Natural daylight", "Dramatic", "High-key", "Low-key"]} on={[0]} />
            <div className="grid grid-cols-3 gap-3">
              <SelectField label="Resolution" options={["2048px", "1024px", "4096px"]} />
              <SelectField label="Format" options={["PNG", "JPEG", "WebP"]} />
              <SelectField label="Aspect" options={["3:4", "1:1", "4:5", "16:9"]} />
            </div>
            <Button variant="primary" onClick={startGeneration} className="mt-5">
              Start generation
            </Button>
          </Card>

          <Card className="relative h-fit overflow-hidden p-0">
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={currentSku ? currentSku.swatchSrc : foundationShades[6].src}
                alt=""
                fill
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-3 pt-8">
                <div className="text-[10px] font-bold uppercase tracking-wide text-white/70">AI Preview</div>
                <div className="text-[11px] text-white">
                  {currentSku
                    ? `${skuLabelFor(productLine as ProductLine)} — ${currentSku.label} · Full front + back · ${background} BG · Softbox`
                    : `${category.name} · Full front + back · ${background} BG · Softbox`}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {step === 3 && (
        <>
          {!showResults && (
            <Card className="flex flex-col items-center gap-3 py-14 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              <div className="text-sm font-semibold text-t1">Generating catalog images...</div>
              <div className="text-[11px] text-t4">
                {productName} · {category.name === "Foundation" ? "AOF Dewy Foundation" : category.name} · 48 SKUs
              </div>
              <div className="text-[10.5px] text-t4">STAMP AI v3.2 · Batch will be created on completion</div>
              <div className="mt-3 h-1.5 w-64 overflow-hidden rounded-full bg-s2">
                <div className="h-full rounded-full bg-accent transition-all duration-150" style={{ width: `${progress}%` }} />
              </div>
              <div className="text-[10.5px] text-t4">
                {Math.round((progress / 100) * 48)} / 48 · ~{Math.max(0, Math.round((100 - progress) / 25))} min remaining
              </div>
              <Button onClick={skipToResults} size="sm">
                Skip to results
              </Button>
            </Card>
          )}

          {showResults && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-t1">Results</div>
                  <div className="text-[11px] text-t4">
                    {activeProduct === "foundation"
                      ? `AOF Dewy Foundation${productLine === "foundation" && currentSku ? ` — ${currentSku.label}` : ""} · ${shadeScopedResults.foundation.length} images`
                      : `Ultrastay Transferproof Lipstick${productLine === "lipstick" && currentSku ? ` — ${currentSku.label}` : ""} · ${shadeScopedResults.lipstick.length} images`}
                  </div>
                  {productLine === activeProduct && !hasOwnResults[activeProduct] && (
                    <div className="mt-0.5 text-[10.5px] text-warning">
                      No curated results for this SKU yet — showing the rest of {activeProduct === "foundation" ? "AOF Dewy Foundation" : "Ultrastay Transferproof Lipstick"}&apos;s pool until dedicated results are generated.
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => goto(2)}>Back to Configure</Button>
                  <Button size="sm" onClick={() => setToolboxOpen((v) => !v)}>Config toolbox</Button>
                  <Button size="sm">Download all</Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => goto(4)}
                    title="Creates a new batch under your product and sends it to the Review Queue"
                  >
                    Create Batch & Review
                  </Button>
                </div>
              </div>

              <div className="mb-3 flex gap-1.5">
                <button
                  onClick={() => setActiveProduct("foundation")}
                  className={`rounded-full border px-3 py-1 text-[11px] font-medium ${
                    activeProduct === "foundation" ? "border-gold bg-gold-sub text-gold" : "border-border text-t3"
                  }`}
                >
                  AOF Dewy Foundation
                </button>
                <button
                  onClick={() => setActiveProduct("lipstick")}
                  className={`rounded-full border px-3 py-1 text-[11px] font-medium ${
                    activeProduct === "lipstick" ? "border-gold bg-gold-sub text-gold" : "border-border text-t3"
                  }`}
                >
                  Ultrastay Transferproof Lipstick
                </button>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <ResultsRevealGrid
                    foundationImages={shadeScopedResults.foundation}
                    lipstickImages={shadeScopedResults.lipstick}
                    activeProduct={activeProduct}
                    revealToken={revealToken}
                    revealed={revealed}
                  />
                </div>

                {toolboxOpen && (
                  <Card className="w-[280px] shrink-0">
                    <CardHeader title="Quick config" action={
                      <button onClick={() => setToolboxOpen(false)} className="text-t4">×</button>
                    } />
                    <ChipGroup title="Image type" chips={["Front", "Back", "Side", "Close-up", "Flat lay"]} on={[0, 1]} />
                    <div className="mb-3 flex gap-2">
                      {["White", "Gray", "Black"].map((b, i) => (
                        <button key={b} className={`h-8 w-8 rounded-md border-2 ${i === 0 ? "border-accent bg-white" : "border-border"}`} style={i === 1 ? { background: "#9CA3AF" } : i === 2 ? { background: "#111" } : {}} />
                      ))}
                    </div>
                    <SelectField label="Lighting" options={["Softbox", "Rim light", "Natural", "Dramatic"]} />
                    <SelectField label="Resolution" options={["2048px", "1024px", "4096px"]} />
                    <Button variant="primary" className="mt-3 w-full justify-center">Regenerate</Button>
                  </Card>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {step === 4 && (
        <ReviewStep
          reviewFilter={reviewFilter}
          setReviewFilter={setReviewFilter}
          onBackToResults={() => goto(3)}
          images={shadeScopedResults[activeProduct]}
          productLabel={
            activeProduct === "foundation"
              ? `AOF Dewy Foundation${productLine === "foundation" && currentSku ? ` — ${currentSku.label}` : ""}`
              : `Ultrastay Transferproof Lipstick${productLine === "lipstick" && currentSku ? ` — ${currentSku.label}` : ""}`
          }
        />
      )}
    </div>
  );
}

/**
 * Generic product-bottle glyph, standing in for a shade's swatch photo
 * anywhere before the user has actually uploaded something for this
 * generation (the shade chips and "Selected category" panel on the Category
 * step). Deliberately not the shade's real reference photo — showing that
 * before an upload happened is the same "implied but not actually provided"
 * bug the onboarding flow had.
 */
function SkuGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2h6v3.2c0 .5.2 1 .6 1.4l1.4 1.4c.6.6 1 1.5 1 2.4V20a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V10.4c0-.9.4-1.8 1-2.4l1.4-1.4c.4-.4.6-.9.6-1.4Z" />
      <path d="M8 13h8" />
    </svg>
  );
}

function SectionLabel({ letter, title, sub }: { letter: string; title: string; sub?: string }) {
  return (
    <div className="mb-2.5 mt-5 first:mt-0">
      <div className="flex items-center gap-2 text-xs font-bold text-t1">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-sub text-[10px] text-accent-h">
          {letter}
        </span>
        {title}
      </div>
      {sub && <p className="ml-7 mt-0.5 text-[10.5px] text-t4">{sub}</p>}
    </div>
  );
}

function ChipGroup({ title, chips, on, inline }: { title: string; chips: string[]; on: number[]; inline?: boolean }) {
  return (
    <div className={inline ? "" : "mb-3"}>
      <div className="mb-1.5 text-[10.5px] font-semibold text-t3">{title}</div>
      <div className="flex flex-wrap gap-1.5">
        {chips.map((c, i) => (
          <ToggleChip key={c} label={c} defaultSelected={on.includes(i)} />
        ))}
      </div>
    </div>
  );
}

/**
 * Cosmetics shot-type taxonomy, aligned with the shot types results.ts
 * actually scores (studio/texture/flatlay/hand/closeup/environment/model) —
 * not the apparel taxonomy (collar detail, mannequin, hanger shot, etc.)
 * that made no sense for a lipstick or foundation bottle. Ends with a
 * "+ Add custom shot type" control using the same inline-input pattern as
 * CategoryGroup's "+ Add".
 */
function ImageTypeSection() {
  const [custom, setCustom] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  function commitDraft() {
    const trimmed = draft.trim();
    if (trimmed && !custom.includes(trimmed)) {
      setCustom((prev) => [...prev, trimmed]);
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
    <>
      <ChipGroup title="Studio" chips={["Studio hero", "Flat lay", "Texture / swatch macro"]} on={[0, 1]} />
      <ChipGroup title="Application" chips={["Hand / application shot", "Close-up detail"]} on={[0]} />
      <ChipGroup title="Lifestyle" chips={["Environment shot (vanity)", "Environment shot (bathroom / travel)"]} on={[]} />
      <ChipGroup title="On-model" chips={["Face close-up", "Lips close-up", "3/4 angle"]} on={[]} />
      <div className="mb-3">
        <div className="mb-1.5 text-[10.5px] font-semibold text-t3">Custom</div>
        <div className="flex flex-wrap gap-1.5">
          {custom.map((c) => (
            <ToggleChip key={c} label={c} defaultSelected />
          ))}
          {adding ? (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={commitDraft}
              placeholder="New shot type…"
              className="w-40 rounded-full border border-gold bg-transparent px-3 py-1 text-[11px] text-t1 outline-none"
            />
          ) : (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="rounded-full border border-dashed border-border px-3 py-1 text-[11px] font-medium text-t3 transition-colors hover:border-gold hover:text-gold"
            >
              + Add custom shot type
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function SelectField({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10.5px] font-semibold text-t3">{label}</label>
      <select className="rounded-md border border-border bg-s2 px-2 py-1.5 text-[11px] text-t1 outline-none focus:border-accent">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function ReviewStep({
  reviewFilter,
  setReviewFilter,
  onBackToResults,
  images,
  productLabel,
}: {
  reviewFilter: string;
  setReviewFilter: (f: "all" | "approved" | "pending" | "rejected") => void;
  onBackToResults: () => void;
  images: { id: string; src: string; confidence: number }[];
  productLabel?: string;
}) {
  const router = useRouter();
  const statuses = ["approved", "approved", "pending", "rejected", "approved", "approved", "rejected", "approved"] as const;
  const pool = images.length > 0 ? images : generateResults.foundation;
  // Synthesize a fresh id per grid position (review-0, review-1, ...) rather
  // than reusing the underlying pool item's id — the pool is shorter than
  // the 8 slots shown, so cycling with `i % pool.length` reuses the same
  // source image more than once, and reusing its id too produced duplicate
  // React keys ("foundation-live-0" appearing at both position 0 and 7).
  const allImages = Array.from({ length: 8 }, (_, i) => {
    const r = pool[i % pool.length];
    return { id: `review-${i}`, src: r.src, confidence: r.confidence, status: statuses[i] };
  });
  const filtered = reviewFilter === "all" ? allImages : allImages.filter((i) => i.status === reviewFilter);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-t1">Review workspace</div>
          <div className="text-[11px] text-t4">48 images · {productLabel ?? "AOF Dewy Foundation"}</div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={onBackToResults}>Back to Results</Button>
          <Button size="sm" onClick={() => router.push("/export")}>Export approved</Button>
          <Button variant="primary" size="sm">Approve all selected</Button>
        </div>
      </div>

      <div className="mb-3 flex gap-1.5">
        {(["all", "approved", "pending", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setReviewFilter(f)}
            className={`rounded-full border px-3 py-1 text-[11px] font-medium capitalize ${
              reviewFilter === f ? "border-gold bg-gold-sub text-gold" : "border-border text-t3"
            }`}
          >
            {f} ({f === "all" ? 48 : f === "approved" ? 36 : f === "pending" ? 8 : 4})
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <ImageResultGrid columns={4} images={filtered} selectable />

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title="Editing instruction" />
            <textarea
              rows={3}
              placeholder="e.g. Make the pose slightly more angled, remove shadow on left side..."
              className="mb-2 w-full resize-none rounded-md border border-border bg-s2 px-3 py-2 text-xs text-t1 outline-none focus:border-accent"
            />
            <Button size="sm">Regenerate with instructions</Button>
          </Card>
          <Card>
            <CardHeader title="Color variants" />
            <p className="mb-2 text-[10.5px] text-t4">Generate same image in different shade variants.</p>
            <div className="mb-3 flex gap-1.5">
              {["#fff", "#1E293B", "#2563EB", "#DC2626", "#16A34A"].map((c, i) => (
                <button key={c} style={{ background: c }} className={`h-6 w-6 rounded-full border-2 ${i === 0 ? "border-accent" : "border-border"}`} />
              ))}
              <button className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-border text-[10px] text-t4">+</button>
            </div>
            <Button size="sm">Generate color variants</Button>
          </Card>
          <Card>
            <CardHeader title="Color correction" />
            <SliderRow label="Hue" value="0°" />
            <SliderRow label="Saturation" value="100%" />
            <SliderRow label="Brightness" value="50%" />
            <div className="mb-1.5 mt-3 text-[10.5px] font-semibold text-t3">RGB channels</div>
            <SliderRow label="Red" value="0" />
            <SliderRow label="Green" value="0" />
            <SliderRow label="Blue" value="0" />
            <SliderRow label="Luminance" value="50%" />
            <Button size="sm" className="mt-2">Apply corrections</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SliderRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-2.5">
      <div className="mb-1 flex justify-between text-[10.5px] text-t3">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <input type="range" className="w-full accent-accent" />
    </div>
  );
}
