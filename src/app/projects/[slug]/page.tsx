import Image from "next/image";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypePrism from 'rehype-prism-plus';
import remarkFlexibleMarkers from 'remark-flexible-markers';
import remarkBreaks from 'remark-breaks';
import remarkEmoji from 'remark-emoji';
import { notFound } from "next/navigation";
import ArticleHeader from '@/components/ArticleHeader';
import Footer from '@/components/Footer';
import UnderConstructionPage from '@/components/UnderConstructionPage';
import ShareButtons from '@/components/ShareButtons';
import Obfuscate from 'react-obfuscate';
import { Metadata } from 'next';
import { defaultMetadata } from '@/lib/seo';
import { fetchAPI } from '@/lib/api';

// Define the class mapping type
type ClassMapping = {
  'highlight': string;
  'note': string;
  'warning': string;
  'text-black': string;
  'text-white': string;
};

// Custom markdown components for consistent spacing, padding & headings
const mdComponents = {
  h1: ({ node, ...props }: any) => <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />,
  h2: ({ node, ...props }: any) => <h2 className="text-3xl font-semibold mt-6 mb-3" {...props} />,
  h3: ({ node, ...props }: any) => <h3 className="text-2xl font-semibold mt-5 mb-3" {...props} />,
  h4: ({ node, ...props }: any) => <h4 className="text-xl font-semibold mt-4 mb-2" {...props} />,
  h5: ({ node, ...props }: any) => <h5 className="text-lg font-semibold mt-3 mb-2" {...props} />,
  p: ({ node, ...props }: any) => <p className="mb-4 leading-relaxed text-gray-700" {...props} />,
  ul: ({ node, ordered, ...props }: any) => (
    <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700" {...props} />
  ),
  ol: ({ node, ordered, ...props }: any) => (
    <ol className="list-decimal pl-6 mb-4 space-y-2 text-gray-700" {...props} />
  ),
  li: ({ node, ...props }: any) => <li className="mb-2" {...props} />,
  blockquote: ({ node, ...props }: any) => (
    <blockquote className="border-l-4 border-pink-500 pl-4 italic text-gray-600 mb-6 py-2 bg-gray-50" {...props} />
  ),
  a: ({ node, href, ...props }: any) => (
    <a 
      href={href}
      className="text-pink-500 hover:text-pink-600 underline transition-colors" 
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props} 
    />
  ),
  code: ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    
    return inline ? (
      <code className="bg-gray-100 rounded px-1 py-0.5 text-sm font-mono text-pink-600" {...props}>
        {children}
      </code>
    ) : (
      <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
        <code className={`language-${language} text-gray-100`} {...props}>
          {children}
        </code>
      </pre>
    );
  },
  pre: ({ node, ...props }: any) => (
    <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4 text-gray-100" {...props} />
  ),
  table: ({ node, ...props }: any) => (
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full divide-y divide-gray-200" {...props} />
    </div>
  ),
  thead: ({ node, ...props }: any) => (
    <thead className="bg-gray-50" {...props} />
  ),
  tbody: ({ node, ...props }: any) => (
    <tbody className="divide-y divide-gray-200 bg-white" {...props} />
  ),
  tr: ({ node, ...props }: any) => (
    <tr className="hover:bg-gray-50 transition-colors" {...props} />
  ),
  th: ({ node, ...props }: any) => (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />
  ),
  td: ({ node, ...props }: any) => (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" {...props} />
  ),
  img: ({ node, src, alt, ...props }: any) => (
    <span className="relative block w-full h-auto my-6">
      <Image
        src={src || ''}
        alt={alt || ''}
        width={800}
        height={400}
        className="rounded-lg shadow-lg"
        {...props}
      />
    </span>
  ),
  hr: ({ node, ...props }: any) => (
    <hr className="my-8 border-t-2 border-gray-200" {...props} />
  ),
  del: ({ node, ...props }: any) => (
    <del className="text-gray-500 line-through" {...props} />
  ),
  em: ({ node, ...props }: any) => (
    <em className="italic text-gray-700" {...props} />
  ),
  strong: ({ node, ...props }: any) => (
    <strong className="font-bold text-gray-900" {...props} />
  ),
  mark: ({ node, ...props }: any) => (
    <mark className="bg-yellow-200 px-1 rounded" {...props} />
  ),
  sub: ({ node, ...props }: any) => (
    <sub className="text-sm" {...props} />
  ),
  sup: ({ node, ...props }: any) => (
    <sup className="text-sm" {...props} />
  ),
  div: ({ node, className, ...props }: any) => {
    const classMapping: ClassMapping = {
      'highlight': 'bg-yellow-50 p-4 rounded-lg border border-yellow-200 my-4',
      'note': 'bg-blue-50 p-4 rounded-lg border border-blue-200 my-4',
      'warning': 'bg-red-50 p-4 rounded-lg border border-red-200 my-4',
      'text-black': 'text-gray-900',
      'text-white': 'text-white',
    };

    const classes = className && className in classMapping 
      ? classMapping[className as keyof ClassMapping]
      : '';

    return (
      <div className={classes} {...props} />
    );
  },
};

