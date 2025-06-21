'use client';

import { useState, useRef, useEffect } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';

interface ContactFormProps {
  onClose: () => void;
}

export default function ContactForm({ onClose }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const captchaRef = useRef<any>(null);
  const [siteKey, setSiteKey] = useState<string>('');

  useEffect(() => {
    // Get the site key from environment variables
    const envSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!envSiteKey) {
      console.error('NEXT_PUBLIC_TURNSTILE_SITE_KEY is not configured');
      return;
    }
    setSiteKey(envSiteKey);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      let token = captchaRef.current?.getResponse?.();
      if (!token) {
        // Turnstile auto-executes, but fallback if needed
        token = captchaRef.current?.getValue?.();
      }
      if (!token) {
        throw new Error('Please complete the captcha verification');
      }
      const formPayload = { ...formData, turnstileToken: token };
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formPayload)
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
      setTimeout(() => {
        onClose();
        setStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
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
                // Optionally store token in ref if needed
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
              : 'bg-pink-500 hover:bg-pink-600 active:bg-pink-700'}
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
  );
} 