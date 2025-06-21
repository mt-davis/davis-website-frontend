'use client';

import { useState, useRef, useEffect } from 'react';
import ArticleHeader from '@/components/ArticleHeader';
import Footer from '@/components/Footer';
import { Turnstile } from '@marsidev/react-turnstile';

// Define test key constant
const TEST_SITE_KEY = '1x00000000000000000000AA';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const captchaRef = useRef<any>(null);
  const [siteKey, setSiteKey] = useState(TEST_SITE_KEY);

  useEffect(() => {
    // Log environment variables in development
    if (process.env.NODE_ENV === 'development') {
      console.log('NEXT_PUBLIC_TURNSTILE_SITE_KEY:', process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
    }
    
    // Set site key from environment variable if available
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      setSiteKey(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      let token = captchaRef.current?.getResponse?.();
      if (!token) {
        token = captchaRef.current?.getValue?.();
      }
      if (!token) {
        throw new Error('Please complete the captcha verification');
      }
      const formPayload = { ...formData, turnstileToken: token };
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
      captchaRef.current?.reset?.();
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

              {/* Turnstile Captcha */}
              <div className="flex justify-center">
                <div className="h-[100px] min-w-[300px] flex items-center justify-center bg-gray-50 rounded-lg p-4">
                  {siteKey && (
                    <Turnstile
                      siteKey={siteKey}
                      onSuccess={(token: string) => {
                        if (captchaRef.current) captchaRef.current.token = token;
                      }}
                      ref={captchaRef}
                      options={{ theme: 'light' }}
                    />
                  )}
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
      </main>

      <Footer />
    </>
  );
} 