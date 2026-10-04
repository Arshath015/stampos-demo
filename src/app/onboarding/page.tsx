"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import {
  OnboardingShell,
  OnboardingSplit,
  StepIndicator,
  ONBOARDING_STEPS,
} from "@/components/onboarding/OnboardingShell";
import { AbstractBackground } from "@/components/ui/AbstractBackground";
import { RadioCard } from "@/components/ui/RadioCard";
import { CategorySection } from "@/components/ui/CategoryGroup";
import { useObjectUrls } from "@/components/ui/useObjectUrls";
import { categoryTaxonomy, defaultSelectedChips } from "@/lib/mock-data";

const ROLES = [
  { value: "photographer", title: "Photographer", desc: "I shoot product images for brands" },
  { value: "founder", title: "D2C Founder", desc: "I run my own brand and need catalog images" },
  { value: "designer", title: "Freelance Designer", desc: "I create visuals for multiple clients" },
  { value: "manager", title: "Catalog Manager", desc: "I manage product shoots and image pipelines" },
];

const BACKGROUNDS = [
  { value: "white", title: "White studio" },
  { value: "gradient", title: "Gradient" },
  { value: "later", title: "Decide later" },
];

const IMAGE_TYPES = [
  { value: "on-model", title: "On-model", desc: "AI-generated model" },
  { value: "ghost", title: "Ghost mannequin", desc: "Invisible form" },
  { value: "flat-lay", title: "Flat lay", desc: "Product only" },
  { value: "later", title: "Decide later", desc: "Choose per generation" },
];

