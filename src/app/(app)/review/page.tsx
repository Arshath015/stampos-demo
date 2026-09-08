import { ReviewClient } from "@/components/review/ReviewClient";
import { getResultImages } from "@/lib/results";

// Re-scan public/images/results/** on every request (not just at build time)
// so dropping in new AI output files works in production without a rebuild.
export const dynamic = "force-dynamic";

export default function ReviewPage() {
  return (
    <ReviewClient
      resultsFoundation={getResultImages("foundation")}
      resultsLipstick={getResultImages("lipstick")}
    />
  );
}
