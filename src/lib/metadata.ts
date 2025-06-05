import type { Metadata } from 'next';

export const defaultMetadata: Metadata = {
  title: {
    default: "Marquese T Davis | IT Leadership & Innovation",
    template: "%s | Marquese T Davis"
  },
  description: "IT Leadership expert specializing in digital transformation, strategy, and technological innovation. Join me on a journey through technology leadership.",
  keywords: ["IT Leadership", "Digital Transformation", "Technology Strategy", "Innovation", "Enterprise Technology"],
  authors: [{ name: "Marquese T Davis" }],
  creator: "Marquese T Davis",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mtdavis.info",
    siteName: "Marquese T Davis",
    title: "Marquese T Davis | IT Leadership & Innovation",
    description: "IT Leadership expert specializing in digital transformation, strategy, and technological innovation.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Marquese T Davis - IT Leadership"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Marquese T Davis | IT Leadership & Innovation",
    description: "IT Leadership expert specializing in digital transformation, strategy, and technological innovation.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
};
