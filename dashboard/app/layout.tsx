import type { Metadata } from "next";
import { Inter, Black_Han_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets:  ["latin"],
  variable: "--font-inter",
  display:  "swap",
});

const blackHanSans = Black_Han_Sans({
  subsets:  ["latin"],
  weight:   "400",          // Black Han Sans só tem 400, mas já é ultra-bold
  variable: "--font-sancho-logo",
  display:  "swap",
});

export const metadata: Metadata = {
  title:       "Sancho Gestão de Carreiras",
  description: "Plataforma interna — Sancho Gestão de Carreiras",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${blackHanSans.variable}`}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
