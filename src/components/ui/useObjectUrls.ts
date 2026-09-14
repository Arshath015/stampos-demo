"use client";

import { useEffect, useMemo } from "react";

/**
 * Turns local File objects into blob: object URLs for client-only previews
 * (no upload to any server). Re-created whenever the files array changes and
 * revoked on cleanup so selecting new files never leaks the old URLs.
 */
export function useObjectUrls(files: File[]): string[] {
  const urls = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => {
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [urls]);
  return urls;
}
