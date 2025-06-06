import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Great_Vibes } from 'next/font/google';
import { Montserrat } from 'next/font/google';
import "./globals.css";
import { defaultMetadata } from '@/lib/metadata';
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-great-vibes',
});

const montserrat = Montserrat({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export const metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} ${greatVibes.variable} ${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
