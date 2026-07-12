import type { Metadata } from "next";
// Vazirmatn: free (OFL) variable Persian font, self-hosted via Fontsource
// (font files served from node_modules, no build-time/runtime request to Google).
import "@fontsource-variable/vazirmatn";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
