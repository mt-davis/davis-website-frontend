export default function UnderConstructionPage({ title }: { title: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
      {/* Fun Animation Container */}
      <div className="relative w-72 h-72 mb-4">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Top decorative elements */}
          <div className="absolute top-0 left-1/4 text-3xl animate-float-slow opacity-30">🔨</div>
          <div className="absolute top-4 right-1/4 text-2xl animate-float-delay opacity-20">✨</div>
          <div className="absolute top-8 left-1/3 text-2xl animate-spin-slow opacity-25">⚙️</div>
          
          {/* Middle-left decorative elements */}
          <div className="absolute top-1/3 left-0 text-2xl animate-float-delay-2 opacity-20">🔧</div>
          <div className="absolute top-1/2 left-4 text-3xl animate-spin-slow-delay opacity-25">🚧</div>
          
          {/* Middle-right decorative elements */}
          <div className="absolute top-1/3 right-0 text-2xl animate-float-delay-3 opacity-20">⚡</div>
          <div className="absolute top-1/2 right-4 text-3xl animate-spin-slow-delay-2 opacity-25">🎯</div>
          
          {/* Bottom decorative elements */}
          <div className="absolute bottom-8 left-1/4 text-2xl animate-float-delay-4 opacity-20">🛠️</div>
          <div className="absolute bottom-4 right-1/3 text-3xl animate-spin-slow-delay-3 opacity-25">📝</div>
        </div>

        {/* Main elements */}
        {/* Floating Construction Sign */}
        <div className="absolute inset-0 animate-float-spin text-8xl flex items-center justify-center z-10">
          🚧
        </div>
        {/* Tools with bounce effect */}
        <div className="relative inset-0 animate-bounce-slow delay-300 text-7xl flex items-center justify-center translate-y-4 z-10">
          <span className="absolute -top-6 right-2 text-4xl animate-steam-right">⚙️</span>
          <span className="absolute -top-8 left-2 text-3xl animate-steam-left">🔧</span>
          🛠️
        </div>
        {/* Progress indicator with pulsing and floating */}
        <div className="absolute inset-0 animate-thought-bubble text-6xl flex items-center justify-center -translate-x-16 -translate-y-8 z-10">
          <span className="animate-bubble-pop">⚡</span>
        </div>
      </div>

      {/* Message */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        &ldquo;Under Construction&rdquo;
      </h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
        "{title}"
      </h2>
      <p className="text-xl text-gray-600 mb-8">
        We&apos;re working hard to bring you something amazing!
      </p>

      {/* Fun Facts with slide-up effect */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg max-w-xl animate-slide-up">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Random Fun Fact While You Wait 🔨
        </h3>
        <p className="text-gray-600">
          Did you know? The Empire State Building was constructed in just 410 days,
          ahead of schedule and under budget. We're aiming to be just as efficient! 
        </p>
      </div>
    </div>
  );
} 