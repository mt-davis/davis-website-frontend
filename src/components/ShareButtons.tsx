'use client';

import React, { useEffect, useState } from 'react';
import { FaLinkedin, FaFacebook, FaReddit, FaEnvelope } from 'react-icons/fa';
import { faSquareXTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconType } from 'react-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

type ReactIconLink = {
  name: string;
  type: 'react-icon';
  icon: IconType;
  url: string;
  color: string;
  style: string;
};

type FontAwesomeLink = {
  name: string;
  type: 'font-awesome';
  icon: IconDefinition;
  url: string;
  color: string;
  style: string;
};

type ShareLink = ReactIconLink | FontAwesomeLink;

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

  const shareLinks: ShareLink[] = [
    {
      name: 'X',
      type: 'font-awesome',
      icon: faSquareXTwitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}${description ? ` - ${encodedDescription}` : ''}`,
      color: 'bg-black hover:bg-gray-800',
      style: 'rounded-full'
    },
    {
      name: 'LinkedIn',
      type: 'react-icon',
      icon: FaLinkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
      color: 'bg-[#0A66C2] hover:bg-[#095196]',
      style: 'rounded-full'
    },
    {
      name: 'Facebook',
      type: 'react-icon',
      icon: FaFacebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}${description ? ` - ${encodedDescription}` : ''}`,
      color: 'bg-[#1877F2] hover:bg-[#166fe5]',
      style: 'rounded-full'
    },
    {
      name: 'Reddit',
      type: 'react-icon',
      icon: FaReddit,
      url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      color: 'bg-[#FF4500] hover:bg-[#e53d00]',
      style: 'rounded-full'
    },
    {
      name: 'Email',
      type: 'react-icon',
      icon: FaEnvelope,
      url: `mailto:?subject=${encodedTitle}&body=${description ? `${encodedDescription}%0A%0A` : ''}Read more at:%0A${encodedUrl}`,
      color: 'bg-gray-600 hover:bg-gray-700',
      style: 'rounded-full'
    }
  ];

  const handleShare = (e: React.MouseEvent<HTMLAnchorElement>, link: ShareLink) => {
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

  const renderIcon = (link: ShareLink) => {
    if (link.type === 'font-awesome') {
      return <FontAwesomeIcon icon={link.icon} size="lg" />;
    }
    const Icon = link.icon;
    return <Icon className="w-5 h-5" />;
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
            className={`${link.color} ${link.style} text-white p-2 transition-all duration-200 flex items-center justify-center hover:shadow-md`}
            aria-label={`Share on ${link.name}`}
            title={`Share on ${link.name}`}
          >
            {renderIcon(link)}
          </a>
        ))}
      </div>
    </div>
  );
} 