import { TRUST_ITEMS } from "@/lib/data";
import { TRUST_ICONS } from "./icons";
import Reveal from "./motion/Reveal";

// Trust-promise row placed right after the hero (conversion best-practice for
// regulated products). Items sweep in one after another so the row reads as a
// sequence of promises rather than a static strip.
export default function TrustRow() {
  return (
    <section className="border-y border-border bg-surface/30">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden px-4 py-6 sm:px-6 lg:grid-cols-4">
        {TRUST_ITEMS.map((item, i) => {
          const Icon = TRUST_ICONS[item.icon];
          return (
            <Reveal key={item.title} dir="up" delay={i * 0.08}>
              <div className="group flex items-center gap-3 px-2 py-3 sm:px-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary/10 text-secondary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold">{item.title}</h3>
                  <p className="truncate text-xs text-muted">{item.desc}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
