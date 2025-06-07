"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface HamburgerMenuProps {
  variant?: 'light' | 'dark';
}

export default function HamburgerMenu({ variant = 'light' }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
      <div className={`
        fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden
        transition-opacity duration-300
        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `} />

      {/* Menu Content */}
      <div className={`
        fixed md:absolute top-0 left-0 h-screen md:h-auto w-3/4 md:w-48 bg-white md:bg-white/90 
        md:backdrop-blur-sm shadow-lg md:rounded-md py-4 z-50
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:top-full md:left-0 md:mt-2
        ${!isOpen && 'md:hidden'}
      `}>
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between px-4 py-2 mb-4 border-b border-gray-200 md:hidden">
          <span className="text-lg font-bold text-gray-900">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="space-y-1">
          <Link 
            href="/" 
            className="block px-4 py-3 text-gray-800 hover:bg-gray-100/80 active:bg-gray-200/80 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/projects" 
            className="block px-4 py-3 text-gray-800 hover:bg-gray-100/80 active:bg-gray-200/80 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Projects
          </Link>
          <Link 
            href="/articles" 
            className="block px-4 py-3 text-gray-800 hover:bg-gray-100/80 active:bg-gray-200/80 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Articles
          </Link>
        </nav>
      </div>
    </div>
  );
}
