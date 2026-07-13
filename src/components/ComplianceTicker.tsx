import { TICKER_ITEMS } from "@/lib/data";

// Seamless scrolling ticker of compliance/benefit lines. Duplicated once so the
// -50% marquee loops without a gap. Pauses under prefers-reduced-motion (CSS).
export default function ComplianceTicker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="border-b border-border bg-surface/60 text-xs text-muted">
      {/* Full-bleed, not `max-w-7xl`: the marquee is clipped by this box, so
          constraining it to the content column made the text stop dead 80px short
          of the screen edge on a wide display, leaving an empty strip of bar. A
          marquee should run off the edge of the viewport. */}
      <div className="overflow-hidden px-4">
        <div className="animate-ticker flex w-max gap-8 py-2">
          {items.map((item, i) => (
            <span key={i} className="flex shrink-0 items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-secondary" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
