type Props = {
  eyebrow: string;
  title: string;
  desc?: string;
};

export default function SectionHeading({ eyebrow, title, desc }: Props) {
  return (
    <div className="mb-8 max-w-2xl sm:mb-10">
      <span className="text-sm font-bold text-secondary">{eyebrow}</span>
      <h2 className="mt-2 text-2xl font-black sm:text-3xl lg:text-4xl">{title}</h2>
      {desc && <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{desc}</p>}
    </div>
  );
}
