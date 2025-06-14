"use client";

import Link from 'next/link';
import HamburgerMenu from './HamburgerMenu';

export default function ArticleHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-sm z-50">
      <nav className="relative z-20 p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left: Hamburger Menu */}
          <div className="w-8 md:w-10">
            <HamburgerMenu variant="dark" />
          </div>

          {/* Center: DAVIS */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="text-xl md:text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
              DAVIS
            </Link>
          </div>

          {/* Right: Social Icons */}
          <div className="flex space-x-4">
            <Link 
              href="https://www.linkedin.com/in/marquesedavis/" 
              target="_blank"
              rel="noopener noreferrer" 
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              <span className="sr-only">LinkedIn</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </Link>
            <Link 
              href="https://medium.mtdavis.info/" 
              target="_blank"
              rel="noopener noreferrer" 
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              <span className="sr-only">Medium</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
              </svg>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
} 