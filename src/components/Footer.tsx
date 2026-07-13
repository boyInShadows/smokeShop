import { FOOTER_LINKS, NICOTINE_WARNING } from "@/lib/data";
import { toFaDigits } from "@/lib/format";
import { InstagramIcon, TelegramIcon } from "./icons";
import NewsletterForm from "./NewsletterForm";
import Reveal from "./motion/Reveal";

export default function Footer() {
  return (
    <footer className="mt-auto overflow-x-clip border-t border-border bg-surface/40">
      {/* Newsletter */}
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-10 sm:px-6 lg:flex-row lg:justify-between">
          <Reveal dir="right" className="text-center lg:text-start">
            <h3 className="text-lg font-black">از تخفیف‌ها باخبر شوید</h3>
            <p className="mt-1 text-sm text-muted">
              ایمیل خود را وارد کنید تا جدیدترین محصولات و پیشنهادها را دریافت
              کنید.
            </p>
          </Reveal>
          <Reveal dir="left" delay={0.1}>
            <NewsletterForm />
          </Reveal>
        </div>
      </div>

      {/* Link columns */}
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-5">
        <div className="col-span-2">
          <div className="flex items-center gap-2 font-extrabold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-bg">
              <bdi className="text-lg font-black">W</bdi>
            </span>
            <span className="text-lg">
              ویپ<span className="text-primary">اسموک</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            فروشگاه تخصصی ویپ، پاد و سیگار الکترونیک با ضمانت اصالت کالا و ارسال سریع
            به سراسر ایران.
          </p>
          <div className="mt-5 flex gap-2">
            <a
              href="#"
              aria-label="اینستاگرام"
              className="grid h-10 w-10 place-items-center rounded-xl border border-border text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary active:scale-90"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href="#"
              aria-label="تلگرام"
              className="grid h-10 w-10 place-items-center rounded-xl border border-border text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-secondary hover:text-secondary active:scale-90"
            >
              <TelegramIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        {FOOTER_LINKS.map((col, i) => (
          <Reveal key={col.title} dir="up" delay={0.08 * i}>
            <h4 className="text-sm font-bold">{col.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    // The nudge is toward the inline-start (leftward in RTL).
                    className="inline-block text-sm text-muted transition-all duration-200 hover:text-text rtl:hover:-translate-x-1"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      {/* Nicotine warning — contained, not screaming */}
      <div className="border-t border-border bg-bg/60">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <p className="rounded-xl border border-border bg-surface/60 px-4 py-3 text-center text-xs leading-relaxed text-muted">
            {NICOTINE_WARNING}
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:px-6">
          <p>
            © {toFaDigits(1403)} ویپ اسموک · تمامی حقوق محفوظ است.
          </p>
          <p>مخصوص افراد بالای {toFaDigits(18)} سال</p>
        </div>
      </div>
    </footer>
  );
}
