'use client';

import React, { useEffect, useState } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export default function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [currentUrl, setCurrentUrl] = useState(url);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Update URL to actual window location when component mounts
    setCurrentUrl(window.location.href);
  }, []);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description || ''}\n\n${currentUrl}`)}`
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 md:hidden flex flex-col items-end">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-1.5 shadow-lg rounded-l-lg transition-colors duration-200"
          aria-label={isOpen ? "Close share menu" : "Open share menu"}
        >
          <span className="text-sm font-bold rotate-180 tracking-widest uppercase" style={{ writingMode: 'vertical-rl' }}>
            Share
          </span>
        </button>

        {/* Share Buttons Container - Mobile */}
        <div className={`
          absolute top-0 right-0 flex flex-col gap-3
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          transition-transform duration-300 ease-in-out
          bg-white/90 backdrop-blur-sm
          p-3
          rounded-l-lg
          shadow-lg
          mt-16
        `}>
          {/* Twitter/X Share */}
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            aria-label="Share on Twitter/X"
          >
            <svg className="w-5 h-5 text-black group-hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
          </a>

          {/* Facebook Share */}
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            aria-label="Share on Facebook"
          >
            <svg className="w-5 h-5 text-black group-hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
            </svg>
          </a>

          {/* LinkedIn Share */}
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            aria-label="Share on LinkedIn"
          >
            <svg className="w-5 h-5 text-black group-hover:text-blue-700 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>

          {/* Email Share */}
          <a
            href={shareLinks.email}
            className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            aria-label="Share via Email"
          >
            <svg className="w-5 h-5 text-black group-hover:text-gray-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
              <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Desktop Share Buttons */}
      <div className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col gap-3 z-40">
        {/* Twitter/X Share */}
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 group"
          aria-label="Share on Twitter/X"
        >
          <svg className="w-5 h-5 text-black group-hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </svg>
        </a>

        {/* Facebook Share */}
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 group"
          aria-label="Share on Facebook"
        >
          <svg className="w-5 h-5 text-black group-hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
          </svg>
        </a>

        {/* LinkedIn Share */}
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 group"
          aria-label="Share on LinkedIn"
        >
          <svg className="w-5 h-5 text-black group-hover:text-blue-700 transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>

        {/* Email Share */}
        <a
          href={shareLinks.email}
          className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 group"
          aria-label="Share via Email"
        >
          <svg className="w-5 h-5 text-black group-hover:text-gray-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
            <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
          </svg>
        </a>
      </div>
    </>
  );
} 