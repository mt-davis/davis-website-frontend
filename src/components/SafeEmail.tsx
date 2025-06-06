"use client";

import { useState, useEffect } from 'react';

interface SafeEmailProps {
  emailUser: string;
  emailDomain: string;
  className?: string;
}

export default function SafeEmail({ emailUser, emailDomain, className = '' }: SafeEmailProps) {
  const [email, setEmail] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Combine email parts only after component mounts
    const parts = [emailUser, emailDomain];
    setEmail(parts.join('@'));
  }, [emailUser, emailDomain]);

  if (!isClient) {
    return <span className={className}>[Loading...]</span>;
  }

  // Convert email to HTML entities
  const obfuscatedEmail = email.split('').map(char => `&#${char.charCodeAt(0)};`).join('');

  return (
    <span 
      className={`${className} relative inline-block`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        window.location.href = `mailto:${email}`;
      }}
      style={{ cursor: 'pointer' }}
    >
      {/* Hidden real email for accessibility */}
      <span className="sr-only">{email}</span>
      
      {/* Visible obfuscated email */}
      <span 
        aria-hidden="true"
        className="select-none"
        style={{
          unicodeBidi: 'bidi-override',
          direction: isHovered ? 'ltr' : 'rtl',
        }}
        dangerouslySetInnerHTML={{
          __html: isHovered ? obfuscatedEmail : obfuscatedEmail.split('').reverse().join('')
        }}
      />
    </span>
  );
} 