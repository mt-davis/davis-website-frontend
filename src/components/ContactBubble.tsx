'use client';

import { useState, useRef, useEffect } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

// Define test key constant
const TEST_SITE_KEY = '10000000-ffff-ffff-ffff-000000000001';

export default function ContactBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const captchaRef = useRef<HCaptcha>(null);
  const [siteKey, setSiteKey] = useState<string>('');

  useEffect(() => {
    // Get the site key from environment variables
    const envSiteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;
    if (!envSiteKey) {
      console.error('NEXT_PUBLIC_HCAPTCHA_SITE_KEY is not configured');
      return;
    }
    setSiteKey(envSiteKey);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      let token = captchaRef.current?.getResponse();
      
      if (!token) {
        token = await captchaRef.current?.execute() || undefined;
      }
      
      if (!token) {
        throw new Error('Please complete the captcha verification');
      }
      
      const formPayload = { ...formData, hcaptchaToken: token };
      
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = data.error || 'Failed to send message';
        if (data.details) {
          if (Array.isArray(data.details)) {
            errorMessage = data.details
              .map((err: any) => `${err.path.join('.')}: ${err.message}`)
              .join('\n');
          } else if (typeof data.details === 'string') {
            errorMessage = data.details;
          } else {
            errorMessage = JSON.stringify(data.details, null, 2);
          }
        }
        throw new Error(errorMessage);
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      captchaRef.current?.resetCaptcha();
      // Close the modal after successful submission
      setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message');
    }
  };

  return (
    <>
      {/* Floating Contact Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[calc(2rem+env(safe-area-inset-bottom))] right-[calc(2rem+env(safe-area-inset-right))] w-14 h-14 md:w-16 md:h-16 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 flex items-center justify-center z-50 touch-manipulation"
        aria-label="Contact Us"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-7 h-7 md:w-8 md:h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
          />
        </svg>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          {/* Modal Content */}
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto relative">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-200 relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="flex justify-center items-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-black">Get in Touch</h2>
                  <p className="text-gray-600 mt-2">
                    Have a question or want to collaborate? I'd love to hear from you.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Your name"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Subject Field */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="What's this about?"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Your message here..."
                  />
                </div>

                {/* HCaptcha */}
                <div className="flex justify-center">
                  <div className="h-[100px] min-w-[300px] flex items-center justify-center bg-gray-50 rounded-lg p-4">
                    <HCaptcha
                      ref={captchaRef}
                      sitekey={siteKey}
                      size="normal"
                      onError={(err) => {
                        console.error('hCaptcha error:', err);
                        setStatus('error');
                        setErrorMessage('Failed to load captcha. Please check your internet connection.');
                      }}
                      onLoad={() => {
                        console.log('hCaptcha loaded successfully with site key:', siteKey);
                      }}
                      onVerify={(token) => {
                        console.log('hCaptcha verified with token:', token);
                      }}
                      onExpire={() => {
                        console.log('hCaptcha expired');
                      }}
                    />
                  </div>
                </div>

                {/* Status Messages */}
                {status === 'error' && (
                  <div className="text-red-600 text-center p-3 bg-red-50 rounded-lg whitespace-pre-wrap">
                    {errorMessage}
                  </div>
                )}
                {status === 'success' && (
                  <div className="text-green-600 text-center p-3 bg-green-50 rounded-lg">
                    Message sent successfully! I'll get back to you soon.
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className={`
                      px-8 py-3 rounded-lg text-white font-semibold
                      ${status === 'loading'
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}
                      transition-colors duration-200
                      flex items-center space-x-2
                    `}
                  >
                    {status === 'loading' ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Sending...</span>
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 