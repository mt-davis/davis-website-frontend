'use client';

import React, { useEffect, useState } from 'react';
import { FaTwitter, FaLinkedin, FaFacebook, FaReddit, FaEnvelope } from 'react-icons/fa';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export default function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [currentUrl, setCurrentUrl] = useState(url);

  useEffect(() => {
    // Update URL to actual window location when component mounts
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');

  const shareLinks = [
    {
      name: 'Twitter',
      icon: FaTwitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}${description ? ` - ${encodedDescription}` : ''}`,
      color: 'bg-[#1DA1F2] hover:bg-[#1a91da]'
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
      color: 'bg-[#0A66C2] hover:bg-[#095196]'
    },
    {
      name: 'Facebook',
      icon: FaFacebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}${description ? ` - ${encodedDescription}` : ''}`,
      color: 'bg-[#1877F2] hover:bg-[#166fe5]'
    },
    {
      name: 'Reddit',
      icon: FaReddit,
      url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      color: 'bg-[#FF4500] hover:bg-[#e53d00]'
    },
    {
      name: 'Email',
      icon: FaEnvelope,
      url: `mailto:?subject=${encodedTitle}&body=${description ? `${encodedDescription}%0A%0A` : ''}Read more at:%0A${encodedUrl}`,
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ];

  const handleShare = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof shareLinks[0]) => {
    e.preventDefault();
    
    // For email, just use the href
    if (link.name === 'Email') {
      window.location.href = link.url;
      return;
    }

    // For social media, open in a popup window
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    window.open(
      link.url,
      `Share on ${link.name}`,
      `width=${width},height=${height},left=${left},top=${top},location=no,menubar=no,toolbar=no,status=no`
    );
  };

  return (
    <div className="flex flex-col items-center space-y-4 my-8">
      <h3 className="text-lg font-semibold text-gray-900">Share this content</h3>
      <div className="flex flex-wrap justify-center gap-3">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            onClick={(e) => handleShare(e, link)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${link.color} text-white p-3 rounded-full transition-colors duration-200 flex items-center justify-center cursor-pointer`}
            aria-label={`Share on ${link.name}`}
          >
            <link.icon className="w-5 h-5" />
          </a>
        ))}
      </div>
    </div>
  );
} 