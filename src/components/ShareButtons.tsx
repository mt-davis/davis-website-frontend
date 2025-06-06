'use client';

import { FaLinkedin, FaFacebook } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';
import { useEffect, useState } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description: string;
}

export default function ShareButtons({ url: initialUrl, title, description }: ShareButtonsProps) {
  const [url, setUrl] = useState(initialUrl);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  // Encode the parameters for sharing
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  // Share URLs for different platforms
  const xUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const emailUrl = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`;

  const shareButtons = [
    {
      name: 'X',
      icon: FaXTwitter,
      url: xUrl,
      color: 'bg-black hover:bg-gray-900'
    },
    {
      name: 'Facebook',
      icon: FaFacebook,
      url: facebookUrl,
      color: 'bg-[#4267B2] hover:bg-[#365899]'
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      url: linkedinUrl,
      color: 'bg-[#0077B5] hover:bg-[#006399]'
    },
    {
      name: 'Email',
      icon: MdEmail,
      url: emailUrl,
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ];

  return (
    <div className="flex flex-col items-end space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">Share this project</h3>
      <div className="flex space-x-3">
        {shareButtons.map((button) => {
          const Icon = button.icon;
          return (
            <a
              key={button.name}
              href={button.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${button.color} text-white p-3 rounded-full transition-transform hover:scale-110`}
              title={`Share on ${button.name}`}
              onClick={(e) => {
                e.preventDefault();
                window.open(button.url, 'share', 'width=550,height=435');
              }}
            >
              <Icon className="w-5 h-5" />
              <span className="sr-only">Share on {button.name}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
} 