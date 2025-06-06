"use client";

import { useState } from 'react';
import Image from 'next/image';

export default function TabsSection() {
  const [activeTab, setActiveTab] = useState('first');

  const tabs = [
    {
      id: 'first',
      icon: '/images/icons/bg-chart@2x.png',
      title: 'STRATEGY & INSIGHTS',
      header: 'Leading with Innovation and Data-Driven Acumen.',
      content: [
        'In the dynamic landscape of technology and digital growth, my approach to Strategy and Insight is shaped by a commitment to innovation and a deep understanding of market dynamics. Strategy, for me, is about charting new courses and embracing the transformative power of change. It involves not just envisioning what could be but actively shaping the future by being acutely aware of current trends.',
        <div className="w-full h-px bg-gray-200 my-4"></div>,
        'Insight is crucial in this strategic journey. It revolves around a data-centric approach to decision-making. Delving into data allows us to decode complex patterns, anticipate market shifts, and grasp customer preferences in a comprehensive manner. This blend of strategic vision and insightful data analysis ensures that our business moves are both progressive and grounded in real, actionable evidence.'
      ]
    },
    {
      id: 'second',
      icon: '/images/icons/bg-works@2x.png',
      title: 'DIGITAL TRANSFORMATION',
      header: 'Leading the Charge in the Digital Age.',
      content: [
        "To me, Digital Transformation is about the seamless adoption and integration of digital technology into all aspects of a business. It's about fundamentally altering how we operate and deliver value to customers. It's a continuous journey of evolution and adaptation, aiming to improve efficiency, enhance customer experience, and foster a culture of innovation that keeps a business at the forefront of the digital revolution."
      ]
    },
    {
      id: 'third',
      icon: '/images/icons/bg-keynote@2x.png',
      title: 'LEADERSHIP',
      header: 'Empowering Teams, Shaping Futures',
      content: [
        "In my experience, effective leadership is about cultivating an environment of empowerment and innovation. It's about setting a clear vision, inspiring teams to align with that vision, and then providing them the autonomy and resources to experiment, learn, and grow.",
        <div className="w-full h-px bg-gray-200 my-4"></div>,
        "Good leaders create more leaders, not just followers. They encourage creativity, welcome diverse perspectives, and view setbacks as valuable learning opportunities. This approach is crucial for fostering a culture where innovation thrives and where every team member feels valued and motivated to contribute to the collective success."
      ]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center">
          {/* Tabs Navigation */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center group ${
                  activeTab === tab.id ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <div className="w-16 h-16 mb-3 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <Image
                    src={tab.icon}
                    alt={tab.title}
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                </div>
                <span className="text-sm font-semibold tracking-wider">{tab.title}</span>
                {activeTab === tab.id && (
                  <div className="h-1 w-full bg-black mt-2 transition-all" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="w-full max-w-4xl">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`transition-opacity duration-300 ${
                  activeTab === tab.id ? 'opacity-100' : 'hidden opacity-0'
                }`}
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-4">{tab.header}</h2>
                  </div>
                  <div className="space-y-4">
                    {tab.content.map((paragraph, index) => (
                      typeof paragraph === 'string' ? (
                        <p key={index} className="text-gray-600 leading-relaxed">
                          {paragraph}
                        </p>
                      ) : (
                        <div key={index} className="w-full h-px bg-gray-200 my-4"></div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}