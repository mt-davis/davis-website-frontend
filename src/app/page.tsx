import Link from 'next/link';
import Image from 'next/image';
import HeroSection from '@/components/HeroSection';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticlesSection from '@/components/ArticlesSection';
import TestImage from '@/components/TestImage';
import TabsSection from '@/components/TabsSection';
import QuoteSection from '@/components/QuoteSection';
import type { Metadata } from 'next';
import { defaultMetadata } from '@/lib/seo';
// …
export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Home | Marquese T Davis",
  description: "Welcome to my personal website focused on IT Leadership and Innovation.",
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Header />

      {/* Hero Section */}
      <HeroSection />
      <QuoteSection />
    
      {/* Articles Section */}
     
      <ArticlesSection />
      <TabsSection />

      <Footer />
    </main>
  );
}