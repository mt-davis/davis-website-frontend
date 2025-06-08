'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ArticleHeader from '@/components/ArticleHeader';
import Footer from '@/components/Footer';
import confetti from 'canvas-confetti';
import { UpgradeBanner } from '@/components/ui/upgrade-banner';

// Import the type without using the default import
const HCaptcha = dynamic<any>(() => import('@hcaptcha/react-hcaptcha'), {
  ssr: false,
  loading: () => (
    <div className="h-[100px] min-w-[300px] flex items-center justify-center bg-gray-50 rounded-lg p-4">
      <div className="animate-pulse">Loading captcha...</div>
    </div>
  ),
});

function shootConfetti() {
  // Left cannon
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: 0, y: 0.8 },
    angle: 60,
    colors: ['#ec4899', '#f472b6', '#fbcfe8'], // Pink shades to match your theme
  });

  // Right cannon
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: 1, y: 0.8 },
    angle: 120,
    colors: ['#ec4899', '#f472b6', '#fbcfe8'], // Pink shades to match your theme
  });
}

export default function ExecutiveCoachRFPForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    experience: '',
    approach: '',
    references: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const captchaRef = useRef<any>(null);
  const [siteKey, setSiteKey] = useState<string>('');

  useEffect(() => {
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
      setFormData({ name: '', email: '', company: '', experience: '', approach: '', references: '' });
      captchaRef.current?.resetCaptcha();
      
      // Shoot confetti on success
      shootConfetti();
      
      // Shoot another round of confetti after a short delay
      setTimeout(() => {
        shootConfetti();
      }, 700);
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message');
    }
  };

  return (
    <>
      <ArticleHeader />
      <main className="min-h-screen bg-white pt-20 sm:pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Add UpgradeBanner Demo */}
          <div className="mb-16">
            <UpgradeBanner
              buttonText="Submit by July 14, 2025"
              description="Executive Coach RFP - Open for Submissions"
              onClose={() => {}}
              onClick={() => {
                // Scroll to form
                const form = document.querySelector('form');
                form?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </div>
          
          {/* Page Header */}
          <div className="text-center mb-12 mt-12">
            <h1 className="text-4xl font-bold mb-4">Executive Coach RFP Submission</h1>
            <p className="text-gray-600 mb-8">
              Submit your proposal for the Executive Career & Leadership Coach position
            </p>
            <div className="w-24 h-1 bg-blue-500 mx-auto"></div>
          </div>

          {/* Form Section */}
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                  placeholder="Your full name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
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

              {/* Company/Organization Field */}
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company/Organization
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                  placeholder="Your company or organization"
                />
              </div>

              {/* Coaching Experience Field */}
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                  Coaching Experience
                </label>
                <textarea
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                  placeholder="Describe your relevant coaching experience and background"
                />
              </div>

              {/* Coaching Approach Field */}
              <div>
                <label htmlFor="approach" className="block text-sm font-medium text-gray-700 mb-1">
                  Coaching Approach
                </label>
                <textarea
                  id="approach"
                  name="approach"
                  value={formData.approach}
                  onChange={(e) => setFormData({ ...formData, approach: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                  placeholder="Describe your coaching philosophy and approach"
                />
              </div>

              {/* References Field */}
              <div>
                <label htmlFor="references" className="block text-sm font-medium text-gray-700 mb-1">
                  References
                </label>
                <textarea
                  id="references"
                  name="references"
                  value={formData.references}
                  onChange={(e) => setFormData({ ...formData, references: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                  placeholder="Please provide two references with similar leadership coaching objectives"
                />
              </div>

              {/* HCaptcha */}
              <div className="flex justify-center">
                <div className="h-[100px] min-w-[300px] flex items-center justify-center bg-gray-50 rounded-lg p-4">
                  {siteKey && (
                    <HCaptcha
                      sitekey={siteKey}
                      size="normal"
                      onError={(err: string) => {
                        console.error('hCaptcha error:', err);
                        setStatus('error');
                        setErrorMessage('Failed to load captcha. Please check your internet connection.');
                      }}
                      onLoad={() => {
                        console.log('hCaptcha loaded successfully');
                      }}
                      ref={captchaRef}
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
                  Your proposal has been submitted successfully! We will review it and get back to you soon.
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
                      <span>Submitting...</span>
                    </>
                  ) : (
                    'Submit Proposal'
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