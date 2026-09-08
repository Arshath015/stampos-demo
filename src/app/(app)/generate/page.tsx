import { GenerateClient } from "@/components/generate/GenerateClient";
import { getResultImages } from "@/lib/results";

// Re-scan public/images/results/** on every request (not just at build time)
// so dropping in new AI output files works in production without a rebuild.
export const dynamic = "force-dynamic";

export default function GeneratePage() {
  return (
    <GenerateClient
      resultsFoundation={getResultImages("foundation")}
      resultsLipstick={getResultImages("lipstick")}
    />
  );
}
