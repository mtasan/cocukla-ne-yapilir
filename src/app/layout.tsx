import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ÇocuklaNeYapılır - Çocuğunla Bugün Ne Yapılır?",
  description:
    "Çocuğunuzun yaşına, konumunuza ve hava durumuna göre akıllı aktivite ve etkinlik önerileri. İstanbul ve Türkiye genelinde çocuk etkinlikleri, mekanlar ve daha fazlası.",
  keywords: [
    "çocuk etkinlikleri",
    "istanbul çocuk aktiviteleri",
    "çocukla ne yapılır",
    "aile etkinlikleri",
    "hafta sonu çocuk",
  ],
  openGraph: {
    title: "ÇocuklaNeYapılır - Çocuğunla Bugün Ne Yapılır?",
    description:
      "Yaş, konum ve hava durumuna göre akıllı aktivite önerileri",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
