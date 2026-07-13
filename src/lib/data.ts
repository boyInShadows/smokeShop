// Placeholder Persian content + store data for the v1 landing.
// Real catalog/content wired up later (backend = Chapter 3).

export type NavLink = { label: string; href: string };

export const NAV_LINKS: NavLink[] = [
  { label: "ویپ یکبار مصرف", href: "#brands" },
  { label: "پاد سیستم", href: "#bestsellers" },
  { label: "جویس", href: "#bestsellers" },
  { label: "برندها", href: "#brands" },
  { label: "درباره ما", href: "#story" },
];

// Rotating compliance / benefit lines shown in the top ticker.
export const TICKER_ITEMS: string[] = [
  "ارسال رایگان برای خرید بالای ۵۰۰ هزار تومان",
  "کالای ۱۰۰٪ اصل با ضمانت اصالت",
  "مخصوص افراد بالای ۱۸ سال",
  "ضمانت بازگشت وجه تا ۷ روز",
  "پشتیبانی و ارسال به سراسر ایران",
];

/**
 * Hero flavour beats — "The Exhale".
 *
 * The smoke plate (`/hero/smoke.webp`) is neutral greyscale on pure black, so
 * multiplying a gradient onto it paints the smoke *that* colour. Scrolling the
 * hero cross-fades between these, so the smoke reads as the flavour. `from` is
 * the deep base of the plume, `to` is the bright neon crown.
 *
 * Two of the three are the brand tokens on purpose (cyan = secondary,
 * magenta = primary); amber is the warm outlier that keeps it from being a
 * two-colour site.
 *
 * Each beat carries a real product panel — this is the introduction to the
 * product, so it has to sell, not just label. `window` is where the beat owns
 * the stage: `in` is its entrance, `out` is where it clears for the next one.
 * The last beat has no `out` — it holds to the end of the hero.
 */
export type HeroFlavor = {
  name: string;
  note: string;
  desc: string;
  device: string; // Latin device name — wrap in <bdi>
  specs: string[];
  price: number;
  oldPrice?: number;
  cta: string;
  from: string; // deep base of the plume
  to: string; // bright crown
  href: string;
  window: { in: [number, number]; out: [number, number] | null };
};

export const HERO_FLAVORS: HeroFlavor[] = [
  {
    name: "یخ و نعناع",
    note: "خنکای نفس‌گیر",
    desc: "ضربهٔ سرد نعناع با ته‌مایهٔ یخ؛ برای وقتی که می‌خواهی نفست تازه شود.",
    device: "Elf Bar BC5000",
    specs: ["۵۰۰۰ پاف", "نیکوتین ۲٪", "خنکی بالا"],
    price: 380000,
    oldPrice: 450000,
    cta: "خرید طعم یخ",
    from: "#0e4a5a",
    to: "#22d3ee",
    href: "#bestsellers",
    // Panels hand over SEQUENTIALLY — one is fully gone before the next arrives.
    // Overlapping them cross-fades two headlines in the same spot and reads as
    // mush. The smoke transition (0.30–0.42) sits in the gap, so the colour
    // changes first and the new panel answers it.
    window: { in: [0.06, 0.16], out: [0.26, 0.34] },
  },
  {
    name: "توت‌فرنگی و بری",
    note: "شیرینی پررنگ",
    desc: "توت‌فرنگی رسیده و بری‌های جنگلی؛ شیرین، پرحجم و ماندگار روی زبان.",
    device: "Lost Mary OS5000",
    specs: ["۵۰۰۰ پاف", "نیکوتین ۲٪", "دود پرحجم"],
    price: 420000,
    cta: "خرید طعم بری",
    from: "#4a0e2a",
    to: "#ff3d9a",
    href: "#bestsellers",
    window: { in: [0.38, 0.48], out: [0.58, 0.66] },
  },
  {
    name: "انبه و هلو",
    note: "گرمای استوایی",
    desc: "انبهٔ گرم و هلوی آبدار؛ طعمی که تابستان را تمام سال نگه می‌دارد.",
    device: "Geek Bar Pulse 15K",
    specs: ["۱۵۰۰۰ پاف", "نمایشگر شارژ", "دو حالت دود"],
    price: 540000,
    oldPrice: 620000,
    cta: "خرید طعم انبه",
    from: "#4a2a08",
    to: "#ffa53d",
    href: "#bestsellers",
    window: { in: [0.7, 0.8], out: null },
  },
];

