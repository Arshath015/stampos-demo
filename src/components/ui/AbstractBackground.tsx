/**
 * Exact port of the prototype's `.onb-abstract-bg` treatment: a layered
 * radial-gradient wash (gold + purple glows over a near-black base),
 * a subtle dot-grid texture, and 1-2 faint circular ring outlines.
 * Used on the auth screen and every split-layout onboarding step that had
 * it in the source — never a product photo.
 *
 * Ring configs are ported verbatim from the prototype's inline styles per
 * screen (see STAMP_OS_Prototype_SugarCosmetics_v7.html lines 1171, 1291,
 * 1321, 1502, 1580) rather than invented — hence named variants instead of
 * a generic 1/2/3 enum.
 */

interface Ring {
  width: number;
  height: number;
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  center?: boolean;
  borderColor?: string;
}

const RING_SETS: Record<string, Ring[]> = {
  // auth screen + onboarding S1 (identical in the prototype)
  auth: [
    { width: 520, height: 520, top: -120, right: -140 },
    { width: 320, height: 320, bottom: -80, left: -60, borderColor: "rgba(167,139,250,0.14)" },
  ],
  s1: [
    { width: 520, height: 520, top: -120, right: -140 },
    { width: 320, height: 320, bottom: -80, left: -60, borderColor: "rgba(167,139,250,0.14)" },
  ],
  s2: [
    { width: 420, height: 420, bottom: -140, right: -100 },
    { width: 260, height: 260, top: -60, left: -60, borderColor: "rgba(167,139,250,0.14)" },
  ],
  s4: [{ width: 600, height: 600, center: true }],
  s5: [
    { width: 380, height: 380, top: -90, left: -90 },
    { width: 480, height: 480, bottom: -160, right: -120, borderColor: "rgba(167,139,250,0.12)" },
  ],
  // onboarding confirmation screen — gradient wash + dot grid only, no rings
  // (full-bleed centered layout, not a split panel like the others)
  s7: [],
};

export type AbstractBackgroundVariant = keyof typeof RING_SETS;

export function AbstractBackground({ variant }: { variant: AbstractBackgroundVariant }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 22% 25%, rgba(201,169,110,0.32), transparent 46%)," +
            "radial-gradient(circle at 78% 20%, rgba(167,139,250,0.16), transparent 50%)," +
            "radial-gradient(circle at 50% 88%, rgba(201,169,110,0.14), transparent 55%)," +
            "linear-gradient(160deg,#0d0d0e,#181510 55%,#0d0d0e)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {RING_SETS[variant].map((ring, i) => (
        <div
          key={i}
          className="absolute rounded-full border"
          style={{
            width: ring.width,
            height: ring.height,
            top: ring.center ? "50%" : ring.top,
            left: ring.center ? "50%" : ring.left,
            right: ring.right,
            bottom: ring.bottom,
            transform: ring.center ? "translate(-50%, -50%)" : undefined,
            borderColor: ring.borderColor ?? "rgba(201,169,110,0.18)",
          }}
        />
      ))}
    </div>
  );
}
