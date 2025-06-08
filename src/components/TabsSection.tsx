"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface Tab {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
}

interface TabsSectionProps {
  tabs: Tab[];
}

export default function TabsSection({ tabs }: TabsSectionProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
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
                {tab.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}