import Reveal from "./motion/Reveal";
import SplitText from "./motion/SplitText";

type Props = {
  eyebrow: string;
  title: string;
  desc?: string;
};

/**
 * The one heading pattern. Every section uses it, so the entrance choreography
 * lives here once — eyebrow sweeps in, the title assembles word by word, the
 * description follows. Sections that use this get their motion for free.
 */
export default function SectionHeading({ eyebrow, title, desc }: Props) {
  return (
    <div className="mb-8 max-w-2xl sm:mb-10">
      <Reveal dir="right">
        <span className="text-sm font-bold text-secondary">{eyebrow}</span>
      </Reveal>

      <SplitText
        as="h2"
        text={title}
        className="mt-2 text-2xl font-black sm:text-3xl lg:text-4xl"
      />

      {desc && (
        <Reveal dir="up" delay={0.15}>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            {desc}
          </p>
        </Reveal>
      )}
    </div>
  );
}
