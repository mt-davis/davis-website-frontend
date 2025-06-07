"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface HamburgerMenuProps {
  variant?: 'light' | 'dark';
}

export default function HamburgerMenu({ variant = 'light' }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('/');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set active link based on current path
    setActiveLink(window.location.pathname);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when menu is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const barColor = variant === 'dark' ? 'bg-gray-900' : 'bg-white';

  return (
    <div className="relative" ref={menuRef}>
      {/* Hamburger Button */}
      <button 
        onClick={toggleMenu}
        className="flex flex-col justify-center items-center w-12 h-12 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors duration-200"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span className={`block w-5 md:w-6 h-0.5 ${barColor} transform transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`block w-5 md:w-6 h-0.5 ${barColor} transform transition-all duration-300 ${isOpen ? 'opacity-0 translate-x-3' : ''} my-1`}></span>
        <span className={`block w-5 md:w-6 h-0.5 ${barColor} transform transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>

      {/* Menu Overlay - Mobile */}
      <div 
        className={`
          fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden
          transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `} 
        onClick={() => setIsOpen(false)}
      />

      {/* Menu Content */}
      <div className={`
        fixed md:absolute top-0 left-0 h-screen md:h-auto w-[85%] md:w-56 
        bg-gradient-to-br from-white via-white to-gray-50
        md:bg-white/95 md:backdrop-blur-sm shadow-lg md:rounded-xl py-6 z-50
        transform transition-all duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:top-full md:left-0 md:mt-2
        ${!isOpen && 'md:hidden'}
      `}>
        {/* Menu Header - Both Mobile and Desktop */}
        <div className="flex flex-col px-6 mb-8 border-b border-gray-100 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl font-bold flex items-center">
                <span className="bg-gray-100 px-2.5 py-1.5 rounded-lg mr-2 text-gray-800 font-black tracking-tighter">
                  MD
                </span>
                <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Navigation
                </span>
              </h2>
            </div>
            {/* Close button - Mobile only */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 hover:rotate-90 md:hidden"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4 md:hidden">Explore the different sections of the website</p>
        </div>
        
        <nav className="space-y-2.5 px-4">
          <Link 
            href="/" 
            className={`group flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 
              ${activeLink === '/' 
                ? 'bg-gray-900 text-white shadow-md translate-x-2' 
                : 'text-gray-700 hover:bg-gray-100 hover:translate-x-2'}`}
            onClick={() => {
              setIsOpen(false);
              setActiveLink('/');
            }}
          >
            <div className={`w-10 h-10 flex items-center justify-center rounded-xl mr-4 transition-all duration-300
              ${activeLink === '/' 
                ? 'bg-white/20' 
                : 'bg-gray-100 group-hover:bg-white group-hover:shadow-md'}`}>
              <svg className={`w-5 h-5 transition-colors duration-300 ${activeLink === '/' ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'}`} 
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-base">Home</span>
              <span className={`text-xs mt-0.5 ${activeLink === '/' ? 'text-gray-200' : 'text-gray-500'}`}>
                Return to the main page
              </span>
            </div>
          </Link>

          <Link 
            href="/projects" 
            className={`group flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 
              ${activeLink === '/projects' 
                ? 'bg-gray-900 text-white shadow-md translate-x-2' 
                : 'text-gray-700 hover:bg-gray-100 hover:translate-x-2'}`}
            onClick={() => {
              setIsOpen(false);
              setActiveLink('/projects');
            }}
          >
            <div className={`w-10 h-10 flex items-center justify-center rounded-xl mr-4 transition-all duration-300
              ${activeLink === '/projects' 
                ? 'bg-white/20' 
                : 'bg-gray-100 group-hover:bg-white group-hover:shadow-md'}`}>
              <svg className={`w-5 h-5 transition-colors duration-300 ${activeLink === '/projects' ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'}`} 
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-base">Projects</span>
              <span className={`text-xs mt-0.5 ${activeLink === '/projects' ? 'text-gray-200' : 'text-gray-500'}`}>
                View my latest work
              </span>
            </div>
          </Link>

          <Link 
            href="/articles" 
            className={`group flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 
              ${activeLink === '/articles' 
                ? 'bg-gray-900 text-white shadow-md translate-x-2' 
                : 'text-gray-700 hover:bg-gray-100 hover:translate-x-2'}`}
            onClick={() => {
              setIsOpen(false);
              setActiveLink('/articles');
            }}
          >
            <div className={`w-10 h-10 flex items-center justify-center rounded-xl mr-4 transition-all duration-300
              ${activeLink === '/articles' 
                ? 'bg-white/20' 
                : 'bg-gray-100 group-hover:bg-white group-hover:shadow-md'}`}>
              <svg className={`w-5 h-5 transition-colors duration-300 ${activeLink === '/articles' ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'}`} 
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15M9 11l3 3m0 0l3-3m-3 3V8" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-base">Articles</span>
              <span className={`text-xs mt-0.5 ${activeLink === '/articles' ? 'text-gray-200' : 'text-gray-500'}`}>
                Read my latest insights
              </span>
            </div>
          </Link>

          {/* Social Links - Mobile Only */}
          <div className="md:hidden mt-8 px-4 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-4">Connect with me</p>
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/in/marquesedavis/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-300"
              >
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a 
                href="https://medium.mtdavis.info/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-300"
              >
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                </svg>
              </a>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
