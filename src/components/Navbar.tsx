"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/data";
import { CartIcon, MenuIcon, CloseIcon } from "./icons";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-border bg-bg/85 backdrop-blur-lg"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6"
        aria-label="ناوبری اصلی"
      >
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 font-extrabold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-bg">
            <bdi className="text-lg font-black">W</bdi>
          </span>
          <span className="text-lg tracking-tight">
            ویپ<span className="text-primary">اسموک</span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 text-sm text-muted lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                // `py-1` is not decorative: a bare text link is only ~22px tall,
                // under the 24px minimum target size (WCAG 2.2 SC 2.5.8). The
                // padding grows the hit area without moving the text.
                className="inline-block py-1 transition-colors hover:text-text"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            className="relative grid h-10 w-10 place-items-center rounded-xl text-text transition hover:bg-surface"
            aria-label="سبد خرید"
          >
            <CartIcon className="h-5 w-5" />
            <span className="absolute -top-0.5 -end-0.5 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-bg">
              ۲
            </span>
          </button>
          <button
            className="grid h-10 w-10 place-items-center rounded-xl text-text transition hover:bg-surface lg:hidden"
            aria-label="منو"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-bg/95 backdrop-blur-lg lg:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-border/60 py-3 text-sm text-muted transition hover:text-text"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
