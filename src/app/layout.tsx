import type { Metadata } from "next";
import { Hind_Siliguri, Manrope, Noto_Serif_Bengali, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif-bn",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "ডিওআইসিটি আইডিয়া পোর্টাল — প্রযুক্তিভিত্তিক উদ্ভাবনের জাতীয় প্ল্যাটফর্ম",
    template: "%s · ডিওআইসিটি আইডিয়া পোর্টাল",
  },
  description:
    "এআই, আইওটি, ক্লাউড ও ডেটা-নির্ভর প্রযুক্তি দিয়ে জনসেবার সমস্যা সমাধানের আইডিয়া — উপজেলা থেকে জেলা, সদর দপ্তর ও DPP পর্যন্ত এক প্ল্যাটফর্মে।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      data-scroll-behavior="smooth"
      className={`${hindSiliguri.variable} ${manrope.variable} ${notoSerifBengali.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
