"use client";

import { useEffect, useState } from "react";
import { toFaDigits } from "@/lib/format";
import { BoltIcon } from "./icons";

const STORAGE_KEY = "wape_age_ok";
const MIN_AGE = 18;
const CURRENT_YEAR = 1403; // Jamali (Persian) current year — placeholder baseline

/**
 * Branded age-gate. Blocks the site until the visitor confirms they are 18+.
 * Uses year-of-birth (low friction) and remembers the choice in localStorage.
 */
export default function AgeGate() {
  const [status, setStatus] = useState<"loading" | "open" | "passed" | "denied">(
    "loading"
  );
  const [year, setYear] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Read persisted choice on mount. Must run client-side only (localStorage is
    // unavailable during SSR) and we render null until known, so there's no gate
    // flash and no hydration mismatch — an effect is the correct tool here.
    const ok = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus(ok === "1" ? "passed" : "open");
  }, []);

  // Lock body scroll while the gate is open.
  useEffect(() => {
    if (status === "open" || status === "denied") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [status]);

  if (status === "loading" || status === "passed") return null;

  function handleEnter() {
    const y = Number(year);
    if (!y || year.length !== 4) {
      setError("لطفاً سال تولد خود را به‌صورت چهار رقمی وارد کنید.");
      return;
    }
    const age = CURRENT_YEAR - y;
    if (age < MIN_AGE) {
      setStatus("denied");
      return;
    }
    localStorage.setItem(STORAGE_KEY, "1");
    setStatus("passed");
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/90 px-5 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
    >
      <div className="smoke-bg glow-primary w-full max-w-md rounded-[var(--radius-card)] border border-border bg-surface/95 p-7 text-center sm:p-9">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <BoltIcon className="h-7 w-7" />
        </div>

        {status === "denied" ? (
          <>
            <h2
              id="age-gate-title"
              className="mt-5 text-xl font-extrabold sm:text-2xl"
            >
              دسترسی امکان‌پذیر نیست
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              محصولات این فروشگاه مخصوص افراد بالای{" "}
              <span className="text-text">{toFaDigits(MIN_AGE)}</span> سال است.
              متأسفانه شما مجاز به ورود نیستید.
            </p>
          </>
        ) : (
          <>
            <h2
              id="age-gate-title"
              className="mt-5 text-xl font-extrabold sm:text-2xl"
            >
              تأیید سن
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              این وب‌سایت محصولات دخانی و حاوی نیکوتین عرضه می‌کند. برای رعایت
              قوانین، ورود تنها برای افراد بالای {toFaDigits(MIN_AGE)} سال مجاز است.
            </p>

            <div className="mt-6 text-start">
              <label
                htmlFor="birth-year"
                className="mb-2 block text-sm font-semibold"
              >
                سال تولد خود را وارد کنید
              </label>
              <input
                id="birth-year"
                inputMode="numeric"
                dir="ltr"
                maxLength={4}
                placeholder="1380"
                value={year}
                onChange={(e) => {
                  setYear(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleEnter()}
                className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-center text-lg tracking-widest text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
              />
              {error && (
                <p className="mt-2 text-xs text-primary">{error}</p>
              )}
            </div>

            <button
              onClick={handleEnter}
              className="glow-primary mt-6 w-full rounded-xl bg-primary px-6 py-3 font-bold text-bg transition hover:bg-primary-strong"
            >
              ورود به فروشگاه
            </button>
            <a
              href="https://www.google.com"
              className="mt-3 block text-xs text-muted underline-offset-4 transition hover:text-text hover:underline"
            >
              کمتر از {toFaDigits(MIN_AGE)} سال دارم
            </a>
          </>
        )}
      </div>
    </div>
  );
}
