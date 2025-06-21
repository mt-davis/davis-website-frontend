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
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://mtdavis.info'
  },
  openGraph: {
    ...defaultMetadata.openGraph,
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://mtdavis.info',
    title: "Home | Marquese T Davis",
    description: "Welcome to my personal website focused on IT Leadership and Innovation."
  }
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
            In the dynamic landscape of technology and digital growth, my approach to Strategy and Insight is shaped by a commitment to innovation and a deep understanding of market dynamics. Strategy, for me, is about charting new courses and embracing the transformative power of change. It involves not just envisioning what could be but actively shaping the future by being acutely aware of current trends.
            </p>
            <div className="w-full h-px bg-gray-200 my-4"></div>
            <p className="text-gray-600 leading-relaxed">
            Insight is crucial in this strategic journey. It revolves around a data-centric approach to decision-making. Delving into data allows us to decode complex patterns, anticipate market shifts, and grasp customer preferences in a comprehensive manner. This blend of strategic vision and insightful data analysis ensures that our business moves are both progressive and grounded in real, actionable evidence.
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
            To me, Digital Transformation is about the seamless adoption and integration of digital technology into all aspects of a business. It's about fundamentally altering how we operate and deliver value to customers. It's a continuous journey of evolution and adaptation, aiming to improve efficiency, enhance customer experience, and foster a culture of innovation that keeps a business at the forefront of the digital revolution.
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
            In my experience, effective leadership is about cultivating an environment of empowerment and innovation. It's about setting a clear vision, inspiring teams to align with that vision, and then providing them the autonomy and resources to experiment, learn, and grow.
            </p>
            <div className="w-full h-px bg-gray-200 my-4"></div>
            <p className="text-gray-600 leading-relaxed">
            Good leaders create more leaders, not just followers. They encourage creativity, welcome diverse perspectives, and view setbacks as valuable learning opportunities. This approach is crucial for fostering a culture where innovation thrives and where every team member feels valued and motivated to contribute to the collective success.
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