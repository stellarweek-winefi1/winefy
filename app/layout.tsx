import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VineFi - Invierte en Vinos Premium",
  description: "Invierte en vinos premium de Chile, Argentina (Mendoza) y USA desde $50. Digitalización respaldada en Stellar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
