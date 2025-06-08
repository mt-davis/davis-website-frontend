import { Metadata } from 'next';

const siteUrl = 'https://mtdavis.info';
const siteTitle = 'Marquese T Davis | IT Leadership & Innovation';
const siteDescription = 'IT Leadership expert specializing in digital transformation, strategy, and technological innovation. Join me on a journey through technology leadership.';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: '%s | Marquese T Davis'
  },
  description: siteDescription,
  keywords: [
    'IT Leadership',
    'Digital Transformation',
    'Technology Strategy',
    'Innovation',
    'Enterprise Technology',
    'Executive Leadership',
    'Technology Management'
  ],
  authors: [{ name: 'Marquese T Davis' }],
  creator: 'Marquese T Davis',
  publisher: 'Marquese T Davis',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: siteTitle,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Marquese T Davis - IT Leadership'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/images/og-image.png'],
    creator: '@mtdavis',
    site: '@mtdavis'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // Add other verification codes as needed
  },
  alternates: {
    canonical: siteUrl,
    types: {
      'application/rss+xml': `${siteUrl}/feed.xml`,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon-16x16.png',
      }
    ]
  },
  manifest: '/site.webmanifest',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ],
  category: 'technology'
};

export const generateMetadata = (
  title?: string,
  description?: string,
  image?: string,
  noIndex?: boolean
): Metadata => {
  const metadata: Metadata = {
    ...defaultMetadata,
    title: title || defaultMetadata.title,
    description: description || defaultMetadata.description,
  };

  if (image) {
    metadata.openGraph = {
      ...metadata.openGraph,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || siteTitle
        }
      ]
    };
    metadata.twitter = {
      ...metadata.twitter,
      images: [image]
    };
  }

  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: false
    };
  }

  return metadata;
};
