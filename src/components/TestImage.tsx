"use client";

import Image from 'next/image';

export default function TestImage() {
  return (
    <div className="p-8 bg-white">
      <h2 className="text-2xl font-bold mb-4">Image Test</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {/* Test with standard img tag */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Standard img tag:</h3>
          <img 
            src="/images/cybersecurity.png" 
            alt="Cybersecurity" 
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
        
        {/* Test with Next.js Image component */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Next.js Image with width/height:</h3>
          <div style={{ position: 'relative', width: '500px', height: '300px' }}>
            <Image 
              src="/images/cybersecurity.png" 
              alt="Cybersecurity" 
              width={500}
              height={300}
            />
          </div>
        </div>
        
        {/* Test with Next.js Image component using fill */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Next.js Image with fill:</h3>
          <div style={{ position: 'relative', width: '500px', height: '300px' }}>
            <Image 
              src="/images/cybersecurity.png" 
              alt="Cybersecurity" 
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
