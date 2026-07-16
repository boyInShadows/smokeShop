/**
 * Film grain. The single highest return-on-effort item in the whole design:
 * it kills the gradient banding that near-black neon UIs always show on cheap
 * panels, and it makes the colour grade read as *film* rather than *filter*.
 *
 * Sits above everything, including the product — grain is a property of the
 * photograph, not of one layer. Static: an animated grain would be a per-frame
 * repaint of the whole viewport for no gain.
 *
 * ── Desktop only (`hidden lg:block`) ─────────────────────────────────────────
 * `feTurbulence` with 3 octaves over a full viewport is the single most expensive
 * paint in the hero. On desktop it rasterizes once and the GPU carries it; on a
 * phone that one rasterization stalls the first frames, and under a static mobile
 * hero the banding it hides is barely visible on a small, dense panel anyway. Pure
 * CSS gate (not a JS branch), so `display:none` keeps the browser from ever
 * rasterizing the filter below 1024px — and no hydration mismatch to worry about.
 */
export default function Grain() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 z-30 hidden h-full w-full opacity-[0.07] mix-blend-overlay lg:block"
    >
      <filter id="hero-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.8"
          numOctaves="3"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#hero-grain)" />
    </svg>
  );
}
