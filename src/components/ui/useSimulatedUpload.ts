"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";

export type UploadPhase = "idle" | "uploading" | "training" | "done";

export interface SimulatedUploadOptions {
  /** How long the "Uploading..." phase runs, in ms. */
  uploadMs?: number;
  /** How long the "Image model is training..." phase runs, in ms. */
  trainingMs?: number;
  /** Called once the whole sequence settles into "done". */
  onComplete?: () => void;
}

/**
 * Drives a realistic upload → training simulation off a genuine OS file
 * picker. No file content is read or sent anywhere (this is a static demo
 * with preloaded results) — the point is that the *interaction* is real:
 * a real <input type="file"> opens, and the sequence only starts if the
 * user actually picks something (cancelling the dialog does nothing, same
 * as it would against a real upload).
 *
 * Reused wherever the app presents an upload/training moment (Generate's
 * Upload step, Category Training's bulk-upload zone) so the illusion is
 * consistent rather than a one-off screen.
 */
export function useSimulatedUpload({ uploadMs = 900, trainingMs = 1600, onComplete }: SimulatedUploadOptions = {}) {
  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => timeouts.current.forEach(clearTimeout);
  }, []);

  function openPicker() {
    inputRef.current?.click();
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return; // user cancelled — do nothing
    setFileNames(Array.from(files).map((f) => f.name));
    runSequence();
    e.target.value = ""; // allow re-selecting the same file later
  }

  function runSequence() {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setProgress(0);
    setPhase("uploading");

    const uploadStart = Date.now();
    const uploadTick = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - uploadStart) / uploadMs) * 100);
      setProgress(pct);
      if (pct >= 100) clearInterval(uploadTick);
    }, 60);
    timeouts.current.push(uploadTick as unknown as ReturnType<typeof setTimeout>);

    const t1 = setTimeout(() => {
      clearInterval(uploadTick);
      setProgress(0);
      setPhase("training");
      const trainStart = Date.now();
      const trainTick = setInterval(() => {
        const pct = Math.min(100, ((Date.now() - trainStart) / trainingMs) * 100);
        setProgress(pct);
        if (pct >= 100) clearInterval(trainTick);
      }, 60);
      timeouts.current.push(trainTick as unknown as ReturnType<typeof setTimeout>);

      const t2 = setTimeout(() => {
        clearInterval(trainTick);
        setPhase("done");
        onComplete?.();
      }, trainingMs);
      timeouts.current.push(t2);
    }, uploadMs);
    timeouts.current.push(t1);
  }

  function reset() {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setPhase("idle");
    setProgress(0);
    setFileNames([]);
  }

  return {
    phase,
    progress,
    fileNames,
    openPicker,
    reset,
    inputRef,
    handleFileChange,
  };
}