/**
 * Category tiles — a bento grid: six compact tiles, then three wide banners.
 * `span` drives the grid, not the styling, so the layout stays data-driven.
 * Each tile owns a gradient wash; the neon is in the wash, never on the type.
 */
export type Category = {
  title: string;
  sub: string;
  count: number;
  from: string;
  to: string;
  href: string;
};

export const CATEGORIES: Category[] = [
  { title: "ویپ", sub: "دستگاه‌های حرفه‌ای", count: 64, from: "#3b0764", to: "#8b5cf6", href: "#bestsellers" },
  { title: "پاد سیستم", sub: "بهترین برند انواع پاد", count: 48, from: "#0e4a5a", to: "#22d3ee", href: "#bestsellers" },
  { title: "جویس", sub: "بیشترین تنوع طعم", count: 92, from: "#4a0e2a", to: "#ff3d9a", href: "#bestsellers" },
  { title: "ویپ یکبار مصرف", sub: "آمادهٔ استفاده", count: 71, from: "#4a2a08", to: "#ffa53d", href: "#bestsellers" },
  { title: "لوازم جانبی", sub: "کویل، شارژر، کیف", count: 35, from: "#0f3d2e", to: "#34d399", href: "#brands" },
  { title: "ایکاس", sub: "هیت‌نات‌برن", count: 18, from: "#3f1020", to: "#fb7185", href: "#brands" },
];

export const CATEGORY_BANNERS: Category[] = [
  { title: "جویس سالت", sub: "نیکوتین بالا، حجم کم", count: 44, from: "#1e1b4b", to: "#6366f1", href: "#bestsellers" },
  { title: "انواع ویپ پاد", sub: "از مبتدی تا حرفه‌ای", count: 58, from: "#4a0e2a", to: "#ff3d9a", href: "#bestsellers" },
  { title: "سالت نیکوتین", sub: "برندهای اورجینال", count: 27, from: "#0e4a5a", to: "#22d3ee", href: "#brands" },
];

export type Brand = {
  name: string; // Latin brand name (wrap in <bdi> when rendered)
  tagline: string;
  productCount: number;
  featured?: boolean;
};

export const BRANDS: Brand[] = [
  { name: "Elf Bar", tagline: "پرفروش‌ترین ویپ یکبار مصرف", productCount: 42, featured: true },
  { name: "Lost Mary", tagline: "طعم‌های خاص و ماندگار", productCount: 28 },
  { name: "Geek Bar", tagline: "طراحی آینده‌نگر و پرقدرت", productCount: 35, featured: true },
  { name: "Vaporesso", tagline: "پاد سیستم‌های حرفه‌ای", productCount: 19 },
  { name: "SMOK", tagline: "دستگاه‌های قدرتمند و ماد", productCount: 24 },
  { name: "Voopoo", tagline: "فناوری چیپست هوشمند", productCount: 16 },
];

export type Product = {
  name: string; // Persian display name
  brand: string; // Latin brand
  flavor: string;
  image: string; // product shot, on black — the card blends it with `screen`
  price: number; // Toman
  oldPrice?: number;
  discountPct?: number;
  rating: number; // 0..5
  badge?: string;
};

