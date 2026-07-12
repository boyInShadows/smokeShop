/**
 * Film grain. The single highest return-on-effort item in the whole design:
 * it kills the gradient banding that near-black neon UIs always show on cheap
 * panels, and it makes the colour grade read as *film* rather than *filter*.
 *
 * Sits above everything, including the product — grain is a property of the
 * photograph, not of one layer. Static: an animated grain would be a per-frame
 * repaint of the whole viewport for no gain.
 */
export default function Grain() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 z-30 h-full w-full opacity-[0.07] mix-blend-overlay"
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