async function getProject(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  
  // If no API URL is configured, return null
  if (!apiUrl) {
    console.warn('NEXT_PUBLIC_STRAPI_API_URL is not configured');
    return null;
  }

  try {
    const res = await fetch(
      `${apiUrl}/api/projects?filters[slug][$eq]=${slug}&populate=*`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      console.error('Failed to fetch project:', await res.text());
      return null;
    }

    const data = await res.json();
    return data.data?.[0];
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const project = await fetchAPI('projects', {
      filters: {
        slug: {
          $eq: params.slug
        }
      },
      populate: ['cover', 'categories', 'block']
    });

    if (!project.data?.[0]) {
      return defaultMetadata;
    }

    const projectData = project.data[0];
    const seoBlock = projectData.block?.find((b: any) => b.__component === 'shared.seo');

    return {
      ...defaultMetadata,
      title: seoBlock?.metaTitle || projectData.title || defaultMetadata.title,
      description: seoBlock?.metaDescription || projectData.description || defaultMetadata.description,
      openGraph: {
        ...defaultMetadata.openGraph,
        title: seoBlock?.metaTitle || projectData.title || defaultMetadata.title,
        description: seoBlock?.metaDescription || projectData.description || defaultMetadata.description as string,
      },
      twitter: {
        ...defaultMetadata.twitter,
        title: seoBlock?.metaTitle || projectData.title || defaultMetadata.title,
        description: seoBlock?.metaDescription || projectData.description || defaultMetadata.description as string,
      }
    };
  } catch (error) {
    console.error('Error fetching project metadata:', error);
    return defaultMetadata;
  }
}

export default async function ProjectDetail({ params }: { params: { slug: string } }) {
  const project = await fetchAPI('projects', {
    filters: {
      slug: {
        $eq: params.slug
      }
    },
    populate: ['cover', 'categories', 'block']
  });

  if (!project.data?.[0]) {
    return notFound();
  }

  const projectData = project.data[0];
  const coverUrl = projectData.cover?.formats?.large?.url || projectData.cover?.formats?.medium?.url || projectData.cover?.url;
  const richTextBlock = projectData.block?.find((b: any) => b.__component === 'shared.rich-text');

  return (
    <>
      <ArticleHeader />
      <main className="min-h-screen bg-white pt-20">
        {/* Hero Section */}
        <div className="relative w-full h-[60vh] min-h-[500px]">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={projectData.title || 'Project cover image'}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-center text-white mb-6 max-w-4xl">
              {projectData.title}
            </h1>
            {projectData.description && (
              <p className="text-xl md:text-2xl text-white/90 text-center max-w-2xl">
                {projectData.description}
              </p>
            )}

            {/* Categories */}
            {projectData.categories && projectData.categories.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {projectData.categories.map((category: any) => (
                  <span
                    key={category.id}
                    className="text-sm text-white bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Project Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Rich Text Content */}
          {richTextBlock && (
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[
                  remarkGfm,
                  remarkMath,
                  remarkFlexibleMarkers,
                  remarkBreaks,
                  remarkEmoji
                ]}
                rehypePlugins={[rehypeRaw, rehypeKatex, rehypePrism]}
                components={mdComponents}
              >
                {richTextBlock.body}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
