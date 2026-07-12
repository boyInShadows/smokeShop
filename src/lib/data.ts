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
    price: 420000,
    rating: 4.7,
  },
  {
    name: "ویپ پالس طالبی",
    brand: "Geek Bar",
    flavor: "Pulse 15K · طالبی یخ",
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
    price: 690000,
    rating: 4.6,
  },
  {
    name: "ویپ توت‌فرنگی کیوی",
    brand: "Elf Bar",
    flavor: "BC5000 · توت‌فرنگی کیوی",
    price: 380000,
    rating: 4.8,
    badge: "پرفروش",
  },
  {
    name: "پاد آرگوس هوشمند",
    brand: "Voopoo",
    flavor: "Argus P1 · مشکی",
    price: 750000,
    oldPrice: 850000,
    discountPct: 12,
    rating: 4.7,
  },
];

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
