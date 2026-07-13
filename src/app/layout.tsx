import type { Metadata } from "next";
// Vazirmatn: free (OFL) variable Persian font, self-hosted via Fontsource
// (font files served from node_modules, no build-time/runtime request to Google).
import "@fontsource-variable/vazirmatn";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "ویپ اسموک | فروشگاه تخصصی ویپ و پاد",
  description:
    "جدیدترین برندهای اورجینال ویپ، پاد و سیگار الکترونیک با ضمانت اصالت کالا و ارسال سریع به سراسر ایران. مخصوص افراد بالای ۱۸ سال.",
  openGraph: {
    title: "ویپ اسموک | فروشگاه تخصصی ویپ و پاد",
    description:
      "جدیدترین برندهای اورجینال ویپ، پاد و سیگار الکترونیک با ضمانت اصالت و ارسال سریع.",
    locale: "fa_IR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg text-text font-sans">
        {/* Applies the saved palette BEFORE first paint. This is the only reason a
            themed visitor does not see a flash of the default palette: it runs
            synchronously as the parser reaches it, ahead of any body content, so
            the CSS variables are already right when the first pixel is drawn.
            React cannot do this — it only gets to run after hydration.

            The whitelist is not decoration: `localStorage` is user-writable, and
            this value goes straight into a DOM attribute. Anything unrecognised is
            ignored rather than reflected. Kept in sync with THEME_IDS/THEME_KEY in
            src/lib/themes.ts. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('wape_theme');if(['dusk','ember','toxic','indigo'].indexOf(t)>-1)document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
