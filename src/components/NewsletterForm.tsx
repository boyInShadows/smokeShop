"use client";

export default function NewsletterForm() {
  return (
    <form
      className="flex w-full max-w-md gap-2"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        dir="ltr"
        required
        placeholder="you@example.com"
        className="min-w-0 flex-1 rounded-xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
      />
      <button
        type="submit"
        className="glow-primary shrink-0 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-bg transition hover:bg-primary-strong"
      >
        عضویت
      </button>
    </form>
  );
}
