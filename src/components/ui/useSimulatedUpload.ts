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
  /**
   * Identifies which "thing" (e.g. a specific SKU/shade) the current upload
   * belongs to. When this changes, the in-progress upload is swapped out
   * rather than left showing under the new identity — a photo uploaded for
   * Shade 05 must not still appear once the caller switches to Shade 07.
   * Whatever was uploaded under the outgoing key is cached (not discarded),
   * so switching back to a key visited earlier in this session restores it
   * instead of forcing a re-upload. Omit if the caller only ever handles one
   * upload at a time (e.g. Category Training's single bulk dropzone).
   */
  cacheKey?: string;
}

/**
 * Drives a realistic upload → training simulation off a genuine OS file
 * picker. Nothing is ever sent to a server (this is a static demo with
 * preloaded results) — but the *input* half is real: a real
 * <input type="file"> opens, non-image picks are ignored, cancelling the
 * dialog does nothing, and the selected files are kept around (see `files`)
 * so callers can render real thumbnails via useObjectUrls instead of a
 * canned preview.
 *
 * Reused wherever the app presents an upload/training moment (Generate's
 * Upload step, Category Training's bulk-upload zone) so the illusion is
 * consistent rather than a one-off screen.
 */
export function useSimulatedUpload({ uploadMs = 900, trainingMs = 1600, onComplete, cacheKey }: SimulatedUploadOptions = {}) {
  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [fileNames, setFileNames] = useState<string[]>([]);
  // The actual selected files (image-only) — kept around so the panel can
  // render real thumbnails via useObjectUrls instead of just a name list.
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  // Per-cacheKey snapshots of what's been uploaded so far this session —
  // File objects only (cheap to hold, nothing to revoke). The actual blob:
  // object URLs live downstream in the caller's useObjectUrls(files), which
  // already revokes its old URLs whenever the `files` array we hand it
  // changes identity — swapping `files` here is what drives that cleanup.
  const cache = useRef<Map<string, { files: File[]; fileNames: string[] }>>(new Map());
  const prevKeyRef = useRef(cacheKey);

  useEffect(() => {
    return () => timeouts.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (cacheKey === undefined || cacheKey === prevKeyRef.current) return;
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    if (prevKeyRef.current !== undefined) {
      cache.current.set(prevKeyRef.current, { files, fileNames });
    }
    const restored = cache.current.get(cacheKey);
    setFiles(restored?.files ?? []);
    setFileNames(restored?.fileNames ?? []);
    setPhase(restored && restored.files.length > 0 ? "done" : "idle");
    setProgress(0);
    prevKeyRef.current = cacheKey;
    // Only cacheKey should retrigger this swap — files/fileNames are read
    // for their current (pre-swap) values, not watched.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey]);

  function openPicker() {
    inputRef.current?.click();
  }

  /** Shared by both the file picker and drag-and-drop — filters to images
   * and kicks off the upload→training sequence. No-op on an empty or
   * all-non-image selection so a cancelled picker or a bad drop stays idle. */
  function commitFiles(all: File[]) {
    if (all.length === 0) return;
    const picked = all.filter((f) => f.type.startsWith("image/"));
    if (picked.length === 0) return;
    setFiles((prev) => [...prev, ...picked]);
    setFileNames((prev) => [...prev, ...picked.map((f) => f.name)]);
    runSequence();
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    // Snapshot into a plain array before touching e.target.value — resetting
    // value clears the *same* live FileList object e.target.files returned,
    // so reading .length after that point (even via an earlier-saved
    // reference) sees 0 and silently drops every real selection.
    const all = e.target.files ? Array.from(e.target.files) : [];
    e.target.value = ""; // allow re-selecting the same file later
    commitFiles(all);
  }

  /** Drop handler for a drag-and-drop zone — pass `e.dataTransfer.files`. */
  function handleDrop(fileList: FileList | null) {
    commitFiles(fileList ? Array.from(fileList) : []);
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
    setFiles([]);
  }

  return {
    phase,
    progress,
    fileNames,
    files,
    openPicker,
    reset,
    inputRef,
    handleFileChange,
    handleDrop,
    /** Feeds File objects (e.g. fetched from a same-origin demo asset)
     * through the exact same upload→training sequence as a real file pick
     * or desktop drag-and-drop — see commitFiles. */
    addFiles: commitFiles,
  };
}
