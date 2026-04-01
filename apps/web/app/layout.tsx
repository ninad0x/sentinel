import type { Metadata } from "next";
import { Manrope } from "next/font/google"
import "./globals.css";
import Providers from "@/components/provider";

const manrope = Manrope({})

export const metadata: Metadata = {
  title: "Sentinel Monitor",
  description: "Check your website status across the globe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${manrope.className} `}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
