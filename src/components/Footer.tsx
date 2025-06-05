"use client";

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faMediumM } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black text-white py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Copyright & Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Davis</h3>
            <p className="text-gray-400 mb-2">IT Leadership & Technological Advancement</p>
            <p className="text-gray-400">&copy; {currentYear} All rights reserved.</p>
          </div>
          
          {/* Column 2: Quick Links */}
          
          {/* Column 3: Social & Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a 
                href="https://www.linkedin.com/in/marquesedavis/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FontAwesomeIcon icon={faLinkedin} size="lg" />
              </a>
              <a 
                href="https://medium.mtdavis.info/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FontAwesomeIcon icon={faMediumM} size="lg" />
              </a>
            </div>
            <p className="text-gray-400">Get in touch for collaborations and opportunities.</p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
          Made with ❤️and🍕in Connecticut
        </div>
      </div>
    </footer>
  );
}
