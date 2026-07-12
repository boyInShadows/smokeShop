import { TRUST_ITEMS } from "@/lib/data";
import { TRUST_ICONS } from "./icons";

// Trust-promise row placed right after the hero (conversion best-practice for
// regulated products).
export default function TrustRow() {
  return (
    <section className="border-y border-border bg-surface/30">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden px-4 py-6 sm:px-6 lg:grid-cols-4">
        {TRUST_ITEMS.map((item) => {
          const Icon = TRUST_ICONS[item.icon];
          return (
            <div
              key={item.title}
              className="flex items-center gap-3 px-2 py-3 sm:px-4"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary/10 text-secondary">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-bold">{item.title}</h3>
                <p className="truncate text-xs text-muted">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
