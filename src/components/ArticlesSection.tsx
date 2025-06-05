"use client";

import Image from 'next/image';
import Link from 'next/link';

export default function ArticlesSection() {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">ARTICLES | PODCASTS</h2>
          <div className="w-24 h-1 bg-black mx-auto"></div>
        </div>
        
        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Article 1 */}
          <div className="group relative h-[240px] md:h-[270px] overflow-hidden rounded-lg shadow-lg bg-white">
            <a 
              href="https://medium.mtdavis.info/how-i-fortify-my-digital-life-with-multi-layered-security-part-1-06124d45a6a4?sk=e95374240b169cc55b021b9467f02f77" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block h-full relative"
            >
              <Image 
                src="/images/cybersecurity.png" 
                alt="How I Fortify My Digital Life with Multi-Layered Security — Part 1" 
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
              
              {/* Mobile Summary */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent md:hidden">
                <div className="p-4">
                  <h3 className="text-white text-lg font-bold line-clamp-2">
                    Fortify with Multi-Layered Security — Part 1
                  </h3>
                  <p className="text-gray-300 text-xs mt-1">
                    Cybersecurity • January 2023
                  </p>
                </div>
              </div>

              {/* Desktop Hover Description */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 transition-all duration-300 hidden md:block hover:opacity-100">
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-white text-2xl font-bold mb-2">
                    Fortify with Multi-Layered Security — Part 1
                  </h3>
                  <p className="text-white text-base mb-2 line-clamp-3">
                    A comprehensive guide to securing your digital life with multiple layers of protection.
                  </p>
                  <p className="text-gray-300 text-sm">
                    Cybersecurity • January 2023
                  </p>
                </div>
              </div>
            </a>
          </div>
          
          {/* Article 2 */}
          <div className="group relative h-[240px] md:h-[270px] overflow-hidden rounded-lg shadow-lg bg-white">
            <a 
              href="https://demigos.com/blog-post/heathtech-beat-06-marquese-t-davis" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block h-full relative"
            >
              <Image 
                src="/images/4567.png" 
                alt="Will Telemedicine Disappear After The Pandemic" 
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
              
              {/* Mobile Summary */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent md:hidden">
                <div className="p-4">
                  <h3 className="text-white text-lg font-bold line-clamp-2">
                    The Future of Telemedicine
                  </h3>
                  <p className="text-gray-300 text-xs mt-1">
                    Healthcare Tech • September 2022
                  </p>
                </div>
              </div>

              {/* Desktop Hover Description */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 transition-all duration-300 hidden md:block hover:opacity-100">
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-white text-2xl font-bold mb-2">
                    The Future of Telemedicine
                  </h3>
                  <p className="text-white text-base mb-2 line-clamp-3">
                    An analysis of telemedicine adoption during the pandemic and its potential long-term impact on healthcare delivery.
                  </p>
                  <p className="text-gray-300 text-sm">
                    Healthcare Tech • September 2022
                  </p>
                </div>
              </div>
            </a>
          </div>
          
          {/* Article 3 */}
          <div className="group relative h-[240px] md:h-[270px] overflow-hidden rounded-lg shadow-lg bg-white">
            <a 
              href="https://cxotechmagazine.com/navigating-the-digital-minefield-the-perils-of-personal-identifiable-information/"
              target="_blank" 
              rel="noopener noreferrer"
              className="block h-full relative"
            >
              <Image 
                src="/images/cxo.png" 
                alt="Navigating the Digital Minefield" 
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
              
              {/* Mobile Summary */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent md:hidden">
                <div className="p-4">
                  <h3 className="text-white text-lg font-bold line-clamp-2">
                    Navigating the Digital Minefield
                  </h3>
                  <p className="text-gray-300 text-xs mt-1">
                    Security • March 2023
                  </p>
                </div>
              </div>

              {/* Desktop Hover Description */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 transition-all duration-300 hidden md:block hover:opacity-100">
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-white text-2xl font-bold mb-2">
                    Navigating the Digital Minefield
                  </h3>
                  <p className="text-white text-base mb-2 line-clamp-3">
                    An in-depth exploration of the risks associated with personal identifiable information in today's digital landscape.
                  </p>
                  <p className="text-gray-300 text-sm">
                    Security • March 2023
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
