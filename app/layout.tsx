import type { Metadata } from "next";
import { Geist, Geist_Mono, EB_Garamond } from "next/font/google";
import localfont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const Garamond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Outliers hackathan",
  description: "Outliers AI hackathon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${Garamond.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