// Accent colors assigned to industries added beyond the built-in
// gold (Beauty & Cosmetics) / purple (Fashion & Apparel) pair — cycles if
// someone adds more than four.
const NEW_INDUSTRY_ACCENTS = ["#2DD4BF", "#F472B6", "#60A5FA", "#FB923C"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [role, setRole] = useState("founder");
  const [roleOther, setRoleOther] = useState("");
  const [brandName, setBrandName] = useState("");
  const [audience, setAudience] = useState("");
  const [aesthetic, setAesthetic] = useState("");
  const [background, setBackground] = useState("white");
  const [imageType, setImageType] = useState("on-model");
  const [logoFiles, setLogoFiles] = useState<File[]>([]);
  const [refFiles, setRefFiles] = useState<File[]>([]);
  const logoPreviews = useObjectUrls(logoFiles);
  const refPreviews = useObjectUrls(refFiles);
  const refPickerRef = useRef<HTMLInputElement | null>(null);
  // Top-level industries/verticals on the "what does your brand sell" step —
  // seeded from the built-in taxonomy, extendable with brand-new industries
  // beyond Beauty/Fashion (e.g. "Skincare", "Home Goods").
  const [industries, setIndustries] = useState(categoryTaxonomy);

  function addIndustry() {
    const name = window.prompt("Name this industry:");
    const trimmed = name?.trim();
    if (!trimmed) return;
    const accent = NEW_INDUSTRY_ACCENTS[(industries.length - 2) % NEW_INDUSTRY_ACCENTS.length];
    setIndustries((prev) => [...prev, { label: trimmed, accent, subgroups: [] }]);
  }

  const last = step === ONBOARDING_STEPS.length - 1;
  function next() {
    if (!last) setStep((s) => s + 1);
  }
  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <OnboardingShell step={step} onBack={back}>
      {step === 0 && (
        <OnboardingSplit
          vis={
            <>
              <AbstractBackground variant="s1" />
              <div className="relative z-[2] max-w-[480px] px-12 py-16 text-white">
                <div className="mb-4 text-[9px] uppercase tracking-[3px] text-white/50">
                  Welcome to
                </div>
                <div className="font-serif text-[52px] font-extralight leading-[1.05] tracking-[-1px]">
                  STAMP
                  <br />
                  <em className="not-italic text-gold">OS</em>
                </div>
                <div className="mt-4 max-w-[320px] text-[13px] leading-[1.6] text-white/60">
                  The AI-powered cosmetics catalog platform trusted by brands
                  generating millions of product images.
                </div>
                <div className="mt-8 flex gap-8">
                  <VisStat n="10M+" l="Images generated" />
                  <VisStat n="94%" l="Approval rate" />
                  <VisStat n="18s" l="Per image" />
                </div>
              </div>
            </>
          }
        >
          <StepIndicator total={7} current={0} />
          <h1 className="mb-3 font-serif text-4xl font-light leading-[1.2] tracking-tight text-[#f8f8f2]">
            What should we
            <br />
            call <em className="text-gold not-italic">you</em>?
          </h1>
          <p className="mb-8 text-[13px] leading-relaxed text-white/50">
            Just your first name — we like to keep things personal.
          </p>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full border-b border-white/20 bg-transparent py-4 font-serif text-lg font-light text-[#f8f8f2] outline-none transition-colors placeholder:text-white/25 focus:border-gold"
          />
          <NextButton onClick={next} />
        </OnboardingSplit>
      )}

      {step === 1 && (
        <OnboardingSplit
          overlay="linear-gradient(180deg,rgba(10,10,11,0.3),rgba(10,10,11,0.8))"
          vis={
            <>
              <AbstractBackground variant="s2" />
              <div className="absolute bottom-12 left-12 z-[2] text-white">
                <div className="mb-2 text-[9px] uppercase tracking-[3px] text-white/40">
                  Built for
                </div>
                <div className="font-serif text-[28px] font-light leading-[1.3] text-white/90">
                  Photographers.
                  <br />
                  Founders.
                  <br />
                  Designers.
                  <br />
                  <em className="not-italic text-gold">Creators.</em>
                </div>
              </div>
            </>
          }
        >
          <StepIndicator total={7} current={1} />
          <h1 className="mb-3 font-serif text-4xl font-light leading-[1.2] tracking-tight text-[#f8f8f2]">
            What do <em className="text-gold not-italic">you</em> do?
          </h1>
          <p className="mb-8 text-[13px] leading-relaxed text-white/50">
            We&apos;ll tailor your workspace to match your workflow.
          </p>
          <div className="grid grid-cols-2 gap-3 text-left">
            {ROLES.map((r) => (
              <RadioCard
                key={r.value}
                selected={role === r.value}
                onSelect={() => setRole(r.value)}
                title={r.title}
                description={r.desc}
                icon={<RoleIcon value={r.value} />}
              />
            ))}
            <RadioCard
              selected={role === "other"}
              onSelect={() => setRole("other")}
              title="Other"
              description="Tell us what you do"
              icon={<RoleIcon value="other" />}
              className="col-span-2"
            />
            {role === "other" && (
              <input
                value={roleOther}
                onChange={(e) => setRoleOther(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="e.g. Marketing manager, agency owner..."
                className="col-span-2 -mt-1 w-full border-b border-white/20 bg-transparent py-2 text-sm text-[#f8f8f2] outline-none focus:border-gold"
              />
            )}
          </div>
          <NextButton onClick={next} />
        </OnboardingSplit>
      )}

      {step === 2 && (
        <div className="flex min-h-screen w-full flex-col items-center px-6 pb-12 pt-20 lg:px-10">
          <div
            className="fixed inset-0 z-0 opacity-[0.06]"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(201,169,110,0.5), transparent 45%), radial-gradient(circle at 75% 65%, rgba(167,139,250,0.35), transparent 50%)",
            }}
          />
          <div className="relative z-[1] w-full max-w-6xl text-center">
            <StepIndicator total={7} current={2} center />
            <h1 className="mb-3 font-serif text-4xl font-light leading-[1.2] tracking-tight text-[#f8f8f2]">
              What does your brand <em className="text-gold not-italic">sell</em>?
            </h1>
            <p className="mb-10 text-[13px] leading-relaxed text-white/50">
              Select categories — AI trains a separate model per segment for
              higher accuracy.
            </p>
            <div className="text-left">
              {industries.map((group) => (
                <CategorySection
                  key={group.label}
                  label={group.label}
                  accent={group.accent}
                  subgroups={group.subgroups}
                  defaultSelected={group.label === "Beauty & Cosmetics" ? defaultSelectedChips : undefined}
                />
              ))}
              <button
                type="button"
                onClick={addIndustry}
                className="mb-8 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 py-5 text-[12px] font-semibold uppercase tracking-wide text-white/45 transition-colors hover:border-gold hover:text-gold"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Add new industry
              </button>
            </div>
            <p className="mb-3 text-[10px] tracking-wide text-white/35">
              You can add more categories later from Brand Settings
            </p>
            <NextButton onClick={next} />
          </div>
        </div>
      )}

      {step === 3 && (
        <OnboardingSplit
          overlay="linear-gradient(135deg,rgba(10,10,11,0.5),rgba(10,10,11,0.85))"
          vis={
            <>
              <AbstractBackground variant="s4" />
              <div className="absolute bottom-12 left-12 z-[2] max-w-[280px] text-white">
                <div className="mb-3 text-[9px] uppercase tracking-[3px] text-white/40">
                  AI Understands Your Brand
                </div>
                <div className="mb-5 text-[15px] leading-[1.6] text-white/65">
                  Your brand name, target audience, and aesthetic teach the AI
                  what &quot;on-brand&quot; looks like — before it ever sees a
                  product photo.
                </div>
                <div className="text-[11px] leading-[1.5] text-white/50">
                  From flat product shot to editorial catalog image.
                  <br />
                  <span className="text-gold">Powered by your brand&apos;s DNA.</span>
                </div>
              </div>
            </>
          }
        >
          <StepIndicator total={7} current={3} />
          <h1 className="mb-3 font-serif text-4xl font-light leading-[1.2] tracking-tight text-[#f8f8f2]">
            Tell us about
            <br />
            your <em className="text-gold not-italic">brand</em>
          </h1>
          <p className="mb-8 text-[13px] leading-relaxed text-white/50">
            AI learns your visual identity from these details.
          </p>
          <div className="flex flex-col gap-1">
            <input
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Brand name"
              className="w-full border-b border-white/20 bg-transparent py-3.5 font-serif text-base font-light text-[#f8f8f2] outline-none focus:border-gold"
            />
            <input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="Target audience — e.g. Women 25-35, urban India"
              className="w-full border-b border-white/20 bg-transparent py-3.5 text-sm text-[#f8f8f2] outline-none focus:border-gold"
            />
            <input
              value={aesthetic}
              onChange={(e) => setAesthetic(e.target.value)}
              placeholder="Aesthetic in 3 words — e.g. Minimal, earthy, editorial"
              className="w-full border-b border-white/20 bg-transparent py-3.5 text-sm text-[#f8f8f2] outline-none focus:border-gold"
            />
          </div>
          <FileDropZone
            label="Optional: Drop your logo here"
            sub="PNG or SVG, transparent background"
            small
            files={logoFiles}
            previews={logoPreviews}
            onFiles={(picked) => setLogoFiles(picked.slice(0, 1))}
          />
          <NextButton onClick={next} />
        </OnboardingSplit>
      )}

      {step === 4 && (
        <OnboardingSplit
          overlay={refPreviews.length > 0 ? null : "linear-gradient(135deg,rgba(10,10,11,0.5),rgba(10,10,11,0.8))"}
          visClassName="bg-[#0d0d0e]"
          vis={
            <>
              {refPreviews.length > 0 ? (
                <div className="grid max-w-[400px] grid-cols-2 gap-2 p-12">
                  {refPreviews.slice(0, 4).map((src, i) => (
                    <div key={i} className="aspect-[3/4] overflow-hidden rounded-lg border border-gold/30">
                      {/* eslint-disable-next-line @next/next/no-img-element -- blob: object URL for a real upload */}
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <AbstractBackground variant="s4" />
              )}
              <div className="absolute bottom-12 left-12 z-[3]">
                <div className="text-[9px] uppercase tracking-[2px] text-white/40">
                  Your references
                </div>
                <div className="mt-1.5 text-[13px] text-white/60">
                  {refFiles.length > 0 ? (
                    <>
                      {refFiles.length} uploaded ·{" "}
                      <span className="text-gold">AI is learning your style</span>
                    </>
                  ) : (
                    <span className="text-white/40">Upload references to begin</span>
                  )}
                </div>
              </div>
            </>
          }
        >
          <StepIndicator total={7} current={4} />
          <h1 className="mb-3 font-serif text-4xl font-light leading-[1.2] tracking-tight text-[#f8f8f2]">
            Show us your
            <br />
            <em className="text-gold not-italic">best</em> shots
          </h1>
          <p className="mb-8 text-[13px] leading-relaxed text-white/50">
            Upload 5–10 reference images. More = better AI accuracy.
          </p>
          <FileDropZone
            label="Drop images here or click to browse"
            sub="JPG, PNG up to 10MB each"
            multiple
            files={refFiles}
            previews={refPreviews}
            onFiles={(picked) => setRefFiles((prev) => [...prev, ...picked])}
            pickerRef={refPickerRef}
          />
          <div className="mt-4 flex flex-wrap justify-center gap-2.5">
            {refPreviews.slice(0, 4).map((src, i) => (
              <div key={i} className="h-[106px] w-20 overflow-hidden rounded-lg border border-gold/40 shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element -- blob: object URL */}
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
            {refFiles.length > 4 && (
              <div className="flex h-[106px] w-20 items-center justify-center rounded-lg border border-gold/40 bg-white/5 text-[11px] font-semibold text-white/60">
                +{refFiles.length - 4}
              </div>
            )}
            <button
              type="button"
              onClick={() => refPickerRef.current?.click()}
              className="flex h-[106px] w-20 items-center justify-center rounded-lg border border-dashed border-white/10 text-xl text-white/30 transition-colors hover:border-gold hover:text-gold"
            >
              +
            </button>
          </div>
          <p className="mb-2 mt-3 text-[9px] tracking-wide text-white/30">
            {refFiles.length} of 5 minimum uploaded
          </p>
          <NextButton onClick={next} />
        </OnboardingSplit>
      )}

      {step === 5 && (
        <OnboardingSplit
          overlay="linear-gradient(135deg,rgba(10,10,11,0.5),rgba(10,10,11,0.8))"
          vis={
            <>
              <AbstractBackground variant="s5" />
              {refPreviews.length > 0 && (
                <div className="absolute bottom-12 left-12 z-[2] text-white">
                  <div className="mb-3 text-[9px] uppercase tracking-[3px] text-white/40">
                    Your Uploaded References
                  </div>
                  <div className="flex gap-3">
                    {refPreviews.slice(0, 3).map((src, i) => (
                      <RefThumb key={i} src={src} label={["On-model", "Flat lay", "Product"][i]} highlight={i === 0} />
                    ))}
                  </div>
                </div>
              )}
            </>
          }
        >
          <StepIndicator total={7} current={5} />
          <h1 className="mb-3 font-serif text-4xl font-light leading-[1.2] tracking-tight text-[#f8f8f2]">
            How should your
            <br />
            images <em className="text-gold not-italic">look</em>?
          </h1>
          <p className="mb-8 text-[13px] leading-relaxed text-white/50">
            Pick defaults — you can always change these per generation.
          </p>
          <div className="mb-5 text-left">
            <div className="mb-2.5 text-[9px] font-semibold uppercase tracking-[2px] text-white/35">
              Background
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {BACKGROUNDS.map((b) => (
                <RadioCard
                  key={b.value}
                  selected={background === b.value}
                  onSelect={() => setBackground(b.value)}
                  title={b.title}
                  align="center"
                />
              ))}
            </div>
          </div>
          <div className="mb-2 text-left">
            <div className="mb-2.5 text-[9px] font-semibold uppercase tracking-[2px] text-white/35">
              Image type
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {IMAGE_TYPES.map((t) => (
                <RadioCard
                  key={t.value}
                  selected={imageType === t.value}
                  onSelect={() => setImageType(t.value)}
                  title={t.title}
                  description={t.desc}
                  align="center"
                />
              ))}
            </div>
          </div>
          <NextButton onClick={next} />
        </OnboardingSplit>
      )}

      {step === 6 && (
        <div className="relative flex min-h-screen w-full items-center justify-center">
          <div className="pointer-events-none fixed inset-0 z-0 opacity-30">
            <AbstractBackground variant="s7" />
          </div>
          <div className="relative z-[2] max-w-[560px] px-10 text-center">
            <StepIndicator total={7} current={6} center />
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-dim shadow-[0_16px_48px_rgba(201,169,110,0.25)]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0a0a0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="mb-3 font-serif text-[40px] font-light text-[#f8f8f2]">
              You&apos;re ready to <em className="text-gold not-italic">create</em>
            </h1>
            <p className="mx-auto mb-9 max-w-md text-[13px] leading-relaxed text-white/50">
              <span className="font-semibold text-gold">{brandName || "your brand"}</span> is
              set up. AI is learning your style
              <br />
              in the background — you&apos;ll be notified when training is
              complete.
            </p>
            <div className="mb-9 flex justify-center gap-8 text-[10px] uppercase tracking-wide text-white/45">
              <div className="flex items-center gap-1.5 text-white/60">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l1.5-5h15L21 9" />
                  <path d="M3 9c0 1.5 1.2 3 3 3s3-1.5 3-3" />
                  <path d="M9 9c0 1.5 1.2 3 3 3s3-1.5 3-3" />
                  <path d="M15 9c0 1.5 1.2 3 3 3s3-1.5 3-3" />
                  <rect x="3" y="12" width="18" height="9" />
                </svg>
                {brandName || "Urban Thread"}
              </div>
              <Stat value={String(refFiles.length)} label="References" />
              <Stat value="5" label="Categories" />
              <Stat value="500" label="Images/mo" />
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => router.push("/generate")}
                className="inline-flex items-center gap-2 rounded-md bg-gold px-9 py-4 text-xs font-bold uppercase tracking-wide text-[#0a0a0b] transition-all hover:-translate-y-0.5 hover:bg-gold-h hover:shadow-[0_8px_32px_rgba(201,169,110,0.3)]"
              >
                ✨ Generate first image
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="inline-flex items-center gap-2 rounded-md border border-white/15 px-9 py-4 text-xs font-bold uppercase tracking-wide text-white/60 transition-all hover:border-white/30 hover:text-white"
              >
                Dashboard →
              </button>
            </div>
          </div>
        </div>
      )}
    </OnboardingShell>
  );
}

function RefThumb({ src, label, highlight }: { src: string; label: string; highlight?: boolean }) {
  return (
    <div className="text-center">
      <div
        className={`mb-1.5 h-[106px] w-20 overflow-hidden rounded-md border ${
          highlight ? "border-gold/40" : "border-white/10"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- may be a blob: object URL for a real upload */}
        <img src={src} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="text-[8px] uppercase tracking-wide text-white/40">{label}</div>
    </div>
  );
}

function VisStat({ n, l }: { n: string; l: string }) {
  return (
    <div className="text-left">
      <div className="font-serif text-[36px] font-extralight tracking-[-1px] text-gold">{n}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-[1.5px] text-white/50">{l}</div>
    </div>
  );
}

function NextButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-7 inline-flex items-center gap-2 rounded-md bg-gold px-12 py-4 text-xs font-bold uppercase tracking-wide text-[#0a0a0b] transition-all hover:-translate-y-0.5 hover:bg-gold-h hover:shadow-[0_8px_32px_rgba(201,169,110,0.3)]"
    >
      Continue
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M5 12h14m-6-6 6 6-6 6" />
      </svg>
    </button>
  );
}

/**
 * Real file picker + real drag-and-drop, styled like the prototype's static
 * dropzone. Nothing is uploaded anywhere — files stay client-side and are
 * only used to render genuine thumbnails via blob: object URLs (see
 * useObjectUrls), replacing the hardcoded stock photos the prototype shipped
 * with. Cancelling the OS picker or dropping a non-image is a no-op.
 */
function FileDropZone({
  label,
  sub,
  small,
  multiple,
  files,
  previews,
  onFiles,
  pickerRef,
}: {
  label: string;
  sub: string;
  small?: boolean;
  multiple?: boolean;
  files: File[];
  previews: string[];
  onFiles: (files: File[]) => void;
  pickerRef?: React.RefObject<HTMLInputElement | null>;
}) {
  const localRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);

  function assignRef(el: HTMLInputElement | null) {
    localRef.current = el;
    if (pickerRef) pickerRef.current = el;
  }

  function commitFiles(list: FileList | null) {
    if (!list || list.length === 0) return; // cancelled — do nothing
    const picked = Array.from(list).filter((f) => f.type.startsWith("image/"));
    if (picked.length === 0) return; // non-image drop/pick — no-op
    onFiles(picked);
  }

  const hasFiles = files.length > 0;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => localRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          localRef.current?.click();
        }
      }}
      onDragOver={(e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
        commitFiles(e.dataTransfer.files);
      }}
      className={`cursor-pointer rounded-xl border border-dashed text-center transition-colors ${
        dragActive ? "border-gold bg-gold-sub/40" : "border-white/15 hover:border-gold hover:bg-gold-sub/40"
      } ${small ? "mt-3 p-6" : "p-10"}`}
    >
      <input
        ref={assignRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          commitFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {hasFiles && small ? (
        <div className="mx-auto mb-2 h-14 w-14 overflow-hidden rounded-lg border border-gold/40 bg-white/5">
          {/* eslint-disable-next-line @next/next/no-img-element -- blob: object URL */}
          <img src={previews[0]} alt="" className="h-full w-full object-contain" />
        </div>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-2 text-white/40">
          <path d="M12 16V4m0 0L7 9m5-5 5 5" />
          <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
        </svg>
      )}
      <div className="text-[13px] text-white/70">
        {hasFiles
          ? small
            ? files[0].name
            : `${files.length} image${files.length === 1 ? "" : "s"} selected — click or drop to add more`
          : label}
      </div>
      <div className="mt-1 text-[10.5px] text-white/35">{sub}</div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="mb-1 font-serif text-[28px] font-extralight tracking-[-1px] text-gold">{value}</div>
      <div>{label}</div>
    </div>
  );
}

function RoleIcon({ value }: { value: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 2,
  };
  switch (value) {
    case "photographer":
      return (
        <svg {...common}>
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      );
    case "founder":
      return (
        <svg {...common}>
          <path d="M3 9l1.5-5h15L21 9" />
          <path d="M3 9c0 1.5 1.2 3 3 3s3-1.5 3-3" />
          <path d="M9 9c0 1.5 1.2 3 3 3s3-1.5 3-3" />
          <path d="M15 9c0 1.5 1.2 3 3 3s3-1.5 3-3" />
          <rect x="3" y="12" width="18" height="9" />
        </svg>
      );
    case "designer":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="8" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="8" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="16" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "manager":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
  }
}
