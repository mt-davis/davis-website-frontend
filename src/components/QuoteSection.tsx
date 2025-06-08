import React from 'react';

export default function QuoteSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative">
          {/* Large quotation mark */}
          <div className="absolute -top-8 left-0 text-6xl text-gray-400 font-serif">"</div>
          
          {/* Quote text */}
          <blockquote className="text-2xl font-semibold text-gray-900 mb-4">
            &ldquo;The best way to predict the future is to create it.&rdquo;
          </blockquote>
          <p className="text-gray-600">
            Let&apos;s create something extraordinary together.
          </p>
          
          {/* Author */}
          <footer className="mt-8">
            <div className="flex items-center justify-center">
              <div className="h-px w-12 bg-gray-500 mr-4"></div>
              <cite className="text-gray-800 not-italic font-medium">Simon Sinek</cite>
              <div className="h-px w-12 bg-gray-500 ml-4"></div>
            </div>
          </footer>
        </div>
      </div>
    </section>
  );
} 