export const BESTSELLERS: Product[] = [
  {
    name: "ویپ یکبار مصرف انگور یخ",
    brand: "Elf Bar",
    flavor: "BC5000 · انگور یخ",
    image: "/products/p1.webp",
    price: 380000,
    oldPrice: 450000,
    discountPct: 16,
    rating: 4.8,
    badge: "پرفروش",
  },
  {
    name: "پاد سیستم هلو انبه",
    brand: "Lost Mary",
    flavor: "OS5000 · هلو انبه خربزه",
    image: "/products/p2.webp",
    price: 420000,
    rating: 4.7,
  },
  {
    name: "ویپ پالس طالبی",
    brand: "Geek Bar",
    flavor: "Pulse 15K · طالبی یخ",
    image: "/products/p3.webp",
    price: 540000,
    oldPrice: 620000,
    discountPct: 13,
    rating: 4.9,
    badge: "جدید",
  },
  {
    name: "دستگاه ایکس‌راس مینی",
    brand: "Vaporesso",
    flavor: "XROS 3 Mini · نقره‌ای",
    image: "/products/p4.webp",
    price: 690000,
    rating: 4.6,
  },
  {
    name: "ویپ توت‌فرنگی کیوی",
    brand: "Elf Bar",
    flavor: "BC5000 · توت‌فرنگی کیوی",
    image: "/products/p5.webp",
    price: 380000,
    rating: 4.8,
    badge: "پرفروش",
  },
  {
    name: "پاد آرگوس هوشمند",
    brand: "Voopoo",
    flavor: "Argus P1 · مشکی",
    image: "/products/p6.webp",
    price: 750000,
    oldPrice: 850000,
    discountPct: 12,
    rating: 4.7,
  },
];

/**
 * "پیشنهادات شگفت‌انگیز" — the flash-sale rail. Every item must carry a real
 * discount; a countdown with nothing to count down to is a dark pattern.
 * The campaign ends at the next local midnight (computed client-side — see
 * OffersRail, which renders a stable placeholder on the server so the clock
 * can't cause a hydration mismatch).
 */
export const OFFERS: Product[] = BESTSELLERS.filter((p) => p.discountPct);

export type TrustItem = { title: string; desc: string; icon: TrustIcon };
export type TrustIcon = "shield" | "truck" | "age" | "lock";

export const TRUST_ITEMS: TrustItem[] = [
  { title: "اصالت کالا", desc: "تضمین اورجینال بودن تمام محصولات", icon: "shield" },
  { title: "ارسال سریع", desc: "ارسال به سراسر ایران در سریع‌ترین زمان", icon: "truck" },
  { title: "۱۸+ مطابق قوانین", desc: "فروش فقط به افراد بزرگسال", icon: "age" },
  { title: "پرداخت امن", desc: "درگاه پرداخت معتبر و رمزنگاری‌شده", icon: "lock" },
];

export type Testimonial = { name: string; city: string; text: string; rating: number };

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "آرش رضایی",
    city: "تهران",
    text: "کیفیت محصولات عالی بود و دقیقاً همون چیزی که سفارش داده بودم به دستم رسید. بسته‌بندی هم خیلی تمیز و حرفه‌ای بود.",
    rating: 5,
  },
  {
    name: "نگار محمدی",
    city: "اصفهان",
    text: "سرعت ارسالشون واقعاً بی‌نظیره. سفارشمو کمتر از دو روزه گرفتم و اصالت کالا هم کاملاً مشخص بود.",
    rating: 5,
  },
  {
    name: "سینا کریمی",
    city: "شیراز",
    text: "تنوع برندها خیلی خوبه و پشتیبانی هم قبل خرید کامل راهنماییم کرد. حتماً باز هم خرید می‌کنم.",
    rating: 4,
  },
];

export const FOOTER_LINKS: { title: string; links: NavLink[] }[] = [
  {
    title: "فروشگاه",
    links: [
      { label: "ویپ یکبار مصرف", href: "#brands" },
      { label: "پاد سیستم", href: "#bestsellers" },
      { label: "جویس و لیکویید", href: "#bestsellers" },
      { label: "پرفروش‌ترین‌ها", href: "#bestsellers" },
    ],
  },
  {
    title: "راهنما",
    links: [
      { label: "نحوه ثبت سفارش", href: "#" },
      { label: "شرایط ارسال", href: "#" },
      { label: "بازگشت کالا", href: "#" },
      { label: "سوالات متداول", href: "#" },
    ],
  },
  {
    title: "درباره",
    links: [
      { label: "درباره ما", href: "#story" },
      { label: "تماس با ما", href: "#" },
      { label: "قوانین و مقررات", href: "#" },
      { label: "حریم خصوصی", href: "#" },
    ],
  },
];

export const NICOTINE_WARNING =
  "هشدار: این محصولات حاوی نیکوتین هستند. نیکوتین یک مادهٔ اعتیادآور است. فروش به افراد زیر ۱۸ سال ممنوع می‌باشد.";
