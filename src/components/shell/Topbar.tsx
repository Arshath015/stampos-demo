"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { pageTitles } from "@/lib/nav";

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem("stampos-theme");
    if (stored === "light" || stored === "dark") {
      // Deliberately synced post-mount: localStorage isn't available during
      // SSR, and reading it during the initial render would cause a
      // server/client hydration mismatch on the theme icon.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    }
  }, []);

  // "g then a letter" go-to shortcuts, implemented as real component state
  // instead of the prototype's leaked module-level `goPrefix` variable.
  useEffect(() => {
    let awaitingPrefix = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    const goMap: Record<string, string> = {
      d: "/dashboard",
      g: "/generate",
      r: "/review",
      b: "/brand",
      a: "/analytics",
    };
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (awaitingPrefix) {
        awaitingPrefix = false;
        clearTimeout(timeoutId);
        const dest = goMap[e.key];
        if (dest) {
          e.preventDefault();
          router.push(dest);
        }
        return;
      }
      if (e.key === "g") {
        awaitingPrefix = true;
        timeoutId = setTimeout(() => (awaitingPrefix = false), 800);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      clearTimeout(timeoutId);
    };
  }, [router]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    window.localStorage.setItem("stampos-theme", next);
  }

  const title = pageTitles[pathname ?? ""] ?? "STAMP OS";

  return (
    <header className="flex items-center gap-3 border-b border-border bg-s0/60 px-6 py-2.5 backdrop-blur-xl">
      <div className="text-[15px] font-extrabold text-t1">{title}</div>
      <div className="flex-1" />
      <button
        type="button"
        className="flex min-w-[200px] cursor-pointer items-center gap-2 rounded-md border border-border bg-glass px-3 py-1.5 text-[11.5px] text-t4 transition-colors hover:border-border-h hover:bg-glass-hover"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        Search anything...
        <kbd className="ml-auto rounded border border-border bg-s2 px-1 font-mono text-[9.5px] text-t4">
          ⌘K
        </kbd>
      </button>
      <button
        type="button"
        onClick={toggleTheme}
        title="Toggle light/dark"
        className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-glass text-t3 transition-colors hover:border-border-h hover:text-t1"
      >
        {theme === "dark" ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
          </svg>
        )}
      </button>
      <button
        type="button"
        className="relative flex h-8 w-8 items-center justify-center rounded-md border border-border bg-glass text-t3 transition-colors hover:border-border-h hover:text-t1"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full border border-s0 bg-danger" />
      </button>
      <Link
        href="/generate"
        className="flex items-center gap-1.5 rounded-md bg-gradient-to-br from-accent to-accent-h px-4 py-1.5 text-xs font-semibold text-white shadow-[0_2px_8px_rgba(59,130,246,0.3)] transition-all hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(59,130,246,0.4)]"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        Generate
      </Link>
    </header>
  );
}
