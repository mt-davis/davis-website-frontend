import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontFamily: {
        script: ['var(--font-great-vibes)'],
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      touchAction: {
        'pan-x': 'pan-x',
        'pan-left': 'pan-left',
        'pan-right': 'pan-right',
        'pan-y': 'pan-y',
        'pan-up': 'pan-up',
        'pan-down': 'pan-down',
        'pinch-zoom': 'pinch-zoom',
      },
    },
  },
  plugins: [],
};

export default config; 