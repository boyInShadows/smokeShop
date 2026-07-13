/**
 * The four site palettes.
 *
 * The colours themselves live in `globals.css` as `:root[data-theme=…]` blocks —
 * that is what actually re-themes the site, because Tailwind v4 compiles every
 * `bg-primary` / `text-muted` utility down to `var(--color-…)`. What lives HERE is
 * only the metadata the switcher UI needs: the label, and the three hexes it paints
 * its little preview dots with.
 *
 * ⚠️ The swatch hexes are duplicated from globals.css on purpose — a CSS custom
 * property cannot be read at build time, and the dropdown has to show all four
 * palettes at once, including the three that are NOT currently applied (so it
 * cannot use the live `var(--color-primary)`, which only ever holds the active
 * one). If you change a palette, change it in both places.
 *
 * All four are dark. See the note in globals.css: the hero's smoke plate relies on
 * `mix-blend-screen`, under which black is transparent — a light palette erases it.
 */
export const THEME_IDS = ["dusk", "ember", "toxic", "indigo"] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export const DEFAULT_THEME: ThemeId = "dusk";

/** localStorage key. Also hard-coded in the pre-paint script in layout.tsx. */
export const THEME_KEY = "wape_theme";

export type Theme = {
  id: ThemeId;
  /** Persian name shown in the dropdown. */
  label: string;
  /** One-line flavour text, so the palettes read as choices and not as hex codes. */
  note: string;
  /** [background, primary, secondary] — preview dots only. */
  swatch: [string, string, string];
};

export const THEMES: Theme[] = [
  {
    id: "dusk",
    label: "غروب بخار",
    note: "مگنتا و فیروزه‌ای",
    swatch: ["#12101a", "#ff3d9a", "#22d3ee"],
  },
  {
    id: "ember",
    label: "زغال گداخته",
    note: "نارنجی و کهربایی",
    swatch: ["#14100c", "#ff7a3d", "#ffc861"],
  },
  {
    id: "toxic",
    label: "نعناع اسیدی",
    note: "سبز نئون و لیمویی",
    swatch: ["#08130f", "#2bf59a", "#b6e84b"],
  },
  {
    id: "indigo",
    label: "نیلی نیمه‌شب",
    note: "بنفش و آبی آسمانی",
    swatch: ["#0a0e27", "#8b5cf6", "#38bdf8"],
  },
];

export function isThemeId(v: unknown): v is ThemeId {
  return typeof v === "string" && (THEME_IDS as readonly string[]).includes(v);
}
