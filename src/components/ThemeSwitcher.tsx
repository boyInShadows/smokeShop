"use client";

import { useEffect, useRef, useState } from "react";
import { THEMES } from "@/lib/themes";
import { useTheme } from "@/lib/useTheme";
import { CheckIcon, PaletteIcon } from "./icons";

/**
 * Palette picker — a dropdown of the four site palettes, sitting beside the logo.
 *
 * Clicking one flips `data-theme` on <html> and every colour on the page follows,
 * because Tailwind v4 resolves each colour utility to a CSS custom property. There
 * is no re-render and no theme prop threaded through the tree.
 *
 * The trigger's own dots use `bg-primary` / `bg-secondary` — i.e. the LIVE tokens —
 * so the closed button always shows the active palette without React knowing
 * anything. The dropdown's dots use static hexes from `themes.ts`, because it has to
 * show all four palettes at once, including the three that are not applied.
 */
export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  // Close on outside click and on Escape — a dropdown that can only be dismissed by
  // picking something is a trap, especially for keyboard users.
  useEffect(() => {
    if (!open) return;

    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="تغییر پوستهٔ رنگی"
        className="flex h-9 items-center gap-1.5 rounded-xl border border-border bg-surface/60 px-2.5 text-muted transition-colors duration-200 hover:border-primary/60 hover:text-text"
      >
        <PaletteIcon className="h-4 w-4" />
        {/* Live tokens: these two dots re-colour themselves with the theme. */}
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
          <span className="h-2.5 w-2.5 rounded-full bg-secondary" />
        </span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="پوسته‌های رنگی"
          // `start-0` not `left-0`: logical, so it flips with the RTL document.
          className="absolute start-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-surface/95 p-1.5 shadow-2xl backdrop-blur-lg"
        >
          {THEMES.map((t) => {
            const active = t.id === theme;
            return (
              <button
                key={t.id}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setTheme(t.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-start transition-colors duration-150 ${
                  active ? "bg-surface-2" : "hover:bg-surface-2/60"
                }`}
              >
                {/* Static hexes — the dropdown must preview palettes that are NOT
                    the live one, so it cannot use var(--color-primary). */}
                <span
                  aria-hidden
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border"
                  style={{ backgroundColor: t.swatch[0] }}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: t.swatch[1] }}
                  />
                  <span
                    className="-ms-1 h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: t.swatch[2] }}
                  />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-text">
                    {t.label}
                  </span>
                  <span className="block text-xs text-muted">{t.note}</span>
                </span>

                {active && (
                  <CheckIcon className="h-4 w-4 shrink-0 text-primary" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
