import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets:  ["latin"],
  variable: "--font-inter",
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
    <html lang="pt-BR" className={inter.variable}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
