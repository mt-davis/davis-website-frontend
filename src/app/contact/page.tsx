'use client';

import { useState, useRef, useEffect } from 'react';
import ArticleHeader from '@/components/ArticleHeader';
import Footer from '@/components/Footer';
import HCaptcha from '@hcaptcha/react-hcaptcha';

// Define test key constant
const TEST_SITE_KEY = '10000000-ffff-ffff-ffff-000000000001';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const captchaRef = useRef<HCaptcha>(null);
  const [siteKey, setSiteKey] = useState(TEST_SITE_KEY);

  useEffect(() => {
    // Log environment variables in development
    if (process.env.NODE_ENV === 'development') {
      console.log('NEXT_PUBLIC_HCAPTCHA_SITE_KEY:', process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY);
    }
    
    // Set site key from environment variable if available
    if (process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY) {
      setSiteKey(process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      let token;
      try {
        token = await captchaRef.current?.execute();
        if (!token) {
          throw new Error('Failed to get hCaptcha token');
        }
      } catch (captchaError) {
        console.error('hCaptcha error:', captchaError);
        setStatus('error');
        setErrorMessage('Failed to verify captcha. Please try again.');
        return;
      }
      
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, hcaptchaToken: token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      captchaRef.current?.resetCaptcha();
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message');
    }
  };

  return (
    <>
      <ArticleHeader />
      
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Have a question or want to collaborate? I'd love to hear from you. 
              Fill out the form below and I'll get back to you as soon as possible.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <p className="text-xs text-gray-500 mt-2">Using site key: {siteKey}</p>
            )}
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
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
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Your message here..."
                />
              </div>

              {/* HCaptcha */}
              <div className="flex justify-center">
                <HCaptcha
                  ref={captchaRef}
                  sitekey={siteKey}
                  size="invisible"
                  onError={(err) => {
                    console.error('hCaptcha error:', err);
                    setStatus('error');
                    setErrorMessage('Failed to load captcha. Please check your internet connection.');
                  }}
                  onLoad={() => {
                    console.log('hCaptcha loaded successfully');
                  }}
                />
              </div>

              {/* Status Messages */}
              {status === 'error' && (
                <div className="text-red-600 text-center p-3 bg-red-50 rounded-lg">
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
      </main>

      <Footer />
    </>
  );
} 