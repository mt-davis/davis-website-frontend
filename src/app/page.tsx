import Link from 'next/link';
import Image from 'next/image';
import HeroSection from '@/components/HeroSection';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticlesSection from '@/components/ArticlesSection';
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
  const tabs = [
    {
      id: 'strategy',
      title: 'STRATEGY & INSIGHTS',
      icon: '/images/icons/bg-chart@2x.png',
      content: (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">Leading with Innovation and Data-Driven Acumen</h2>
          </div>
          <div className="space-y-4">
            <p className="text-gray-600 leading-relaxed">
              In the dynamic landscape of technology and digital growth, my approach to Strategy and Insight is shaped by a commitment to innovation and a deep understanding of market dynamics.
            </p>
            <div className="w-full h-px bg-gray-200 my-4"></div>
            <p className="text-gray-600 leading-relaxed">
              Insight is crucial in this strategic journey. It revolves around a data-centric approach to decision-making.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'transformation',
      title: 'DIGITAL TRANSFORMATION',
      icon: '/images/icons/bg-works@2x.png',
      content: (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">Leading the Charge in the Digital Age</h2>
          </div>
          <div className="space-y-4">
            <p className="text-gray-600 leading-relaxed">
              Digital Transformation is about the seamless adoption and integration of digital technology into all aspects of a business.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'leadership',
      title: 'LEADERSHIP',
      icon: '/images/icons/bg-keynote@2x.png',
      content: (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">Empowering Teams, Shaping Futures</h2>
          </div>
          <div className="space-y-4">
            <p className="text-gray-600 leading-relaxed">
              Effective leadership is about cultivating an environment of empowerment and innovation.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Header />

      {/* Hero Section */}
      <HeroSection />
      <QuoteSection />
    
      {/* Articles Section */}
     
      <ArticlesSection />
      <TabsSection tabs={tabs} />

      <Footer />
    </main>
  );
}