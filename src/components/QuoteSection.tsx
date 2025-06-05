import React from 'react';

export default function QuoteSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative">
          {/* Large quotation mark */}
          <div className="absolute -top-8 left-0 text-6xl text-gray-400 font-serif">"</div>
          
          {/* Quote text */}
          <blockquote className="relative z-10">
            <p className="text-2xl md:text-3xl text-gray-900 font-light leading-relaxed text-center italic">
              Leadership is not about being in charge. It's about taking care of those in your charge.
            </p>
            
            {/* Author */}
            <footer className="mt-8">
              <div className="flex items-center justify-center">
                <div className="h-px w-12 bg-gray-500 mr-4"></div>
                <cite className="text-gray-800 not-italic font-medium">Simon Sinek</cite>
                <div className="h-px w-12 bg-gray-500 ml-4"></div>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
} 