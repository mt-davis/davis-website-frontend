"use client";

import { useState } from 'react';
import Link from 'next/link';

interface HamburgerMenuProps {
  variant?: 'light' | 'dark';
}

export default function HamburgerMenu({ variant = 'light' }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const barColor = variant === 'dark' ? 'bg-gray-900' : 'bg-white';

  return (
    <div className="relative">
      {/* Hamburger Button */}
      <button 
        onClick={toggleMenu}
        className="flex flex-col justify-center items-center w-8 md:w-10 h-8 md:h-10 space-y-1.5 focus:outline-none"
        aria-label="Toggle menu"
      >
        <span className={`block w-5 md:w-6 h-0.5 ${barColor} transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`block w-5 md:w-6 h-0.5 ${barColor} transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-5 md:w-6 h-0.5 ${barColor} transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>

      {/* Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white/90 backdrop-blur-sm shadow-lg rounded-md py-2 z-50">
          <Link href="/" className="block px-4 py-2 text-gray-800 hover:bg-gray-100/80 transition-colors">
            Home
          </Link>
          <Link href="/projects" className="block px-4 py-2 text-gray-800 hover:bg-gray-100/80 transition-colors">
            Projects
          </Link>
          <Link href="/articles" className="block px-4 py-2 text-gray-800 hover:bg-gray-100/80 transition-colors">
            Articles
          </Link>
        </div>
      )}
    </div>
  );
}
