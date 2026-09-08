"use client";

import { Card } from "@/components/ui/Card";
import { useSimulatedUpload } from "@/components/ui/useSimulatedUpload";
import { UploadTrainingPanel } from "@/components/ui/UploadTrainingPanel";

/**
 * Same dropzone this page always had, now wired to the shared upload/training
 * simulation (real file picker → uploading → "Image model is training") so
 * the illusion is consistent with Generate's Upload step rather than a
 * one-off static card. On completion it simply reverts to the idle dropzone
 * — the "Auto-classification complete" card below it already tells the rest
 * of this screen's story and is left untouched.
 */
export function TrainingUploadCard() {
  const {
    phase,
    progress,
    fileNames,
    openPicker,
    inputRef,
    handleFileChange,
  } = useSimulatedUpload();

  return (
    <Card className="mb-4 border-2 border-dashed border-accent bg-accent-sub py-7 text-center">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
      {phase === "idle" || phase === "done" ? (
        <button type="button" onClick={openPicker} className="w-full cursor-pointer">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 text-accent-h">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <div className="text-sm font-bold text-accent-h">Drop all reference images here</div>
          <div className="mt-1 text-[11px] text-t3">AI will auto-classify each image into the correct sub-category</div>
        </button>
      ) : (
        <UploadTrainingPanel phase={phase} progress={progress} fileNames={fileNames} />
      )}
    </Card>
  );
}
